import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { parseCliArgs, runCommand, toRepoRel, walkFiles, writeErr, writeOut } from './utils.js';

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

type VerifyStageResult = {
  name: string;
  passed: boolean;
  seconds: number;
  summary: string;
  output?: string;
};

async function runProcessStage(
  name: string,
  command: string,
  args: readonly string[],
  repoRoot: string
): Promise<VerifyStageResult> {
  const res = await runCommand(command, args, { cwd: repoRoot });
  if (res.exitCode === 0) {
    return {
      name,
      passed: true,
      seconds: Number(res.seconds.toFixed(2)),
      summary: `${command} ${args.join(' ')}`,
    };
  }

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

function runArchitectureGuardrails(repoRoot: string, targetSpecRel: string | null): VerifyStageResult {
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
      flags: new Set(['--skip-e2e', '--json']),
      options: new Set(['--repeat', '--browsers']),
      maxPositionals: 1,
    });
  } catch (err) {
    writeErr(err instanceof Error ? err.message : String(err));
    return 2;
  }

  const specArg = parsed.positionals[0] ?? null;
  const skipE2e = parsed.flags.has('--skip-e2e');
  const json = parsed.flags.has('--json');

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

  const stages: VerifyStageResult[] = [
    await runProcessStage('build:packages', 'npm', ['run', 'build:packages:clean'], repoRoot),
    await runProcessStage('test:packages', 'npm', ['run', 'test:packages'], repoRoot),
    await runProcessStage('format:test', 'npm', ['run', 'format:test'], repoRoot),
    await runProcessStage('typecheck', 'npx', ['tsc', '--noEmit'], repoRoot),
    await runProcessStage('eslint', 'npx', ['eslint', '--max-warnings', '0', '.'], repoRoot),
    runArchitectureGuardrails(repoRoot, normalizedSpec),
  ];

  const staticPassed = stages.every(s => s.passed);
  if (!skipE2e && normalizedSpec && staticPassed) {
    if (browsers === 'both' || browsers === 'chrome') {
      stages.push(
        await runProcessStage(
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
          repoRoot
        )
      );
    }
    if (browsers === 'both' || browsers === 'edge') {
      stages.push(
        await runProcessStage(
          'e2e:edge',
          'npx',
          ['playwright', 'test', normalizedSpec, '--project', 'edge', '--workers', '2'],
          repoRoot
        )
      );
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

  writeOut('# Verification Report');
  if (normalizedSpec) {
    writeOut(`Spec: \`${normalizedSpec}\``);
  }
  writeOut();
  writeOut('| Stage | Status | Duration | Details |');
  writeOut('| :--- | :--- | :--- | :--- |');
  for (const s of stages) {
    writeOut(`| \`${s.name}\` | ${s.passed ? 'PASS' : 'FAIL'} | ${s.seconds.toFixed(2)}s | ${s.summary} |`);
  }

  for (const failed of stages.filter(s => !s.passed && s.output)) {
    writeOut();
    writeOut(`## Failure Details: \`${failed.name}\``);
    writeOut('```text');
    writeOut(failed.output);
    writeOut('```');
  }

  return passed ? 0 : 1;
}
