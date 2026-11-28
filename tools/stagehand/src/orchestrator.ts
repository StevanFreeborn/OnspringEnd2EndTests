import fs from 'node:fs';
import path from 'node:path';
import { AdapterSource, ingestBriefs, isValidAdapterSource } from './adapters.js';
import { extractTestIdFromText, formatBriefAsMarkdown, formatBriefHeadline, NormalizedTestBrief } from './briefs.js';
import { buildCatalog } from './catalog.js';
import { indexMarkdownSections, rankSections } from './helpSearch.js';
import { getRunnerAdapter, isValidRunnerName, resolveDefaultRunner, RunnerName } from './runners.js';
import {
  loadEnv,
  parseCliArgs,
  runCommand,
  runShellCommand,
  toRepoRel,
  walkFiles,
  writeErr,
  writeOut,
} from './utils.js';
import { createAgentWorktree, removeAgentWorktree, slugify, WorktreeHandle } from './worktree.js';
import {
  createSpinner,
  createStyler,
  extractRunnerActivityLine,
  formatDuration,
  formatGutterLines,
  isInteractiveTty,
  renderHeaderBox,
  renderSectionRule,
  renderTable,
  statusBadge,
  supportsColor,
  truncateText,
} from './ui.js';

export type PriorBatchRunSummary = {
  headline: string;
  commitSha?: string;
  changedFiles: string[];
};

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
  status: 'passed' | 'failed' | 'dry-run' | 'skipped';
  runner: RunnerName;
  brief: string;
  worktreeDir: string;
  branch: string | null;
  runDir: string;
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
  referenceUrl?: string;
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
  verbose?: boolean;
  heartbeatSeconds?: number;
  slugTitle?: string;
  runDirOverride?: string;
  existingWorktree?: {
    path: string;
    branch: string | null;
  };
  skipWorktreeCleanup?: boolean;
  priorBatchRuns?: readonly PriorBatchRunSummary[];
  referenceUrl?: string;
};

export type BatchOrchestratorConfig = Omit<
  OrchestratorConfig,
  | 'brief'
  | 'existingWorktree'
  | 'skipWorktreeCleanup'
  | 'runDirOverride'
  | 'slugTitle'
  | 'priorBatchRuns'
  | 'referenceUrl'
> & {
  sharedBranch?: string;
  failFast?: boolean;
  resume?: boolean;
};

export type BatchOrchestratorReport = {
  batchId: string;
  status: 'passed' | 'failed' | 'dry-run';
  mode: 'isolated' | 'shared-branch';
  runner: RunnerName;
  sharedBranch: string | null;
  sharedWorktreeDir: string | null;
  runDir: string;
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
  total: number;
  passed: number;
  skipped: number;
  failed: number;
  runs: OrchestratorReport[];
  draftPrUrl?: string;
  error?: string;
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

export function extractHelpSearchQuery(slugTitle: string | undefined, brief: string): string {
  let raw = slugTitle?.trim() || '';
  if (!raw) {
    for (const line of brief.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || /^##\s+Test Brief\b/i.test(trimmed)) {
        continue;
      }
      const titleMeta = /^[-*]\s+\*\*Title\*\*\s*:\s*(.+)$/i.exec(trimmed);
      if (titleMeta) {
        raw = titleMeta[1].trim();
        break;
      }
      if (/^[-*]\s+\*\*/.test(trimmed) || /^###\s+/.test(trimmed)) {
        continue;
      }
      raw = trimmed;
      break;
    }
  }

  return raw
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/\bTest-\d+\b/gi, ' ')
    .replace(/[#*`_>[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function inferSecondaryDomains(repoRoot: string, query: string, primaryDomain?: string): string[] {
  const uiSrc = path.join(repoRoot, 'packages', 'onspring-ui', 'src');
  if (!fs.existsSync(uiSrc)) {
    return [];
  }

  const primaryLower = primaryDomain?.trim().toLowerCase() ?? '';
  const queryTokens = new Set((query.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter(t => t.length >= 3));
  if (queryTokens.size === 0) {
    return [];
  }

  const matched: string[] = [];
  for (const entry of fs.readdirSync(uiSrc, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'common') {
      continue;
    }
    const folderLower = entry.name.toLowerCase();
    if (folderLower === primaryLower || folderLower === `${primaryLower}s` || `${folderLower}s` === primaryLower) {
      continue;
    }

    const folderSingular = folderLower.endsWith('s') ? folderLower.slice(0, -1) : folderLower;
    for (const token of queryTokens) {
      const tokenSingular = token.endsWith('s') ? token.slice(0, -1) : token;
      if (token === folderLower || token === folderSingular || tokenSingular === folderSingular) {
        matched.push(entry.name);
        break;
      }
    }
  }

  return matched.sort();
}

export function gatherPreFlightContext(repoRoot: string, brief: string, domain?: string, slugTitle?: string): string {
  const sections: string[] = [];
  const cleanQuery = extractHelpSearchQuery(slugTitle, brief);
  const secondaryDomains = inferSecondaryDomains(repoRoot, cleanQuery, domain);
  const domainsToScan = Array.from(
    new Set([domain?.trim(), ...secondaryDomains].filter((d): d is string => Boolean(d)))
  );

  try {
    const uiSeen = new Set<string>();
    const modelSeen = new Set<string>();
    const moduleLines: string[] = [];
    const modelLines: string[] = [];

    for (const targetDomain of domainsToScan) {
      const catalog = buildCatalog(repoRoot, targetDomain, 'all');
      for (const m of catalog.uiModules) {
        if (!uiSeen.has(m.file)) {
          uiSeen.add(m.file);
          moduleLines.push(`- \`${m.file}\`: ${m.exports.join(', ')}`);
        }
      }
      for (const m of catalog.models.entities) {
        if (!modelSeen.has(m.file)) {
          modelSeen.add(m.file);
          modelLines.push(`- \`${m.file}\`: ${m.symbols.join(', ')}`);
        }
      }
    }

    const fixtureCatalog = buildCatalog(repoRoot, null, 'fixtures');
    const fixtureLines = fixtureCatalog.fixtures.builders
      .slice(0, 40)
      .map(f => `- \`${f.file}\`: ${f.symbols.join(', ')}`);

    if (moduleLines.length > 0 || modelLines.length > 0 || fixtureLines.length > 0) {
      const label = domainsToScan.length > 0 ? domainsToScan.join(', ') : 'fixtures';
      sections.push(
        [
          `## Pre-Flight Catalog (\`domain=${label}\`)`,
          moduleLines.length > 0 ? `### UI Modules\n${moduleLines.slice(0, 18).join('\n')}` : '',
          modelLines.length > 0 ? `### Models\n${modelLines.slice(0, 12).join('\n')}` : '',
          fixtureLines.length > 0 ? `### Fixtures\n${fixtureLines.join('\n')}` : '',
        ]
          .filter(Boolean)
          .join('\n\n')
      );
    }
  } catch {
    // Pre-flight catalog lookup is best-effort.
  }

  try {
    const env = loadEnv(repoRoot);
    const docsDir = env.ONSPRING_HELP_DOCS_DIR?.trim();
    if (docsDir && fs.existsSync(docsDir)) {
      const indexed = indexMarkdownSections(docsDir);
      const ranked = rankSections(indexed, cleanQuery || brief, 3);
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
  priorBatchRuns,
  previousFailure,
}: {
  brief: string;
  attempt: number;
  maxAttempts: number;
  preFlightContext: string;
  priorBatchRuns?: readonly PriorBatchRunSummary[];
  previousFailure?: {
    failingStages: readonly string[];
    changedFiles: readonly string[];
    failureDetails: string;
  };
}): string {
  const trimmedBrief = brief.trim();
  const hasBriefHeader = /^##\s+Test Brief\b/i.test(trimmedBrief);

  const parts: string[] = [
    `# Automated Test Authoring Task (Attempt ${attempt}/${maxAttempts})`,
    '',
    ...(hasBriefHeader ? [trimmedBrief] : ['## Test Brief', trimmedBrief]),
    '',
    '## Required Instructions',
    '1. Read `AGENTS.md`, `CONTRIBUTING.md`, and `.agents/skills/author-onspring-test/SKILL.md` before making changes.',
    '2. Implement **ONLY** the single test case specified in this brief. Do NOT fetch parent issue URLs or implement sibling test cases.',
    '3. Follow all Screenplay layer boundaries (`onspring-models` -> `onspring-ui` -> `fixtures` -> `tests`), ESM `.js` relative imports in `packages/*`, `"types": []`, `type` over `interface`, and `AnnotationType.TestId`.',
    '4. Use the Pre-Flight Catalog and Help Center Excerpts below first; when running additional CLI queries, invoke `node tools/stagehand/dist/src/cli.js ...` directly (`catalog`, `help-search`, `explore --script`).',
    '5. Iterate with fast targeted checks (`npm run build:packages`, `node tools/stagehand/dist/src/cli.js verify <spec> --skip-e2e --no-clean`, or `--browsers chrome --repeat 1 --no-clean`). The orchestrator automatically runs full Chrome x2 + Edge verification after you exit.',
    '6. Do NOT run `git commit` or modify unrelated specs/files.',
  ];

  if (priorBatchRuns && priorBatchRuns.length > 0) {
    const priorLines = priorBatchRuns.map(run => {
      const files = run.changedFiles.length > 0 ? run.changedFiles.map(f => `\`${f}\``).join(', ') : '(none)';
      const sha = run.commitSha ? ` (\`${run.commitSha}\`)` : '';
      return `- ${run.headline}${sha}: ${files}`;
    });
    parts.push('', '## Prior Batch Commits on This Branch', ...priorLines);
  }

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
      previousFailure.failureDetails.slice(0, 8000),
      '```'
    );
  }

  return `${parts.join('\n')}\n`;
}

export function collectPlaywrightErrorContexts(worktreeDir: string, maxFiles = 2, maxCharsPerFile = 2000): string {
  const resultsDir = path.join(worktreeDir, 'test-results');
  if (!fs.existsSync(resultsDir)) {
    return '';
  }

  const files = walkFiles(resultsDir, f => path.basename(f).toLowerCase() === 'error-context.md');
  if (files.length === 0) {
    return '';
  }

  const sorted = files
    .map(file => ({ file, mtimeMs: fs.statSync(file).mtimeMs }))
    .sort((a, b) => b.mtimeMs - a.mtimeMs)
    .slice(0, maxFiles);

  return sorted
    .map(({ file }) => {
      const rel = toRepoRel(worktreeDir, file);
      const raw = fs.readFileSync(file, 'utf8').trim();
      const excerpt =
        raw.length > maxCharsPerFile ? `${raw.slice(0, maxCharsPerFile).trimEnd()}\n... [truncated]` : raw;
      return `--- Playwright Error Context: ${rel} ---\n${excerpt}`;
    })
    .join('\n\n');
}

export async function findExistingTestIds(
  worktreeDir: string,
  baseRef?: string,
  sharedBranch?: string
): Promise<Set<string>> {
  const found = new Set<string>();
  const testsDir = path.join(worktreeDir, 'tests');
  if (fs.existsSync(testsDir)) {
    const specFiles = walkFiles(testsDir, f => f.endsWith('.spec.ts'));
    for (const file of specFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const matches = content.match(/\btest-\d+\b/gi) ?? [];
      for (const rawId of matches) {
        const canonical = extractTestIdFromText(rawId);
        if (canonical) {
          found.add(canonical);
        }
      }
    }
  }

  if (baseRef && sharedBranch) {
    const logRes = await runCommand('git', ['log', '--format=%s', `${baseRef}..${sharedBranch}`], {
      cwd: worktreeDir,
    });
    if (logRes.exitCode === 0) {
      const matches = logRes.stdout.match(/\btest-\d+\b/gi) ?? [];
      for (const rawId of matches) {
        const canonical = extractTestIdFromText(rawId);
        if (canonical) {
          found.add(canonical);
        }
      }
    }
  }

  return found;
}

export async function collectPriorBranchCommits(
  worktreeDir: string,
  baseRef: string,
  sharedBranch: string
): Promise<PriorBatchRunSummary[]> {
  const res = await runCommand(
    'git',
    ['log', '--reverse', '--name-only', '--format=___COMMIT___%h|%s', `${baseRef}..${sharedBranch}`],
    { cwd: worktreeDir }
  );
  if (res.exitCode !== 0 || !res.stdout.trim()) {
    return [];
  }

  const summaries: PriorBatchRunSummary[] = [];
  let current: PriorBatchRunSummary | null = null;
  let seenFiles = new Set<string>();

  for (const rawLine of res.stdout.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    if (line.startsWith('___COMMIT___')) {
      if (current) {
        summaries.push(current);
      }
      const rest = line.slice('___COMMIT___'.length);
      const sepIdx = rest.indexOf('|');
      const sha = sepIdx >= 0 ? rest.slice(0, sepIdx).trim() : '';
      const subject = sepIdx >= 0 ? rest.slice(sepIdx + 1).trim() : rest.trim();
      const cleanedSubject = subject.replace(/^test\([^)]+\):\s*/i, '').trim();
      current = {
        headline: cleanedSubject || subject,
        ...(sha ? { commitSha: sha } : {}),
        changedFiles: [],
      };
      seenFiles = new Set<string>();
      continue;
    }

    if (current) {
      const normalized = line.replace(/\\/g, '/');
      if (!seenFiles.has(normalized)) {
        seenFiles.add(normalized);
        current.changedFiles.push(normalized);
      }
    }
  }

  if (current) {
    summaries.push(current);
  }

  return summaries;
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

  const cliJs = path.join(worktreeDir, 'tools', 'stagehand', 'dist', 'src', 'cli.js');
  if (!fs.existsSync(cliJs)) {
    const buildRes = await runCommand('npm', ['run', 'build:stagehand'], { cwd: worktreeDir });
    if (buildRes.exitCode !== 0) {
      return {
        passed: false,
        summary: 'Failed to compile tools/stagehand in worktree before verify.',
        failingStages: ['build:stagehand'],
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
      const baseFailureDetails = parsed.stages
        .filter(s => !s.passed && !s.skipped)
        .map(s => `[${s.name}] ${s.summary}\n${s.output ?? ''}`.trim())
        .join('\n\n');
      const errorContexts = failingStages.some(stage => stage === 'e2e:chrome' || stage === 'e2e:edge')
        ? collectPlaywrightErrorContexts(worktreeDir)
        : '';
      const failureDetails = errorContexts ? `${baseFailureDetails}\n\n${errorContexts}` : baseFailureDetails;

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
    `# Stagehand Run: \`${report.runId}\``,
    '',
    `- **Status**: ${report.status.toUpperCase()}`,
    `- **Runner**: \`${report.runner}\``,
    `- **Duration**: ${formatElapsed(report.durationSeconds * 1000)}`,
    `- **Worktree**: \`${report.worktreeDir}\``,
    `- **Branch**: ${report.branch ? `\`${report.branch}\`` : '(in-place)'}`,
    `- **Changed Specs**: ${report.detectedSpecs.length > 0 ? report.detectedSpecs.map(s => `\`${s}\``).join(', ') : '(none)'}`,
    report.referenceUrl ? `- **Reference URL**: ${report.referenceUrl}` : '',
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

export function renderRunSummaryTerminal(
  report: OrchestratorReport,
  repoRoot: string,
  colorEnabled = supportsColor(process.stdout)
): string {
  const s = createStyler(colorEnabled);
  const badge = statusBadge(report.status, colorEnabled);
  const meta = [
    { label: 'Runner', value: report.runner },
    { label: 'Duration', value: formatDuration(report.durationSeconds) },
    { label: 'Branch', value: report.branch ?? '(in-place)' },
    { label: 'Specs', value: report.detectedSpecs.length > 0 ? report.detectedSpecs.join(', ') : '(none)' },
    ...(report.commitSha ? [{ label: 'Commit', value: report.commitSha }] : []),
    ...(report.draftPrUrl ? [{ label: 'Draft PR', value: report.draftPrUrl }] : []),
    ...(report.error ? [{ label: 'Error', value: s.red(report.error) }] : []),
  ];

  const lines = ['', renderHeaderBox(`Stagehand Run · ${badge}`, meta, { color: colorEnabled })];

  if (report.attempts.length > 0) {
    lines.push(
      '',
      renderTable(
        ['Attempt', 'Exit', 'Runner Time', 'Verify', 'Summary'],
        report.attempts.map(a => [
          `${a.attempt}/${report.attempts.length}`,
          a.runnerExitCode === 0 ? s.green('0') : s.red(String(a.runnerExitCode)),
          formatDuration(a.runnerSeconds),
          statusBadge(a.verifyPassed ? 'pass' : 'fail', colorEnabled),
          truncateText(a.verifySummary, 48),
        ]),
        { align: ['left', 'right', 'right', 'left', 'left'], color: colorEnabled }
      )
    );
  }

  lines.push('', s.dim(`  Report  ${toRepoRel(repoRoot, path.join(report.runDir, 'report.md'))}`));
  return `${lines.join('\n')}\n`;
}

function formatLiveElapsed(seconds: number): string {
  const safe = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  if (safe < 60) {
    return `${Math.floor(safe)}s`;
  }
  return formatDuration(safe);
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

async function pushBranchAndCreateDraftPr(
  worktreeDir: string,
  branchName: string,
  title: string,
  bodyFilePath: string
): Promise<string> {
  const pushRes = await runCommand('git', ['push', '-u', 'origin', branchName], { cwd: worktreeDir });
  if (pushRes.exitCode !== 0) {
    throw new Error(`git push failed: ${pushRes.stderr || pushRes.stdout}`);
  }

  const prRes = await runCommand('gh', ['pr', 'create', '--draft', '--title', title, '--body-file', bodyFilePath], {
    cwd: worktreeDir,
  });
  if (prRes.exitCode !== 0) {
    throw new Error(`gh pr create failed: ${prRes.stderr || prRes.stdout}`);
  }

  return prRes.stdout.trim();
}

export async function executeOrchestrator(
  repoRoot: string,
  config: OrchestratorConfig,
  deps?: OrchestratorTestDeps
): Promise<{ exitCode: number; report: OrchestratorReport }> {
  const errColor = supportsColor(process.stderr);
  const s = createStyler(errColor);
  const logProgress = (line: string): void => {
    if (!config.quiet) {
      writeErr(line);
    }
  };

  const slugInput = config.slugTitle?.trim() || (config.brief.split(/\r?\n/)[0] ?? 'task');
  const slug = slugify(slugInput);
  const runId = `${formatRunTimestamp()}-${slug}`;
  const runDir = config.runDirOverride ?? path.join(repoRoot, '.stagehand-runs', runId);
  fs.mkdirSync(runDir, { recursive: true });
  fs.writeFileSync(path.join(runDir, 'brief.md'), config.brief, 'utf8');

  const worktreeHandle: WorktreeHandle | null =
    config.existingWorktree || config.inPlace
      ? null
      : await createAgentWorktree(repoRoot, {
          slug,
          baseRef: config.baseRef,
          installDeps: config.installDeps,
        });
  const worktreeDir = config.existingWorktree
    ? config.existingWorktree.path
    : worktreeHandle
      ? worktreeHandle.path
      : repoRoot;
  const activeBranch = config.existingWorktree
    ? config.existingWorktree.branch
    : worktreeHandle
      ? worktreeHandle.branch
      : null;

  if (!config.existingWorktree && !config.quiet) {
    logProgress(
      renderHeaderBox(
        'Stagehand Run',
        [
          { label: 'Runner', value: config.runner },
          { label: 'Branch', value: activeBranch ?? '(in-place)' },
          { label: 'Domain', value: config.domain ?? 'infer from catalog' },
          { label: 'Output', value: config.verbose ? 'verbose (raw stream)' : 'compact (spinner · --verbose for raw)' },
          { label: 'Logs', value: toRepoRel(repoRoot, runDir) },
        ],
        { color: errColor }
      )
    );
  }

  const startedMs = Date.now();
  const startedAt = new Date(startedMs).toISOString();
  const report: OrchestratorReport = {
    runId,
    status: config.dryRun ? 'dry-run' : 'failed',
    runner: config.runner,
    brief: config.brief,
    worktreeDir,
    branch: activeBranch,
    runDir,
    startedAt,
    finishedAt: startedAt,
    durationSeconds: 0,
    ...(config.referenceUrl ? { referenceUrl: config.referenceUrl } : {}),
    attempts: [],
    changedFiles: [],
    detectedSpecs: [],
  };

  try {
    const preFlightContext = gatherPreFlightContext(worktreeDir, config.brief, config.domain, config.slugTitle);
    let previousFailure:
      | { failingStages: readonly string[]; changedFiles: readonly string[]; failureDetails: string }
      | undefined;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      const promptContent = buildAttemptPrompt({
        brief: config.brief,
        attempt,
        maxAttempts: config.maxAttempts,
        preFlightContext,
        priorBatchRuns: config.priorBatchRuns,
        previousFailure,
      });

      const promptFile = path.join(runDir, `attempt-${attempt}-prompt.md`);
      const runnerLogFile = path.join(runDir, `attempt-${attempt}-runner.log`);
      const verifyReportFile = path.join(runDir, `attempt-${attempt}-verify.json`);
      fs.writeFileSync(promptFile, promptContent, 'utf8');

      if (config.dryRun) {
        report.status = 'dry-run';
        logProgress(`  ${s.cyan('◇')} Dry-run prompt generated (${toRepoRel(repoRoot, promptFile)})`);
        break;
      }

      if (!config.existingWorktree || attempt > 1) {
        logProgress('');
        logProgress(renderSectionRule(`Attempt ${attempt}/${config.maxAttempts}`, { color: errColor }));
      }

      const adapter = getRunnerAdapter(config.runner);
      const invocation = adapter.buildInvocation({
        promptFile,
        runDir,
        worktreeDir,
        model: config.model,
        customCmd: config.runnerCmd,
      });

      const heartbeatMs = (config.heartbeatSeconds ?? 30) * 1000;
      const attemptStartedAt = Date.now();
      let lastOutputAt = attemptStartedAt;
      let lastNonTtyStatusAt = attemptStartedAt;
      let lastFilesPollAt = 0;
      let pollInFlight = false;
      let liveChangedCount = 0;
      let latestActivity = '';
      let runnerFinished = false;

      const logStream = fs.createWriteStream(runnerLogFile, { encoding: 'utf8' });
      const commandDisplay = invocation.shellCommand ?? `${invocation.command} ${invocation.args.join(' ')}`;
      logStream.write(`$ ${commandDisplay}\n\n`);

      const tty = isInteractiveTty(process.stderr);
      const spinner =
        !config.verbose && !config.quiet
          ? createSpinner({ stream: process.stderr, quiet: config.quiet, color: errColor, indent: '  ' })
          : null;

      const formatRunnerStatus = (): string => {
        const elapsed = formatLiveElapsed((Date.now() - attemptStartedAt) / 1000);
        const parts = [`${s.bold(config.runner)} ${s.dim(`(Attempt ${attempt}/${config.maxAttempts})`)}`, elapsed];
        if (liveChangedCount > 0) {
          parts.push(`${liveChangedCount} file(s) changed`);
        }
        if (latestActivity) {
          parts.push(s.dim(latestActivity));
        }
        return parts.join(` ${s.dim('·')} `);
      };

      if (spinner) {
        spinner.start(formatRunnerStatus());
      } else {
        logProgress(`  ${s.cyan('▶')} Launching ${s.bold(config.runner)} (Attempt ${attempt}/${config.maxAttempts})`);
      }

      const handleChunk = (chunk: string): void => {
        lastOutputAt = Date.now();
        logStream.write(chunk);
        if (config.quiet) {
          return;
        }
        if (config.verbose) {
          process.stderr.write(formatGutterLines(chunk, { color: errColor }));
          return;
        }
        const extracted = extractRunnerActivityLine(chunk);
        if (extracted) {
          latestActivity = extracted;
          if (tty) {
            spinner?.update(formatRunnerStatus());
          }
        }
      };

      const pollMs = tty && !config.verbose ? 1000 : Math.max(10, Math.min(heartbeatMs || 5000, 5000));
      const statusTimer =
        !config.quiet && (tty || heartbeatMs > 0)
          ? setInterval(() => {
              const now = Date.now();
              const shouldRefreshFiles = !pollInFlight && now - lastFilesPollAt >= 4000;
              if (shouldRefreshFiles) {
                pollInFlight = true;
                lastFilesPollAt = now;
                void (async () => {
                  try {
                    const { changedFiles: liveChanged } = await detectChangedFiles(worktreeDir);
                    if (runnerFinished) {
                      return;
                    }
                    liveChangedCount = liveChanged.length;
                    if (!config.verbose && tty) {
                      spinner?.update(formatRunnerStatus());
                    }
                  } finally {
                    pollInFlight = false;
                  }
                })();
              }

              if (!config.verbose && tty) {
                spinner?.update(formatRunnerStatus());
                return;
              }

              const silentTooLong = heartbeatMs > 0 && now - lastOutputAt >= heartbeatMs;
              const periodicNonTty = !tty && heartbeatMs > 0 && now - lastNonTtyStatusAt >= heartbeatMs;
              if ((config.verbose && silentTooLong) || (!config.verbose && periodicNonTty)) {
                lastOutputAt = now;
                lastNonTtyStatusAt = now;
                if (!pollInFlight) {
                  pollInFlight = true;
                  void (async () => {
                    try {
                      const { changedFiles: liveChanged } = await detectChangedFiles(worktreeDir);
                      if (runnerFinished) {
                        return;
                      }
                      liveChangedCount = liveChanged.length;
                      logProgress(
                        `  ${s.dim('⋯')} ${config.runner} (Attempt ${attempt}/${config.maxAttempts}) running ${formatDuration((Date.now() - attemptStartedAt) / 1000)}, ${liveChangedCount} changed file(s), log: ${toRepoRel(repoRoot, runnerLogFile)}`
                      );
                    } finally {
                      pollInFlight = false;
                    }
                  })();
                }
              }
            }, pollMs)
          : null;
      statusTimer?.unref?.();

      let runnerRes: { exitCode: number; seconds: number } | null = null;
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
        runnerFinished = true;
        if (statusTimer) {
          clearInterval(statusTimer);
        }
        if (spinner) {
          if (runnerRes) {
            const summaryText = `${s.bold(config.runner)} exited ${runnerRes.exitCode} in ${formatDuration(runnerRes.seconds)}`;
            if (runnerRes.exitCode === 0) {
              spinner.succeed(summaryText);
            } else {
              spinner.fail(summaryText);
            }
          } else {
            spinner.stop();
          }
        }
        await new Promise<void>(resolve => logStream.end(resolve));
      }

      const { changedFiles, detectedSpecs } = await detectChangedFiles(worktreeDir);
      report.changedFiles = changedFiles;
      report.detectedSpecs = detectedSpecs;

      if (!config.quiet) {
        const specCountLabel = `${detectedSpecs.length} spec(s)`;
        logProgress(`  ${s.dim(`  Changed: ${changedFiles.length} file(s) · ${specCountLabel} · Verifying...`)}`);
      }

      const verifyOutcome = deps?.verifyWorktree
        ? await deps.verifyWorktree(worktreeDir, detectedSpecs)
        : await runDefaultVerifyWorktree(
            worktreeDir,
            detectedSpecs,
            config.skipE2e,
            config.noFailFast,
            Boolean(config.quiet)
          );

      if (verifyOutcome.passed) {
        logProgress(`  ${s.green('✔')} Verify passed ${s.dim(`— ${verifyOutcome.summary}`)}`);
      } else {
        logProgress(`  ${s.red('✖')} Verify failed ${s.dim(`— ${verifyOutcome.summary}`)}`);
      }

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
      const titleLine = config.slugTitle?.trim() || config.brief.split(/\r?\n/)[0]?.trim() || 'add automated test';
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
        logProgress(`  ${s.green('✔')} Committed ${s.cyan(report.commitSha)} onto ${activeBranch ?? 'HEAD'}`);
      }

      if (config.draftPr) {
        if (!activeBranch) {
          throw new Error('--draft-pr requires an isolated worktree branch (cannot run with --in-place).');
        }
        const reportMdPath = path.join(runDir, 'report.md');
        fs.writeFileSync(reportMdPath, buildRunReportMarkdown(report), 'utf8');
        report.draftPrUrl = await pushBranchAndCreateDraftPr(worktreeDir, activeBranch, commitMessage, reportMdPath);
        logProgress(`  ${s.green('✔')} Created draft PR: ${report.draftPrUrl}`);
      }
    }
  } catch (err) {
    report.status = 'failed';
    report.error = err instanceof Error ? err.message : String(err);
  } finally {
    const finishedMs = Date.now();
    report.finishedAt = new Date(finishedMs).toISOString();
    report.durationSeconds = Number(((finishedMs - startedMs) / 1000).toFixed(2));
    fs.writeFileSync(path.join(runDir, 'report.json'), JSON.stringify(report, null, 2), 'utf8');
    fs.writeFileSync(path.join(runDir, 'report.md'), buildRunReportMarkdown(report), 'utf8');

    const safeToDeleteWorktree =
      worktreeHandle !== null &&
      !config.skipWorktreeCleanup &&
      config.cleanupWorktree &&
      (config.dryRun || Boolean(report.commitSha) || report.changedFiles.length === 0);

    if (worktreeHandle && safeToDeleteWorktree) {
      await removeAgentWorktree(repoRoot, worktreeHandle, config.dryRun);
    }
  }

  const exitCode = report.status === 'passed' || report.status === 'dry-run' ? 0 : 1;
  return { exitCode, report };
}

function buildBatchReportMarkdown(report: BatchOrchestratorReport): string {
  const lines = [
    `# Stagehand Batch Run: \`${report.batchId}\``,
    '',
    `- **Status**: ${report.status.toUpperCase()}`,
    `- **Mode**: \`${report.mode}\``,
    `- **Runner**: \`${report.runner}\``,
    `- **Duration**: ${formatElapsed(report.durationSeconds * 1000)}`,
    report.sharedBranch ? `- **Shared Branch**: \`${report.sharedBranch}\`` : '',
    report.sharedWorktreeDir ? `- **Shared Worktree**: \`${report.sharedWorktreeDir}\`` : '',
    `- **Counts**: ${report.passed}/${report.total} passed, ${report.skipped} skipped, ${report.failed} failed`,
    report.draftPrUrl ? `- **Draft PR**: ${report.draftPrUrl}` : '',
    report.error ? `- **Error**: ${report.error}` : '',
    '',
    '## Runs',
    '| # | Status | Attempts | Duration | Branch | Commit | Changed Specs | Summary / Run Dir |',
    '| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |',
    ...report.runs.map((r, i) => {
      const specs = r.detectedSpecs.length > 0 ? r.detectedSpecs.map(s => `\`${s}\``).join(', ') : '(none)';
      const summary = r.error ? r.error.replace(/\|/g, '\\|') : `\`${r.runId}\``;
      const attemptsDisplay = r.status === 'skipped' || r.status === 'dry-run' ? '-' : String(r.attempts.length);
      const durationDisplay = r.status === 'skipped' ? '-' : formatElapsed(r.durationSeconds * 1000);
      return `| ${i + 1} | ${r.status.toUpperCase()} | ${attemptsDisplay} | ${durationDisplay} | ${r.branch ? `\`${r.branch}\`` : '(in-place)'} | ${r.commitSha ? `\`${r.commitSha}\`` : '-'} | ${specs} | ${summary} |`;
    }),
  ].filter(Boolean);

  return `${lines.join('\n')}\n`;
}

export function renderBatchSummaryTerminal(
  report: BatchOrchestratorReport,
  repoRoot: string,
  colorEnabled = supportsColor(process.stdout)
): string {
  const s = createStyler(colorEnabled);
  const badge = statusBadge(report.status, colorEnabled);
  const countsText = `${s.green(`${report.passed}/${report.total} passed`)} · ${s.yellow(`${report.skipped} skipped`)} · ${report.failed > 0 ? s.red(`${report.failed} failed`) : `${report.failed} failed`}`;
  const meta = [
    { label: 'Mode', value: report.sharedBranch ? `${report.mode} (${report.sharedBranch})` : report.mode },
    { label: 'Runner', value: report.runner },
    { label: 'Duration', value: formatDuration(report.durationSeconds) },
    { label: 'Counts', value: countsText },
    ...(report.draftPrUrl ? [{ label: 'Draft PR', value: report.draftPrUrl }] : []),
    ...(report.error ? [{ label: 'Error', value: s.red(report.error) }] : []),
  ];

  const lines = ['', renderHeaderBox(`Stagehand Batch · ${badge}`, meta, { color: colorEnabled })];

  if (report.runs.length > 0) {
    lines.push(
      '',
      renderTable(
        ['#', 'Status', 'Attempts', 'Duration', 'Commit', 'Changed Specs'],
        report.runs.map((r, idx) => [
          String(idx + 1),
          statusBadge(r.status, colorEnabled),
          r.status === 'skipped' || r.status === 'dry-run' ? s.dim('-') : String(r.attempts.length),
          r.status === 'skipped' ? s.dim('-') : formatDuration(r.durationSeconds),
          r.commitSha ? s.cyan(r.commitSha) : s.dim('-'),
          r.detectedSpecs.length > 0 ? r.detectedSpecs.map(spec => truncateText(spec, 40)).join(', ') : s.dim('(none)'),
        ]),
        { align: ['right', 'left', 'right', 'right', 'left', 'left'], color: colorEnabled }
      )
    );
  }

  lines.push('', s.dim(`  Report  ${toRepoRel(repoRoot, path.join(report.runDir, 'batch-report.md'))}`));
  return `${lines.join('\n')}\n`;
}

export async function executeBatchOrchestrator(
  repoRoot: string,
  briefs: readonly NormalizedTestBrief[],
  config: BatchOrchestratorConfig,
  deps?: OrchestratorTestDeps
): Promise<{ exitCode: number; report: BatchOrchestratorReport }> {
  const errColor = supportsColor(process.stderr);
  const s = createStyler(errColor);
  const logProgress = (line: string): void => {
    if (!config.quiet) {
      writeErr(line);
    }
  };

  const sharedBranch = config.sharedBranch?.trim() || null;
  if (sharedBranch && config.inPlace) {
    throw new Error('--shared-branch cannot be combined with --in-place.');
  }

  const batchSlug = slugify(sharedBranch || config.domain || 'batch');
  const batchId = `${formatRunTimestamp()}-batch-${batchSlug}`;
  const runDir = path.join(repoRoot, '.stagehand-runs', batchId);
  fs.mkdirSync(runDir, { recursive: true });

  const sharedHandle: WorktreeHandle | null = sharedBranch
    ? await createAgentWorktree(repoRoot, {
        slug: slugify(sharedBranch),
        baseRef: config.baseRef,
        installDeps: config.installDeps,
        branchName: sharedBranch,
        reuseExisting: Boolean(config.resume),
      })
    : null;

  if (!config.quiet) {
    const modeValue = sharedHandle
      ? `shared-branch (${sharedHandle.branch})${sharedHandle.reused ? ' · reused interrupted worktree' : ''}`
      : 'isolated';
    logProgress(
      renderHeaderBox(
        'Stagehand Batch',
        [
          { label: 'Mode', value: modeValue },
          { label: 'Runner', value: config.runner },
          { label: 'Briefs', value: `${briefs.length} item(s)${config.resume ? ' (resume enabled)' : ''}` },
          { label: 'Output', value: config.verbose ? 'verbose (raw stream)' : 'compact (spinner · --verbose for raw)' },
          { label: 'Logs', value: toRepoRel(repoRoot, runDir) },
        ],
        { color: errColor }
      )
    );
  }

  const startedMs = Date.now();
  const startedAt = new Date(startedMs).toISOString();
  const report: BatchOrchestratorReport = {
    batchId,
    status: config.dryRun ? 'dry-run' : 'failed',
    mode: sharedBranch ? 'shared-branch' : 'isolated',
    runner: config.runner,
    sharedBranch: sharedHandle ? sharedHandle.branch : sharedBranch,
    sharedWorktreeDir: sharedHandle ? sharedHandle.path : null,
    runDir,
    startedAt,
    finishedAt: startedAt,
    durationSeconds: 0,
    total: briefs.length,
    passed: 0,
    skipped: 0,
    failed: 0,
    runs: [],
  };

  try {
    let resolvedBaseRef = config.baseRef;
    if (sharedHandle) {
      const baseShaRes = await runCommand('git', ['rev-parse', '--verify', config.baseRef], { cwd: repoRoot });
      if (baseShaRes.exitCode === 0 && baseShaRes.stdout.trim()) {
        resolvedBaseRef = baseShaRes.stdout.trim();
      }
    }

    const existingTestIds =
      config.resume && sharedHandle
        ? await findExistingTestIds(sharedHandle.path, resolvedBaseRef, sharedHandle.branch)
        : new Set<string>();
    const priorBatchRuns: PriorBatchRunSummary[] =
      config.resume && sharedHandle
        ? await collectPriorBranchCommits(sharedHandle.path, resolvedBaseRef, sharedHandle.branch)
        : [];

    for (let i = 0; i < briefs.length; i++) {
      const brief = briefs[i];
      const headline = formatBriefHeadline(brief);
      const itemDomain = brief.domain ?? config.domain;

      if (config.resume && brief.testId && existingTestIds.has(brief.testId)) {
        logProgress('');
        logProgress(renderSectionRule(`[${i + 1}/${briefs.length}] ${headline}`, { color: errColor }));
        logProgress(`  ${s.yellow('○')} Skipped ${brief.testId} (already present on branch)`);
        const nowIso = new Date().toISOString();
        report.skipped++;
        report.runs.push({
          runId: `skipped-${slugify(headline, 36)}`,
          status: 'skipped',
          runner: config.runner,
          brief: formatBriefAsMarkdown(brief),
          worktreeDir: sharedHandle ? sharedHandle.path : repoRoot,
          branch: sharedHandle ? sharedHandle.branch : null,
          runDir,
          startedAt: nowIso,
          finishedAt: nowIso,
          durationSeconds: 0,
          ...(brief.referenceUrl ? { referenceUrl: brief.referenceUrl } : {}),
          attempts: [],
          changedFiles: [],
          detectedSpecs: [],
        });
        continue;
      }

      logProgress('');
      logProgress(renderSectionRule(`[${i + 1}/${briefs.length}] ${headline}`, { color: errColor }));

      const subRunDir = path.join(runDir, `brief-${String(i + 1).padStart(2, '0')}-${slugify(headline, 36)}`);
      const itemOutcome = await executeOrchestrator(
        repoRoot,
        {
          ...config,
          brief: formatBriefAsMarkdown(brief),
          slugTitle: headline,
          domain: itemDomain,
          referenceUrl: brief.referenceUrl,
          priorBatchRuns: sharedHandle ? priorBatchRuns : undefined,
          commit: sharedHandle ? !config.dryRun : config.commit,
          draftPr: sharedHandle ? false : config.draftPr,
          cleanupWorktree: sharedHandle ? false : config.cleanupWorktree,
          skipWorktreeCleanup: Boolean(sharedHandle),
          runDirOverride: subRunDir,
          existingWorktree: sharedHandle ? { path: sharedHandle.path, branch: sharedHandle.branch } : undefined,
        },
        deps
      );

      report.runs.push(itemOutcome.report);
      if (itemOutcome.exitCode === 0) {
        report.passed++;
        if (sharedHandle && !config.dryRun) {
          priorBatchRuns.push({
            headline,
            commitSha: itemOutcome.report.commitSha,
            changedFiles: itemOutcome.report.changedFiles,
          });
        }
      } else {
        report.failed++;
        if (sharedHandle || config.failFast) {
          logProgress(`  ${s.red('✖')} Batch stopping after failure on item ${i + 1}/${briefs.length} (${headline})`);
          break;
        }
      }
    }

    if (config.dryRun) {
      report.status = 'dry-run';
    } else if (report.failed === 0 && report.passed + report.skipped === report.total) {
      report.status = 'passed';
      if (sharedHandle && config.draftPr && report.passed > 0) {
        const batchMdPath = path.join(runDir, 'batch-report.md');
        fs.writeFileSync(batchMdPath, buildBatchReportMarkdown(report), 'utf8');
        const prTitle = `test(${config.domain ? slugify(config.domain, 24) : 'e2e'}): add ${report.passed} automated test(s)`;
        report.draftPrUrl = await pushBranchAndCreateDraftPr(
          sharedHandle.path,
          sharedHandle.branch,
          prTitle,
          batchMdPath
        );
      }
    } else {
      report.status = 'failed';
    }
  } catch (err) {
    report.status = 'failed';
    report.error = err instanceof Error ? err.message : String(err);
  } finally {
    const finishedMs = Date.now();
    report.finishedAt = new Date(finishedMs).toISOString();
    report.durationSeconds = Number(((finishedMs - startedMs) / 1000).toFixed(2));
    fs.writeFileSync(path.join(runDir, 'batch-report.json'), JSON.stringify(report, null, 2), 'utf8');
    fs.writeFileSync(path.join(runDir, 'batch-report.md'), buildBatchReportMarkdown(report), 'utf8');

    const safeToDeleteShared =
      sharedHandle !== null &&
      config.cleanupWorktree &&
      (config.dryRun || report.failed === 0 || report.runs.every(r => r.changedFiles.length === 0));

    if (sharedHandle && safeToDeleteShared) {
      await removeAgentWorktree(repoRoot, sharedHandle, config.dryRun);
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
        '--fail-fast',
        '--resume',
        '--commit',
        '--draft-pr',
        '--cleanup-worktree',
        '--verbose',
        '--quiet',
        '--dry-run',
        '--json',
      ]),
      options: new Set([
        '--brief',
        '--brief-file',
        '--input',
        '--source',
        '--issue',
        '--label',
        '--query',
        '--repo',
        '--onspring-config',
        '--app-id',
        '--record-id',
        '--report-id',
        '--filter',
        '--field-map',
        '--limit',
        '--shared-branch',
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
  const inputPath = parsed.options.get('--input')?.trim();
  const sourceArg = parsed.options.get('--source')?.toLowerCase();
  const issue = parsed.options.get('--issue')?.trim();
  const label = parsed.options.get('--label')?.trim();
  const query = parsed.options.get('--query')?.trim();
  const onspringConfigPath = parsed.options.get('--onspring-config')?.trim();
  const filter = parsed.options.get('--filter')?.trim();
  const fieldMapRaw = parsed.options.get('--field-map')?.trim();

  const hasAdapterFlags = Boolean(
    inputPath ||
    sourceArg ||
    issue ||
    label ||
    query ||
    onspringConfigPath ||
    parsed.options.has('--app-id') ||
    parsed.options.has('--record-id') ||
    parsed.options.has('--report-id') ||
    filter ||
    fieldMapRaw
  );

  if (sourceArg && !isValidAdapterSource(sourceArg)) {
    writeErr(`Invalid --source '${sourceArg}'. Expected: markdown, csv, json, yaml, github, onspring.`);
    return 2;
  }

  if (briefText && briefFileArg) {
    writeErr('Error: Pass either --brief or --brief-file, not both.');
    return 2;
  }
  if ((briefText || briefFileArg) && hasAdapterFlags) {
    writeErr('Error: Do not combine --brief/--brief-file with input adapter flags (--input/--issue/--record-id/...).');
    return 2;
  }
  if (!briefText && !briefFileArg && !hasAdapterFlags) {
    writeErr(
      'Error: Provide --brief "<description>", --brief-file <path>, --input <file>, GitHub flags, or Onspring flags.'
    );
    return 2;
  }

  const parseOptionalPositiveInt = (optName: string): number | undefined => {
    const raw = parsed.options.get(optName);
    if (raw === undefined) return undefined;
    const val = Number.parseInt(raw, 10);
    if (!Number.isFinite(val) || val <= 0) {
      throw new Error(`Invalid ${optName} value '${raw}'.`);
    }
    return val;
  };

  let limit: number | undefined;
  let appId: number | undefined;
  let recordId: number | undefined;
  let reportId: number | undefined;
  try {
    limit = parseOptionalPositiveInt('--limit');
    appId = parseOptionalPositiveInt('--app-id');
    recordId = parseOptionalPositiveInt('--record-id');
    reportId = parseOptionalPositiveInt('--report-id');
  } catch (err) {
    writeErr(err instanceof Error ? err.message : String(err));
    return 2;
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

  const sharedBranch = parsed.options.get('--shared-branch')?.trim();
  const resume = parsed.flags.has('--resume');
  const baseConfig = {
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
    verbose: parsed.flags.has('--verbose'),
    quiet: parsed.flags.has('--quiet'),
    dryRun: parsed.flags.has('--dry-run'),
  };

  if (sharedBranch && baseConfig.inPlace) {
    writeErr('Error: --shared-branch cannot be combined with --in-place.');
    return 2;
  }

  if (briefText || briefFileArg) {
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

    if (sharedBranch) {
      const singleBrief: NormalizedTestBrief = {
        title: brief.split(/\r?\n/)[0]?.trim() || 'Automated test scenario',
        domain: baseConfig.domain,
        source: briefFileArg ?? 'cli-brief',
        rawText: brief,
      };
      const { exitCode, report } = await executeBatchOrchestrator(repoRoot, [singleBrief], {
        ...baseConfig,
        sharedBranch,
        resume,
        failFast: parsed.flags.has('--fail-fast'),
      });
      if (parsed.flags.has('--json')) {
        writeOut(JSON.stringify(report, null, 2));
        return exitCode;
      }
      writeOut(renderBatchSummaryTerminal(report, repoRoot).trimEnd());
      return exitCode;
    }

    const { exitCode, report } = await executeOrchestrator(repoRoot, { ...baseConfig, brief });
    if (parsed.flags.has('--json')) {
      writeOut(JSON.stringify(report, null, 2));
      return exitCode;
    }
    writeOut(renderRunSummaryTerminal(report, repoRoot).trimEnd());
    return exitCode;
  }

  let briefs: NormalizedTestBrief[];
  try {
    briefs = await ingestBriefs(repoRoot, {
      inputPath,
      source: sourceArg as AdapterSource | undefined,
      domainOverride: baseConfig.domain,
      issue,
      label,
      query,
      repo: parsed.options.get('--repo')?.trim(),
      limit,
      onspringConfigPath,
      appId,
      recordId,
      reportId,
      filter,
      fieldMapRaw,
    });
  } catch (err) {
    writeErr(err instanceof Error ? err.message : String(err));
    return 1;
  }

  if (briefs.length === 1 && !sharedBranch) {
    const single = briefs[0];
    const { exitCode, report } = await executeOrchestrator(repoRoot, {
      ...baseConfig,
      brief: formatBriefAsMarkdown(single),
      slugTitle: formatBriefHeadline(single),
      domain: single.domain ?? baseConfig.domain,
      referenceUrl: single.referenceUrl,
    });
    if (parsed.flags.has('--json')) {
      writeOut(JSON.stringify(report, null, 2));
      return exitCode;
    }
    writeOut(renderRunSummaryTerminal(report, repoRoot).trimEnd());
    return exitCode;
  }

  const { exitCode, report } = await executeBatchOrchestrator(repoRoot, briefs, {
    ...baseConfig,
    sharedBranch,
    resume,
    failFast: parsed.flags.has('--fail-fast'),
  });
  if (parsed.flags.has('--json')) {
    writeOut(JSON.stringify(report, null, 2));
    return exitCode;
  }
  writeOut(renderBatchSummaryTerminal(report, repoRoot).trimEnd());
  return exitCode;
}
