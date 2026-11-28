import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { parseCliArgs, runCommand, toRepoRel, walkFiles, writeErr, writeOut } from './utils.js';
import {
  createSpinner,
  createStyler,
  formatDuration,
  renderHeaderBox,
  renderTable,
  statusBadge,
  supportsColor,
  truncateText,
} from './ui.js';

const FORBIDDEN_CALL_METHODS = new Set([
  'locator',
  'getByRole',
  'getByLabel',
  'getByText',
  'getByPlaceholder',
  'getByTitle',
  'getByTestId',
  'frameLocator',
]);

export type VerifyStageResult = {
  name: string;
  passed: boolean;
  skipped?: boolean;
  seconds: number;
  summary: string;
  output?: string;
};

async function runProcessStage(
  name: string,
  command: string,
  args: readonly string[],
  repoRoot: string,
  quiet = false
): Promise<VerifyStageResult> {
  const errColor = supportsColor(process.stderr);
  const s = createStyler(errColor);
  const spinner = createSpinner({ stream: process.stderr, quiet, color: errColor, indent: '  ' });
  spinner.start(`${name.padEnd(24)} ${s.dim('running...')}`);

  const res = await runCommand(command, args, { cwd: repoRoot });
  const duration = formatDuration(res.seconds).padStart(6);
  if (res.exitCode === 0) {
    spinner.succeed(`${name.padEnd(24)} ${s.dim(duration)}`);
    return {
      name,
      passed: true,
      seconds: Number(res.seconds.toFixed(2)),
      summary: `${command} ${args.join(' ')}`,
    };
  }

  spinner.fail(`${name.padEnd(24)} ${s.dim(duration)}  ${s.red(`(exit ${res.exitCode})`)}`);

  const combined = `${res.stdout}\n${res.stderr}`.trim();
  const trimmed = combined.length > 4000 ? `... [truncated]\n${combined.slice(-4000)}` : combined;
  return {
    name,
    passed: false,
    seconds: Number(res.seconds.toFixed(2)),
    summary: `Exited with code ${res.exitCode}`,
    output: trimmed,
  };
}

function getLine(sourceFile: ts.SourceFile, node: ts.Node): number {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
}

function auditSpecOrFixtureAst(filePath: string, repoRoot: string, violations: string[]): void {
  const rel = toRepoRel(repoRoot, filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);

  function visit(node: ts.Node): void {
    if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.expression)) {
      const receiver = node.expression.text;
      const member = node.name.text;

      // Allow `page.on('response', ...)` listener wiring in auth overrides; forbid driver manipulation on `page`.
      if (receiver === 'page' && member !== 'on') {
        violations.push(`${rel}:${getLine(sourceFile, node)}: disallowed raw \`page.${member}\` access`);
      }

      if (receiver === 'test' && member === 'only') {
        violations.push(`${rel}:${getLine(sourceFile, node)}: disallowed \`test.only\``);
      }
    }

    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
      const methodName = node.expression.name.text;
      if (FORBIDDEN_CALL_METHODS.has(methodName)) {
        violations.push(
          `${rel}:${getLine(sourceFile, node)}: disallowed raw Playwright selector \`.${methodName}(...)\``
        );
      }

      if (
        methodName === 'waitForLoadState' &&
        node.arguments.some(arg => ts.isStringLiteral(arg) && arg.text === 'networkidle')
      ) {
        violations.push(`${rel}:${getLine(sourceFile, node)}: disallowed \`networkidle\` wait`);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

function checkUiBarrelCompleteness(repoRoot: string, violations: string[]): void {
  const uiSrc = path.join(repoRoot, 'packages', 'onspring-ui', 'src');
  const uiIndex = path.join(uiSrc, 'index.ts');
  if (!fs.existsSync(uiSrc) || !fs.existsSync(uiIndex)) {
    return;
  }

  const indexSource = ts.createSourceFile(uiIndex, fs.readFileSync(uiIndex, 'utf8'), ts.ScriptTarget.Latest, true);
  const exportedSpecifiers = new Set<string>();

  for (const stmt of indexSource.statements) {
    if (ts.isExportDeclaration(stmt) && stmt.moduleSpecifier && ts.isStringLiteral(stmt.moduleSpecifier)) {
      exportedSpecifiers.add(stmt.moduleSpecifier.text);
    }
  }

  for (const file of walkFiles(uiSrc, f => f.endsWith('.ts') && path.basename(f) !== 'index.ts')) {
    const relFromSrc = `./${path.relative(uiSrc, file).replace(/\\/g, '/')}`;
    const expectedJs = relFromSrc.replace(/\.ts$/, '.js');
    if (!exportedSpecifiers.has(expectedJs)) {
      violations.push(`packages/onspring-ui/src/index.ts: missing barrel export \`${expectedJs}\``);
    }
  }
}

function checkPackageRelativeJsExtensions(repoRoot: string, violations: string[]): void {
  const packagesDir = path.join(repoRoot, 'packages');
  if (!fs.existsSync(packagesDir)) {
    return;
  }

  for (const entry of fs.readdirSync(packagesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const srcDir = path.join(packagesDir, entry.name, 'src');
    for (const file of walkFiles(srcDir, f => f.endsWith('.ts'))) {
      const rel = toRepoRel(repoRoot, file);
      const sourceFile = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);

      for (const stmt of sourceFile.statements) {
        if (
          (ts.isImportDeclaration(stmt) || ts.isExportDeclaration(stmt)) &&
          stmt.moduleSpecifier &&
          ts.isStringLiteral(stmt.moduleSpecifier)
        ) {
          const spec = stmt.moduleSpecifier.text;
          if ((spec.startsWith('./') || spec.startsWith('../')) && !spec.endsWith('.js') && !spec.endsWith('.json')) {
            violations.push(
              `${rel}:${getLine(sourceFile, stmt)}: relative specifier \`${spec}\` must end with \`.js\``
            );
          }
        }
      }
    }
  }
}

function checkTargetSpecStrictness(repoRoot: string, targetSpecRel: string, violations: string[]): void {
  const fullPath = path.join(repoRoot, targetSpecRel);
  const sourceFile = ts.createSourceFile(fullPath, fs.readFileSync(fullPath, 'utf8'), ts.ScriptTarget.Latest, true);
  let hasTestIdAnnotation = false;

  function visit(node: ts.Node): void {
    if (
      ts.isPropertyAccessExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'AnnotationType' &&
      node.name.text === 'TestId'
    ) {
      hasTestIdAnnotation = true;
    }

    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === 'waitForTimeout'
    ) {
      violations.push(
        `${targetSpecRel}:${getLine(sourceFile, node)}: avoid \`waitForTimeout()\` in newly authored specs; use web-first assertions or \`Retry.until\``
      );
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  if (!hasTestIdAnnotation) {
    violations.push(`${targetSpecRel}: missing required \`AnnotationType.TestId\` annotation`);
  }
}

export function runArchitectureGuardrails(repoRoot: string, targetSpecRel: string | null): VerifyStageResult {
  const startedAt = Date.now();
  const violations: string[] = [];

  const testFiles = walkFiles(path.join(repoRoot, 'tests'), f => f.endsWith('.ts')).filter(f => {
    const rel = toRepoRel(repoRoot, f);
    return !rel.startsWith('tests/api/') && rel !== 'tests/tags.ts' && rel !== 'tests/annotations.ts';
  });

  const fixtureFiles = walkFiles(path.join(repoRoot, 'fixtures'), f => f.endsWith('.ts')).filter(f => {
    const rel = toRepoRel(repoRoot, f);
    return (
      rel !== 'fixtures/auth.fixtures.ts' &&
      rel !== 'fixtures/index.ts' &&
      rel !== 'fixtures/file.fixtures.ts' &&
      rel !== 'fixtures/services.fixtures.ts'
    );
  });

  const filesToAudit = [...testFiles, ...fixtureFiles];
  for (const file of filesToAudit) {
    auditSpecOrFixtureAst(file, repoRoot, violations);
  }

  checkUiBarrelCompleteness(repoRoot, violations);
  checkPackageRelativeJsExtensions(repoRoot, violations);

  if (targetSpecRel) {
    checkTargetSpecStrictness(repoRoot, targetSpecRel, violations);
  }

  const seconds = Number(((Date.now() - startedAt) / 1000).toFixed(2));
  if (violations.length === 0) {
    return {
      name: 'architecture:guardrails',
      passed: true,
      seconds,
      summary: `${filesToAudit.length} files audited via TS AST, 0 violations`,
    };
  }

  return {
    name: 'architecture:guardrails',
    passed: false,
    seconds,
    summary: `${violations.length} architectural violation(s)`,
    output: violations.join('\n'),
  };
}

export async function runVerify(repoRoot: string, argv: readonly string[]): Promise<number> {
  let parsed;
  try {
    parsed = parseCliArgs(argv, {
      flags: new Set(['--skip-e2e', '--no-fail-fast', '--no-clean', '--json', '--quiet']),
      options: new Set(['--repeat', '--browsers']),
      maxPositionals: 1,
    });
  } catch (err) {
    writeErr(err instanceof Error ? err.message : String(err));
    return 2;
  }

  const specArg = parsed.positionals[0] ?? null;
  const skipE2e = parsed.flags.has('--skip-e2e');
  const noFailFast = parsed.flags.has('--no-fail-fast');
  const noClean = parsed.flags.has('--no-clean');
  const json = parsed.flags.has('--json');
  const quiet = parsed.flags.has('--quiet');

  const repeatRaw = parsed.options.get('--repeat') ?? '2';
  const repeat = Number.parseInt(repeatRaw, 10);
  if (!Number.isFinite(repeat) || repeat < 1) {
    writeErr(`Invalid --repeat value '${repeatRaw}'.`);
    return 2;
  }

  const browsers = (parsed.options.get('--browsers') ?? 'both').toLowerCase();
  if (browsers !== 'both' && browsers !== 'chrome' && browsers !== 'edge') {
    writeErr(`Invalid --browsers value '${browsers}'. Expected: both, chrome, or edge.`);
    return 2;
  }

  let normalizedSpec: string | null = null;
  if (specArg) {
    const fullSpec = path.isAbsolute(specArg) ? path.resolve(specArg) : path.resolve(repoRoot, specArg);
    if (!fs.existsSync(fullSpec)) {
      writeErr(`Error: Spec file not found: '${specArg}'.`);
      return 1;
    }
    normalizedSpec = toRepoRel(repoRoot, fullSpec);
  }

  const errColor = supportsColor(process.stderr);
  const errStyler = createStyler(errColor);
  const guardrailsResult = () => {
    const spinner = createSpinner({ stream: process.stderr, quiet, color: errColor, indent: '  ' });
    spinner.start(`${'architecture:guardrails'.padEnd(24)} ${errStyler.dim('running...')}`);
    const result = runArchitectureGuardrails(repoRoot, normalizedSpec);
    const duration = formatDuration(result.seconds).padStart(6);
    if (result.passed) {
      spinner.succeed(`${'architecture:guardrails'.padEnd(24)} ${errStyler.dim(`${duration}  (${result.summary})`)}`);
    } else {
      spinner.fail(`${'architecture:guardrails'.padEnd(24)} ${errStyler.dim(`${duration}  (${result.summary})`)}`);
    }
    return result;
  };

  const buildScript = noClean ? 'build:packages' : 'build:packages:clean';
  const stages: VerifyStageResult[] = [
    await runProcessStage('build:packages', 'npm', ['run', buildScript], repoRoot, quiet),
    await runProcessStage('test:packages', 'npm', ['run', 'test:packages'], repoRoot, quiet),
    await runProcessStage('format:test', 'npm', ['run', 'format:test'], repoRoot, quiet),
    await runProcessStage('typecheck', 'npx', ['tsc', '--noEmit'], repoRoot, quiet),
    await runProcessStage('eslint', 'npx', ['eslint', '--max-warnings', '0', '.'], repoRoot, quiet),
    guardrailsResult(),
  ];

  const staticPassed = stages.every(s => s.passed);
  if (!skipE2e && normalizedSpec && staticPassed) {
    let chromePassed = true;

    if (browsers === 'both' || browsers === 'chrome') {
      const chromeStage = await runProcessStage(
        'e2e:chrome',
        'npx',
        [
          'playwright',
          'test',
          normalizedSpec,
          '--project',
          'chrome',
          '--workers',
          '2',
          '--repeat-each',
          String(repeat),
        ],
        repoRoot,
        quiet
      );
      stages.push(chromeStage);
      chromePassed = chromeStage.passed;
    }

    if (browsers === 'both' || browsers === 'edge') {
      if (!chromePassed && !noFailFast) {
        if (!quiet) {
          writeErr(
            `  ${errStyler.yellow('○')} ${'e2e:edge'.padEnd(24)} ${errStyler.dim(`${formatDuration(0).padStart(6)}  (skipped after e2e:chrome failure)`)}`
          );
        }
        stages.push({
          name: 'e2e:edge',
          passed: false,
          skipped: true,
          seconds: 0,
          summary: 'Skipped after e2e:chrome failure (pass --no-fail-fast to run both)',
        });
      } else {
        stages.push(
          await runProcessStage(
            'e2e:edge',
            'npx',
            ['playwright', 'test', normalizedSpec, '--project', 'edge', '--workers', '2'],
            repoRoot,
            quiet
          )
        );
      }
    }
  }

  const passed = stages.every(s => s.passed);

  if (json) {
    writeOut(
      JSON.stringify(
        {
          passed,
          specPath: normalizedSpec,
          skipE2e,
          stages,
        },
        null,
        2
      )
    );
    return passed ? 0 : 1;
  }

  const outColor = supportsColor(process.stdout);
  const s = createStyler(outColor);
  const totalSeconds = stages.reduce((sum, st) => sum + st.seconds, 0);
  const passedCount = stages.filter(st => st.passed).length;
  const skippedCount = stages.filter(st => st.skipped).length;
  const failedCount = stages.filter(st => !st.passed && !st.skipped).length;

  writeOut();
  writeOut(
    renderHeaderBox(
      `Verification Report · ${statusBadge(passed ? 'passed' : 'failed', outColor)}`,
      [
        ...(normalizedSpec ? [{ label: 'Spec', value: normalizedSpec }] : []),
        {
          label: 'Stages',
          value: `${passedCount} passed · ${skippedCount} skipped · ${failedCount} failed`,
        },
        { label: 'Duration', value: formatDuration(totalSeconds) },
      ],
      { color: outColor }
    )
  );
  writeOut();
  writeOut(
    renderTable(
      ['Stage', 'Status', 'Duration', 'Details'],
      stages.map(st => [
        st.name,
        statusBadge(st.skipped ? 'skip' : st.passed ? 'pass' : 'fail', outColor),
        formatDuration(st.seconds),
        truncateText(st.summary, 48),
      ]),
      { align: ['left', 'left', 'right', 'left'], color: outColor }
    )
  );

  for (const failed of stages.filter(st => !st.passed && st.output)) {
    writeOut();
    writeOut(`  ${s.red('✖')} ${s.bold(`Failure Details: ${failed.name}`)}`);
    writeOut(failed.output);
  }

  return passed ? 0 : 1;
}
