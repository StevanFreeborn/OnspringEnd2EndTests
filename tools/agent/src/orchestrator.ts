import fs from 'node:fs';
import path from 'node:path';
import { buildCatalog } from './catalog.js';
import { indexMarkdownSections, rankSections } from './helpSearch.js';
import { getRunnerAdapter, isValidRunnerName, resolveDefaultRunner, RunnerName } from './runners.js';
import { loadEnv, parseCliArgs, runCommand, runShellCommand, toRepoRel, writeErr, writeOut } from './utils.js';
import { createAgentWorktree, removeAgentWorktree, slugify, WorktreeHandle } from './worktree.js';

export type OrchestratorAttemptRecord = {
  attempt: number;
  runnerExitCode: number;
  runnerSeconds: number;
  detectedSpecs: string[];
  changedFiles: string[];
  verifyPassed: boolean;
  verifySummary: string;
  failingStages: string[];
  promptFile: string;
  runnerLogFile: string;
  verifyReportFile: string;
};

export type OrchestratorReport = {
  runId: string;
  status: 'passed' | 'failed' | 'dry-run';
  runner: RunnerName;
  brief: string;
  worktreeDir: string;
  branch: string | null;
  runDir: string;
  attempts: OrchestratorAttemptRecord[];
  changedFiles: string[];
  detectedSpecs: string[];
  commitSha?: string;
  draftPrUrl?: string;
  error?: string;
};

export type VerifyWorktreeOutcome = {
  passed: boolean;
  summary: string;
  failingStages: string[];
  rawReport: unknown;
  failureDetails: string;
};

export type OrchestratorConfig = {
  brief: string;
  runner: RunnerName;
  runnerCmd?: string;
  model?: string;
  domain?: string;
  maxAttempts: number;
  baseRef: string;
  inPlace: boolean;
  installDeps: boolean;
  skipE2e: boolean;
  noFailFast: boolean;
  commit: boolean;
  draftPr: boolean;
  cleanupWorktree: boolean;
  dryRun: boolean;
  quiet?: boolean;
  heartbeatSeconds?: number;
};

export type OrchestratorTestDeps = {
  verifyWorktree?: (worktreeDir: string, detectedSpecs: readonly string[]) => Promise<VerifyWorktreeOutcome>;
};

export function parseChangedFilesFromPorcelain(stdout: string): {
  changedFiles: string[];
  detectedSpecs: string[];
} {
  const changedFiles: string[] = [];
  const seen = new Set<string>();

  for (const rawLine of stdout.split(/\r?\n/)) {
    if (rawLine.length < 4) {
      continue;
    }

    let filePart = rawLine.slice(3).trim();
    const renameArrowIdx = filePart.indexOf(' -> ');
    if (renameArrowIdx >= 0) {
      filePart = filePart.slice(renameArrowIdx + 4).trim();
    }

    if (filePart.startsWith('"') && filePart.endsWith('"') && filePart.length >= 2) {
      filePart = filePart.slice(1, -1);
    }

    const normalized = filePart.replace(/\\/g, '/');
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      changedFiles.push(normalized);
    }
  }

  const detectedSpecs = changedFiles.filter(f => f.startsWith('tests/') && f.endsWith('.spec.ts'));
  return { changedFiles, detectedSpecs };
}

function gatherPreFlightContext(repoRoot: string, brief: string, domain?: string): string {
  const sections: string[] = [];

  if (domain) {
    try {
      const catalog = buildCatalog(repoRoot, domain, 'all');
      const moduleLines = catalog.uiModules.slice(0, 12).map(m => `- \`${m.file}\`: ${m.exports.join(', ')}`);
      const modelLines = catalog.models.entities.slice(0, 8).map(m => `- \`${m.file}\`: ${m.symbols.join(', ')}`);
      const fixtureLines = catalog.fixtures.builders.slice(0, 8).map(f => `- \`${f.file}\`: ${f.symbols.join(', ')}`);
      sections.push(
        [
          `## Pre-Flight Catalog (\`domain=${domain}\`)`,
          moduleLines.length > 0 ? `### UI Modules\n${moduleLines.join('\n')}` : '',
          modelLines.length > 0 ? `### Models\n${modelLines.join('\n')}` : '',
          fixtureLines.length > 0 ? `### Fixtures\n${fixtureLines.join('\n')}` : '',
        ]
          .filter(Boolean)
          .join('\n\n')
      );
    } catch {
      // Pre-flight catalog lookup is best-effort.
    }
  }

  try {
    const env = loadEnv(repoRoot);
    const docsDir = env.ONSPRING_HELP_DOCS_DIR?.trim();
    if (docsDir && fs.existsSync(docsDir)) {
      const indexed = indexMarkdownSections(docsDir);
      const ranked = rankSections(indexed, brief, 3);
      if (ranked.length > 0) {
        const helpBlocks = ranked.map(
          (r, i) => `### ${i + 1}. \`${r.section.file}\` — ${r.section.breadcrumb}\n${r.section.content.slice(0, 800)}`
        );
        sections.push(`## Pre-Flight Help Center Excerpts\n\n${helpBlocks.join('\n\n')}`);
      }
    }
  } catch {
    // Pre-flight help search is best-effort.
  }

  return sections.join('\n\n');
}

export function buildAttemptPrompt({
  brief,
  attempt,
  maxAttempts,
  preFlightContext,
  previousFailure,
}: {
  brief: string;
  attempt: number;
  maxAttempts: number;
  preFlightContext: string;
  previousFailure?: {
    failingStages: readonly string[];
    changedFiles: readonly string[];
    failureDetails: string;
  };
}): string {
  const parts: string[] = [
    `# Automated Test Authoring Task (Attempt ${attempt}/${maxAttempts})`,
    '',
    '## Test Brief',
    brief.trim(),
    '',
    '## Required Instructions',
    '1. Read `AGENTS.md`, `CONTRIBUTING.md`, and `.agents/skills/author-onspring-test/SKILL.md` before making changes.',
    '2. Follow all Screenplay layer boundaries (`onspring-models` -> `onspring-ui` -> `fixtures` -> `tests`), ESM `.js` relative imports in `packages/*`, `"types": []`, `type` over `interface`, and `AnnotationType.TestId`.',
    '3. Discover existing helpers with `npm run agent -- catalog` and inspect the live UI with `npm run agent -- explore --script <temp.js>` before writing `*.targets.ts`.',
    '4. Do NOT run `git commit` or modify unrelated specs/files.',
  ];

  if (attempt === 1 && preFlightContext.trim()) {
    parts.push('', preFlightContext.trim());
  }

  if (attempt > 1 && previousFailure) {
    parts.push(
      '',
      '## Previous Verification Failed — Fix Root Causes',
      `- Failing stages: ${previousFailure.failingStages.length > 0 ? previousFailure.failingStages.join(', ') : '(unknown)'}`,
      `- Changed files so far: ${previousFailure.changedFiles.length > 0 ? previousFailure.changedFiles.join(', ') : '(none)'}`,
      '- Do NOT weaken assertions, disable ESLint rules, or insert arbitrary `waitForTimeout` calls.',
      '',
      '### Failure Output',
      '```text',
      previousFailure.failureDetails.slice(0, 6000),
      '```'
    );
  }

  return `${parts.join('\n')}\n`;
}

async function detectChangedFiles(worktreeDir: string): Promise<{ changedFiles: string[]; detectedSpecs: string[] }> {
  const statusRes = await runCommand('git', ['status', '--porcelain', '-uall'], { cwd: worktreeDir });
  if (statusRes.exitCode !== 0) {
    return { changedFiles: [], detectedSpecs: [] };
  }
  return parseChangedFilesFromPorcelain(statusRes.stdout);
}

type VerifyJsonStage = {
  name: string;
  passed: boolean;
  skipped?: boolean;
  summary: string;
  output?: string;
};

type VerifyJsonPayload = {
  passed: boolean;
  specPath: string | null;
  stages: VerifyJsonStage[];
};

async function runDefaultVerifyWorktree(
  worktreeDir: string,
  detectedSpecs: readonly string[],
  skipE2e: boolean,
  noFailFast: boolean,
  quiet = false
): Promise<VerifyWorktreeOutcome> {
  if (detectedSpecs.length === 0) {
    return {
      passed: false,
      summary: 'No *.spec.ts file was created or modified under tests/.',
      failingStages: ['spec-detection'],
      rawReport: { passed: false, stages: [] },
      failureDetails: 'The runner completed without creating or modifying any `tests/**/*.spec.ts` file.',
    };
  }

  const cliJs = path.join(worktreeDir, 'tools', 'agent', 'dist', 'src', 'cli.js');
  if (!fs.existsSync(cliJs)) {
    const buildRes = await runCommand('npm', ['run', 'build:agent'], { cwd: worktreeDir });
    if (buildRes.exitCode !== 0) {
      return {
        passed: false,
        summary: 'Failed to compile tools/agent in worktree before verify.',
        failingStages: ['build:agent'],
        rawReport: { passed: false, buildOutput: buildRes.stderr || buildRes.stdout },
        failureDetails: (buildRes.stdout + '\n' + buildRes.stderr).trim(),
      };
    }
  }

  const perSpecReports: VerifyJsonPayload[] = [];
  for (const spec of detectedSpecs) {
    const verifyArgs = [
      cliJs,
      'verify',
      spec,
      ...(skipE2e ? ['--skip-e2e'] : []),
      ...(noFailFast ? ['--no-fail-fast'] : []),
      ...(quiet ? ['--quiet'] : []),
      '--json',
    ];

    const res = await runCommand('node', verifyArgs, {
      cwd: worktreeDir,
      onStderr: quiet
        ? undefined
        : chunk => {
            process.stderr.write(chunk);
          },
    });
    let parsed: VerifyJsonPayload | null = null;
    try {
      parsed = JSON.parse(res.stdout) as VerifyJsonPayload;
    } catch {
      parsed = null;
    }

    if (!parsed) {
      return {
        passed: false,
        summary: `Verify exited with code ${res.exitCode} without valid JSON for ${spec}.`,
        failingStages: ['verify'],
        rawReport: { exitCode: res.exitCode, stdout: res.stdout, stderr: res.stderr },
        failureDetails: `${res.stdout}\n${res.stderr}`.trim(),
      };
    }

    perSpecReports.push(parsed);
    if (!parsed.passed) {
      const failingStages = parsed.stages.filter(s => !s.passed && !s.skipped).map(s => s.name);
      const failureDetails = parsed.stages
        .filter(s => !s.passed && !s.skipped)
        .map(s => `[${s.name}] ${s.summary}\n${s.output ?? ''}`.trim())
        .join('\n\n');

      return {
        passed: false,
        summary: `Verification failed on ${spec}: ${failingStages.join(', ')}`,
        failingStages,
        rawReport: perSpecReports,
        failureDetails,
      };
    }
  }

  return {
    passed: true,
    summary: `Verified ${detectedSpecs.length} spec(s): ${detectedSpecs.join(', ')}`,
    failingStages: [],
    rawReport: perSpecReports,
    failureDetails: '',
  };
}

function buildRunReportMarkdown(report: OrchestratorReport): string {
  const lines = [
    `# Agent Orchestrator Run: \`${report.runId}\``,
    '',
    `- **Status**: ${report.status.toUpperCase()}`,
    `- **Runner**: \`${report.runner}\``,
    `- **Worktree**: \`${report.worktreeDir}\``,
    `- **Branch**: ${report.branch ? `\`${report.branch}\`` : '(in-place)'}`,
    `- **Changed Specs**: ${report.detectedSpecs.length > 0 ? report.detectedSpecs.map(s => `\`${s}\``).join(', ') : '(none)'}`,
    report.commitSha ? `- **Commit**: \`${report.commitSha}\`` : '',
    report.draftPrUrl ? `- **Draft PR**: ${report.draftPrUrl}` : '',
    report.error ? `- **Error**: ${report.error}` : '',
    '',
    '## Brief',
    report.brief.trim(),
    '',
    '## Attempts',
    '| Attempt | Runner Exit | Runner Duration | Verify | Summary |',
    '| :--- | :--- | :--- | :--- | :--- |',
    ...report.attempts.map(
      a =>
        `| ${a.attempt} | ${a.runnerExitCode} | ${a.runnerSeconds.toFixed(1)}s | ${a.verifyPassed ? 'PASS' : 'FAIL'} | ${a.verifySummary.replace(/\|/g, '\\|')} |`
    ),
  ].filter(Boolean);

  return `${lines.join('\n')}\n`;
}

function formatRunTimestamp(date = new Date()): string {
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

export async function executeOrchestrator(
  repoRoot: string,
  config: OrchestratorConfig,
  deps?: OrchestratorTestDeps
): Promise<{ exitCode: number; report: OrchestratorReport }> {
  const logProgress = (line: string): void => {
    if (!config.quiet) {
      writeErr(line);
    }
  };

  const slug = slugify(config.brief.split(/\r?\n/)[0] ?? 'task');
  const runId = `${formatRunTimestamp()}-${slug}`;
  const runDir = path.join(repoRoot, '.agent-runs', runId);
  fs.mkdirSync(runDir, { recursive: true });
  fs.writeFileSync(path.join(runDir, 'brief.md'), config.brief, 'utf8');

  const worktreeHandle: WorktreeHandle | null = config.inPlace
    ? null
    : await createAgentWorktree(repoRoot, {
        slug,
        baseRef: config.baseRef,
        installDeps: config.installDeps,
      });
  const worktreeDir = worktreeHandle ? worktreeHandle.path : repoRoot;

  if (worktreeHandle) {
    logProgress(`[agent] Created worktree '${worktreeHandle.path}' on branch '${worktreeHandle.branch}'.`);
  }

  const report: OrchestratorReport = {
    runId,
    status: config.dryRun ? 'dry-run' : 'failed',
    runner: config.runner,
    brief: config.brief,
    worktreeDir,
    branch: worktreeHandle ? worktreeHandle.branch : null,
    runDir,
    attempts: [],
    changedFiles: [],
    detectedSpecs: [],
  };

  try {
    const preFlightContext = gatherPreFlightContext(worktreeDir, config.brief, config.domain);
    let previousFailure:
      | { failingStages: readonly string[]; changedFiles: readonly string[]; failureDetails: string }
      | undefined;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      const promptContent = buildAttemptPrompt({
        brief: config.brief,
        attempt,
        maxAttempts: config.maxAttempts,
        preFlightContext,
        previousFailure,
      });

      const promptFile = path.join(runDir, `attempt-${attempt}-prompt.md`);
      const runnerLogFile = path.join(runDir, `attempt-${attempt}-runner.log`);
      const verifyReportFile = path.join(runDir, `attempt-${attempt}-verify.json`);
      fs.writeFileSync(promptFile, promptContent, 'utf8');

      if (config.dryRun) {
        report.status = 'dry-run';
        break;
      }

      logProgress(`[agent] Attempt ${attempt}/${config.maxAttempts}: launching '${config.runner}'...`);

      const adapter = getRunnerAdapter(config.runner);
      const invocation = adapter.buildInvocation({
        promptFile,
        runDir,
        worktreeDir,
        model: config.model,
        customCmd: config.runnerCmd,
      });

      const heartbeatMs = (config.heartbeatSeconds ?? 30) * 1000;
      const pollMs = Math.max(10, Math.min(heartbeatMs, 5000));
      const attemptStartedAt = Date.now();
      let lastOutputAt = attemptStartedAt;
      let heartbeatInFlight = false;

      const logStream = fs.createWriteStream(runnerLogFile, { encoding: 'utf8' });
      const commandDisplay = invocation.shellCommand ?? `${invocation.command} ${invocation.args.join(' ')}`;
      logStream.write(`$ ${commandDisplay}\n\n`);

      const handleChunk = (chunk: string): void => {
        lastOutputAt = Date.now();
        logStream.write(chunk);
        if (!config.quiet) {
          process.stderr.write(chunk);
        }
      };

      const heartbeatTimer =
        !config.quiet && heartbeatMs > 0
          ? setInterval(() => {
              if (heartbeatInFlight || Date.now() - lastOutputAt < heartbeatMs) {
                return;
              }
              heartbeatInFlight = true;
              void (async () => {
                try {
                  const { changedFiles: liveChanged } = await detectChangedFiles(worktreeDir);
                  lastOutputAt = Date.now();
                  logProgress(
                    `[agent] Attempt ${attempt}/${config.maxAttempts} still running (${formatElapsed(Date.now() - attemptStartedAt)}, ${liveChanged.length} changed file(s) in worktree, log: ${toRepoRel(repoRoot, runnerLogFile)})`
                  );
                } finally {
                  heartbeatInFlight = false;
                }
              })();
            }, pollMs)
          : null;

      let runnerRes;
      try {
        runnerRes = invocation.shellCommand
          ? await runShellCommand(invocation.shellCommand, {
              cwd: worktreeDir,
              extraEnv: invocation.env,
              onStdout: handleChunk,
              onStderr: handleChunk,
            })
          : await runCommand(invocation.command, invocation.args, {
              cwd: worktreeDir,
              extraEnv: invocation.env,
              onStdout: handleChunk,
              onStderr: handleChunk,
            });
      } finally {
        if (heartbeatTimer) {
          clearInterval(heartbeatTimer);
        }
        await new Promise<void>(resolve => logStream.end(resolve));
      }

      const { changedFiles, detectedSpecs } = await detectChangedFiles(worktreeDir);
      report.changedFiles = changedFiles;
      report.detectedSpecs = detectedSpecs;

      logProgress(
        `[agent] Attempt ${attempt}/${config.maxAttempts}: '${config.runner}' exited ${runnerRes.exitCode} in ${runnerRes.seconds.toFixed(1)}s (${changedFiles.length} changed file(s), ${detectedSpecs.length} spec(s)). Verifying...`
      );

      const verifyOutcome = deps?.verifyWorktree
        ? await deps.verifyWorktree(worktreeDir, detectedSpecs)
        : await runDefaultVerifyWorktree(
            worktreeDir,
            detectedSpecs,
            config.skipE2e,
            config.noFailFast,
            Boolean(config.quiet)
          );

      logProgress(
        `[agent] Attempt ${attempt}/${config.maxAttempts}: verify ${verifyOutcome.passed ? 'PASSED' : 'FAILED'} — ${verifyOutcome.summary}`
      );

      fs.writeFileSync(verifyReportFile, JSON.stringify(verifyOutcome.rawReport, null, 2), 'utf8');

      report.attempts.push({
        attempt,
        runnerExitCode: runnerRes.exitCode,
        runnerSeconds: Number(runnerRes.seconds.toFixed(2)),
        detectedSpecs,
        changedFiles,
        verifyPassed: verifyOutcome.passed,
        verifySummary: verifyOutcome.summary,
        failingStages: verifyOutcome.failingStages,
        promptFile: toRepoRel(repoRoot, promptFile),
        runnerLogFile: toRepoRel(repoRoot, runnerLogFile),
        verifyReportFile: toRepoRel(repoRoot, verifyReportFile),
      });

      if (verifyOutcome.passed) {
        report.status = 'passed';
        break;
      }

      previousFailure = {
        failingStages: verifyOutcome.failingStages,
        changedFiles,
        failureDetails: verifyOutcome.failureDetails,
      };
    }

    if (report.status === 'passed' && (config.commit || config.draftPr)) {
      const commitScope = config.domain ? slugify(config.domain, 24) : 'e2e';
      const titleLine = config.brief.split(/\r?\n/)[0]?.trim() || 'add automated test';
      const commitMessage = `test(${commitScope}): ${titleLine.slice(0, 72)}`;

      const addRes = await runCommand('git', ['add', '-A'], { cwd: worktreeDir });
      if (addRes.exitCode !== 0) {
        throw new Error(`git add failed: ${addRes.stderr || addRes.stdout}`);
      }

      const commitRes = await runCommand('git', ['commit', '-m', commitMessage], { cwd: worktreeDir });
      if (commitRes.exitCode !== 0) {
        throw new Error(`git commit failed: ${commitRes.stderr || commitRes.stdout}`);
      }

      const shaRes = await runCommand('git', ['rev-parse', '--short', 'HEAD'], { cwd: worktreeDir });
      if (shaRes.exitCode === 0) {
        report.commitSha = shaRes.stdout.trim();
      }

      if (config.draftPr) {
        if (!worktreeHandle) {
          throw new Error('--draft-pr requires an isolated worktree branch (cannot run with --in-place).');
        }
        const pushRes = await runCommand('git', ['push', '-u', 'origin', worktreeHandle.branch], { cwd: worktreeDir });
        if (pushRes.exitCode !== 0) {
          throw new Error(`git push failed: ${pushRes.stderr || pushRes.stdout}`);
        }

        const reportMdPath = path.join(runDir, 'report.md');
        fs.writeFileSync(reportMdPath, buildRunReportMarkdown(report), 'utf8');

        const prRes = await runCommand(
          'gh',
          ['pr', 'create', '--draft', '--title', commitMessage, '--body-file', reportMdPath],
          { cwd: worktreeDir }
        );
        if (prRes.exitCode !== 0) {
          throw new Error(`gh pr create failed: ${prRes.stderr || prRes.stdout}`);
        }
        report.draftPrUrl = prRes.stdout.trim();
      }
    }
  } catch (err) {
    report.status = 'failed';
    report.error = err instanceof Error ? err.message : String(err);
  } finally {
    fs.writeFileSync(path.join(runDir, 'report.json'), JSON.stringify(report, null, 2), 'utf8');
    fs.writeFileSync(path.join(runDir, 'report.md'), buildRunReportMarkdown(report), 'utf8');

    const safeToDeleteWorktree =
      worktreeHandle !== null &&
      config.cleanupWorktree &&
      (config.dryRun || Boolean(report.commitSha) || report.changedFiles.length === 0);

    if (worktreeHandle && safeToDeleteWorktree) {
      await removeAgentWorktree(repoRoot, worktreeHandle, config.dryRun);
    }
  }

  const exitCode = report.status === 'passed' || report.status === 'dry-run' ? 0 : 1;
  return { exitCode, report };
}

export async function runOrchestratorCommand(repoRoot: string, argv: readonly string[]): Promise<number> {
  let parsed;
  try {
    parsed = parseCliArgs(argv, {
      flags: new Set([
        '--in-place',
        '--install',
        '--skip-e2e',
        '--no-fail-fast',
        '--commit',
        '--draft-pr',
        '--cleanup-worktree',
        '--quiet',
        '--dry-run',
        '--json',
      ]),
      options: new Set([
        '--brief',
        '--brief-file',
        '--runner',
        '--runner-cmd',
        '--model',
        '--domain',
        '--max-attempts',
        '--base-ref',
      ]),
      maxPositionals: 0,
    });
  } catch (err) {
    writeErr(err instanceof Error ? err.message : String(err));
    return 2;
  }

  const briefText = parsed.options.get('--brief')?.trim();
  const briefFileArg = parsed.options.get('--brief-file')?.trim();
  if (!briefText && !briefFileArg) {
    writeErr('Error: Provide --brief "<description>" or --brief-file <path>.');
    return 2;
  }
  if (briefText && briefFileArg) {
    writeErr('Error: Pass either --brief or --brief-file, not both.');
    return 2;
  }

  let brief = briefText ?? '';
  if (briefFileArg) {
    const resolvedBriefPath = fs.existsSync(path.resolve(process.cwd(), briefFileArg))
      ? path.resolve(process.cwd(), briefFileArg)
      : path.resolve(repoRoot, briefFileArg);
    if (!fs.existsSync(resolvedBriefPath)) {
      writeErr(`Error: Brief file not found: '${briefFileArg}'.`);
      return 1;
    }
    brief = fs.readFileSync(resolvedBriefPath, 'utf8');
  }

  const maxAttemptsRaw = parsed.options.get('--max-attempts') ?? '3';
  const maxAttempts = Number.parseInt(maxAttemptsRaw, 10);
  if (!Number.isFinite(maxAttempts) || maxAttempts < 1) {
    writeErr(`Invalid --max-attempts value '${maxAttemptsRaw}'.`);
    return 2;
  }

  const runnerArg = parsed.options.get('--runner')?.toLowerCase();
  let runner: RunnerName;
  if (runnerArg) {
    if (!isValidRunnerName(runnerArg)) {
      writeErr(`Invalid --runner '${runnerArg}'. Expected: agy, opencode, copilot, claude, codex, or custom.`);
      return 2;
    }
    runner = runnerArg;
  } else {
    const detected = await resolveDefaultRunner(repoRoot);
    if (!detected) {
      writeErr(
        'Error: No supported agent CLI (agy, opencode, copilot, claude, codex) found on PATH. Install one or pass --runner custom --runner-cmd "...".'
      );
      return 1;
    }
    runner = detected;
  }

  const runnerCmd = parsed.options.get('--runner-cmd')?.trim();
  if (runner === 'custom' && !runnerCmd) {
    writeErr('Error: --runner custom requires --runner-cmd "<command template>".');
    return 2;
  }

  const { exitCode, report } = await executeOrchestrator(repoRoot, {
    brief,
    runner,
    runnerCmd,
    model: parsed.options.get('--model')?.trim(),
    domain: parsed.options.get('--domain')?.trim(),
    maxAttempts,
    baseRef: parsed.options.get('--base-ref')?.trim() || 'HEAD',
    inPlace: parsed.flags.has('--in-place'),
    installDeps: parsed.flags.has('--install'),
    skipE2e: parsed.flags.has('--skip-e2e'),
    noFailFast: parsed.flags.has('--no-fail-fast'),
    commit: parsed.flags.has('--commit'),
    draftPr: parsed.flags.has('--draft-pr'),
    cleanupWorktree: parsed.flags.has('--cleanup-worktree'),
    quiet: parsed.flags.has('--quiet'),
    dryRun: parsed.flags.has('--dry-run'),
  });

  if (parsed.flags.has('--json')) {
    writeOut(JSON.stringify(report, null, 2));
    return exitCode;
  }

  writeOut(buildRunReportMarkdown(report));
  writeOut(`Run artifacts written to: \`${toRepoRel(repoRoot, report.runDir)}\``);
  return exitCode;
}
