import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, it } from 'node:test';
import { buildCatalog } from '../src/catalog.js';
import { indexMarkdownSections, parseFrontmatter, rankSections } from '../src/helpSearch.js';
import { executeOrchestrator, parseChangedFilesFromPorcelain } from '../src/orchestrator.js';
import { getRunnerAdapter, isValidRunnerName } from '../src/runners.js';
import { parseCliArgs, runCommand } from '../src/utils.js';
import { runArchitectureGuardrails } from '../src/verify.js';
import { slugify, linkWorktreeNodeModules, unlinkWorktreeNodeModules } from '../src/worktree.js';

const tempDirs: string[] = [];

function createTempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

function writeTempFile(root: string, relPath: string, content: string): void {
  const fullPath = path.join(root, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
});

void describe('parseCliArgs', () => {
  void it('parses flags, space/equals options, and positional arguments', () => {
    const parsed = parseCliArgs(['tests/sample.spec.ts', '--skip-e2e', '--repeat', '3', '--browsers=chrome'], {
      flags: new Set(['--skip-e2e']),
      options: new Set(['--repeat', '--browsers']),
      maxPositionals: 1,
    });

    assert.equal(parsed.flags.has('--skip-e2e'), true);
    assert.equal(parsed.options.get('--repeat'), '3');
    assert.equal(parsed.options.get('--browsers'), 'chrome');
    assert.deepEqual(parsed.positionals, ['tests/sample.spec.ts']);
  });

  void it('throws clear errors on unknown options, missing values, flag values, and excess positionals', () => {
    assert.throws(() => parseCliArgs(['--bogus'], { flags: new Set(), options: new Set() }), /Unknown option/);
    assert.throws(
      () => parseCliArgs(['--domain'], { flags: new Set(), options: new Set(['--domain']) }),
      /Missing value/
    );
    assert.throws(
      () => parseCliArgs(['--json=true'], { flags: new Set(['--json']), options: new Set() }),
      /does not accept a value/
    );
    assert.throws(
      () => parseCliArgs(['one', 'two'], { flags: new Set(), options: new Set(), maxPositionals: 1 }),
      /Unexpected positional argument/
    );
  });
});

void describe('helpSearch', () => {
  void it('strips leading YAML frontmatter while extracting title and summary', () => {
    const raw = `---
id: sample/doc
title: "Create a Public Campaign"
summary: 'Collect open survey submissions.'
---

# Heading

Body paragraph here.`;

    const parsed = parseFrontmatter(raw);
    assert.equal(parsed.title, 'Create a Public Campaign');
    assert.equal(parsed.summary, 'Collect open survey submissions.');
    assert.equal(parsed.body.startsWith('# Heading'), true);
    assert.equal(parsed.body.includes('id: sample/doc'), false);
  });

  void it('ranks relevant Markdown sections first and omits raw frontmatter from content', () => {
    const docsDir = createTempDir('agent-help-');
    writeTempFile(
      docsDir,
      'surveys/public-campaign.md',
      `---
title: Create a Public Survey Campaign
summary: Configure public survey links.
---

# Create a Public Survey Campaign

Select Public in the Type dropdown and save the campaign.
`
    );
    writeTempFile(
      docsDir,
      'apps/records.md',
      `---
title: Create Records
summary: Manage app records.
---

# Create Records

Open an app and click Add Record.
`
    );

    const sections = indexMarkdownSections(docsDir);
    const ranked = rankSections(sections, 'public campaign', 3);

    assert.equal(ranked.length > 0, true);
    assert.equal(ranked[0]?.section.file, 'surveys/public-campaign.md');
    assert.equal(ranked[0]?.section.content.includes('---'), false);
  });
});

void describe('buildCatalog', () => {
  void it('extracts UI exports/members via TS AST without leaking inner arrow parameters', () => {
    const repo = createTempDir('agent-catalog-');
    writeTempFile(repo, 'package.json', '{"name":"test"}');
    writeTempFile(
      repo,
      'packages/onspring-ui/src/surveys/surveyCampaigns.targets.ts',
      `export const SurveyCampaignsTabTargets = {
  addCampaignLink: (page: Page) => page.getByRole('link', { name: 'Add Campaign' }),
  campaignRow:
    (name: string) =>
    (page: Page) =>
      page.locator('#grid').getByRole('row', { name }),
};
`
    );
    writeTempFile(repo, 'packages/onspring-ui/src/index.ts', `export * from './surveys/surveyCampaigns.targets.js';\n`);
    writeTempFile(repo, 'packages/onspring-models/src/models/surveyCampaign.ts', `export class SurveyCampaign {}\n`);
    writeTempFile(
      repo,
      'packages/onspring-models/src/factories/fakeDataFactory.ts',
      `export const TEST_SURVEY_CAMPAIGN_NAME = 'survey-campaign-test';
export class FakeDataFactory {
  static createFakeSurveyCampaignName() { return 'x'; }
}
`
    );
    writeTempFile(repo, 'fixtures/index.ts', `type Fixtures = {\n  sysAdminActor: unknown;\n};\n`);
    writeTempFile(repo, 'fixtures/survey.fixtures.ts', `export class SurveyFixture {}\n`);
    writeTempFile(repo, 'tests/tags.ts', `export const Tags = { Snapshot: '@snapshot' } as const;\n`);
    writeTempFile(repo, 'tests/annotations.ts', `export const AnnotationType = { TestId: 'Test Id' } as const;\n`);

    const catalog = buildCatalog(repo, null, 'all');
    assert.equal(catalog.uiModules.length, 1);
    assert.deepEqual(catalog.uiModules[0]?.members.SurveyCampaignsTabTargets, ['addCampaignLink', 'campaignRow']);
    assert.deepEqual(catalog.models.entities[0]?.symbols, ['SurveyCampaign']);
    assert.deepEqual(catalog.models.testConstants, ['TEST_SURVEY_CAMPAIGN_NAME']);
    assert.deepEqual(catalog.models.fakeDataFactoryMethods, ['createFakeSurveyCampaignName']);
    assert.deepEqual(catalog.fixtures.builtInKeys, ['sysAdminActor']);
    assert.deepEqual(catalog.fixtures.builders[0]?.symbols, ['SurveyFixture']);
    assert.deepEqual(catalog.tagsAndAnnotations.tags, ['Tags.Snapshot']);
    assert.deepEqual(catalog.tagsAndAnnotations.annotations, ['AnnotationType.TestId']);
  });
});

void describe('runArchitectureGuardrails', () => {
  void it('passes cleanly on compliant Screenplay repo structure', () => {
    const repo = createTempDir('agent-guardrails-pass-');
    writeTempFile(repo, 'packages/onspring-ui/src/index.ts', `export * from './apps/apps.targets.js';\n`);
    writeTempFile(repo, 'packages/onspring-ui/src/apps/apps.targets.ts', `export const AppsPageTargets = {};\n`);
    writeTempFile(
      repo,
      'packages/onspring-ui/src/apps/apps.tasks.ts',
      `import { AppsPageTargets } from './apps.targets.js';\nexport const AppsTasks = { AppsPageTargets };\n`
    );
    writeTempFile(
      repo,
      'packages/onspring-ui/src/index.ts',
      `export * from './apps/apps.targets.js';\nexport * from './apps/apps.tasks.js';\n`
    );
    writeTempFile(repo, 'fixtures/app.fixtures.ts', `export const appFixture = {};\n`);
    writeTempFile(
      repo,
      'tests/auth/login.spec.ts',
      `// page.goto('https://example.com') inside comment should be ignored
test('login listener', async ({ page }) => {
  page.on('response', () => {});
  testInfo.annotations.push({ type: AnnotationType.TestId, description: 'Test-1' });
});
`
    );

    const result = runArchitectureGuardrails(repo, 'tests/auth/login.spec.ts');
    assert.equal(result.passed, true);
    assert.match(result.summary, /0 violations/);
  });

  void it('catches raw Playwright leaks, missing barrel exports, missing .js imports, and target spec issues', () => {
    const repo = createTempDir('agent-guardrails-fail-');
    writeTempFile(repo, 'packages/onspring-ui/src/index.ts', '');
    writeTempFile(repo, 'packages/onspring-ui/src/apps/apps.targets.ts', `export const AppsTargets = {};\n`);
    writeTempFile(
      repo,
      'packages/onspring-ui/src/apps/apps.tasks.ts',
      `import { AppsTargets } from './apps.targets';\nexport const x = AppsTargets;\n`
    );
    writeTempFile(
      repo,
      'tests/apps/bad.spec.ts',
      `test.only('bad test', async ({ page, actor }) => {
  await page.goto('/Admin/App');
  await page.locator('#grid').click();
  await page.waitForLoadState('networkidle');
  await actor.browse().waitForTimeout(1000);
});
`
    );

    const result = runArchitectureGuardrails(repo, 'tests/apps/bad.spec.ts');
    assert.equal(result.passed, false);
    assert.match(result.output ?? '', /disallowed `test\.only`/);
    assert.match(result.output ?? '', /disallowed raw `page\.goto`/);
    assert.match(result.output ?? '', /disallowed raw Playwright selector `\.locator\(\.\.\.\)`/);
    assert.match(result.output ?? '', /disallowed `networkidle` wait/);
    assert.match(result.output ?? '', /missing barrel export `\.\/apps\/apps\.targets\.js`/);
    assert.match(result.output ?? '', /relative specifier `\.\/apps\.targets` must end with `\.js`/);
    assert.match(result.output ?? '', /missing required `AnnotationType\.TestId`/);
    assert.match(result.output ?? '', /avoid `waitForTimeout\(\)`/);
  });
});

void describe('worktree & porcelain helpers', () => {
  void it('slugifies test brief titles cleanly', () => {
    assert.equal(slugify('Test-678 Add a new public campaign!'), 'test-678-add-a-new-public-campaign');
    assert.equal(slugify('   '), 'task');
  });

  void it('parses git status --porcelain without trimming leading status spaces', () => {
    const sample = [
      ' M packages/onspring-ui/src/index.ts',
      '?? tests/survey/newSpec.spec.ts',
      'R  tests/old.spec.ts -> tests/survey/renamed.spec.ts',
    ].join('\n');

    const { changedFiles, detectedSpecs } = parseChangedFilesFromPorcelain(sample);
    assert.deepEqual(changedFiles, [
      'packages/onspring-ui/src/index.ts',
      'tests/survey/newSpec.spec.ts',
      'tests/survey/renamed.spec.ts',
    ]);
    assert.deepEqual(detectedSpecs, ['tests/survey/newSpec.spec.ts', 'tests/survey/renamed.spec.ts']);
  });

  void it('isolates workspace packages per worktree and unlinks safely', () => {
    const repo = createTempDir('agent-wt-repo-');
    const wt = createTempDir('agent-wt-checkout-');

    const rootPkgJson = JSON.stringify({ name: 'test-root', workspaces: ['packages/*'] });
    writeTempFile(repo, 'package.json', rootPkgJson);
    writeTempFile(wt, 'package.json', rootPkgJson);

    writeTempFile(repo, 'packages/onspring-models/package.json', '{"name":"@stevanfreeborn/onspring-models"}');
    writeTempFile(wt, 'packages/onspring-models/package.json', '{"name":"@stevanfreeborn/onspring-models"}');
    writeTempFile(repo, 'node_modules/some-dep/index.js', 'export const dep = 1;');

    const repoScopeDir = path.join(repo, 'node_modules', '@stevanfreeborn');
    fs.mkdirSync(repoScopeDir, { recursive: true });
    fs.symlinkSync(
      path.join(repo, 'packages', 'onspring-models'),
      path.join(repoScopeDir, 'onspring-models'),
      process.platform === 'win32' ? 'junction' : 'dir'
    );

    linkWorktreeNodeModules(repo, wt);

    const wtModelLink = path.join(wt, 'node_modules', '@stevanfreeborn', 'onspring-models');
    const wtDepLink = path.join(wt, 'node_modules', 'some-dep');
    const repoModelLink = path.join(repoScopeDir, 'onspring-models');

    assert.equal(fs.realpathSync(wtModelLink), fs.realpathSync(path.join(wt, 'packages', 'onspring-models')));
    assert.equal(fs.realpathSync(wtDepLink), fs.realpathSync(path.join(repo, 'node_modules', 'some-dep')));
    assert.equal(fs.realpathSync(repoModelLink), fs.realpathSync(path.join(repo, 'packages', 'onspring-models')));

    unlinkWorktreeNodeModules(path.join(wt, 'node_modules'));
    assert.equal(fs.existsSync(path.join(wt, 'node_modules')), false);
    assert.equal(fs.existsSync(path.join(repo, 'node_modules', 'some-dep', 'index.js')), true);
    assert.equal(fs.existsSync(path.join(wt, 'packages', 'onspring-models', 'package.json')), true);
  });
});

void describe('runners', () => {
  void it('builds valid headless invocations for built-in and custom adapters', () => {
    assert.equal(isValidRunnerName('agy'), true);
    assert.equal(isValidRunnerName('opencode'), true);
    assert.equal(isValidRunnerName('unknown'), false);

    const agyInv = getRunnerAdapter('agy').buildInvocation({
      promptFile: '/tmp/p.md',
      runDir: '/tmp/run',
      worktreeDir: '/tmp/wt',
      model: 'gemini-pro',
    });
    assert.equal(agyInv.command, 'agy');
    assert.equal(agyInv.args.includes('--print'), true);
    assert.equal(agyInv.args.includes('--model'), true);

    const openCodeInv = getRunnerAdapter('opencode').buildInvocation({
      promptFile: '/tmp/p.md',
      runDir: '/tmp/run',
      worktreeDir: '/tmp/wt',
    });
    assert.equal(openCodeInv.command, 'opencode');
    assert.equal(openCodeInv.args[0], 'run');
    assert.equal(openCodeInv.args.includes('--file'), true);

    const customInv = getRunnerAdapter('custom').buildInvocation({
      promptFile: '/tmp/my prompt.md',
      runDir: '/tmp/run',
      worktreeDir: '/tmp/wt',
      customCmd: 'node mock.js {{promptFile}} {{worktree}}',
    });
    assert.equal(customInv.shellCommand, 'node mock.js "/tmp/my prompt.md" /tmp/wt');
    assert.throws(
      () =>
        getRunnerAdapter('custom').buildInvocation({
          promptFile: '/tmp/p.md',
          runDir: '/tmp/run',
          worktreeDir: '/tmp/wt',
        }),
      /requires --runner-cmd/
    );
  });
});

void describe('executeOrchestrator self-heal loop', () => {
  void it('retries with failure diagnostics when guardrails fail and succeeds on attempt 2', async () => {
    const repo = createTempDir('agent-orch-');
    writeTempFile(repo, 'package.json', '{"name":"orch-test"}');
    writeTempFile(repo, 'packages/onspring-ui/src/index.ts', '');

    const initRes = await runCommand('git', ['init'], { cwd: repo });
    assert.equal(initRes.exitCode, 0);
    await runCommand('git', ['config', 'user.email', 'test@example.com'], { cwd: repo });
    await runCommand('git', ['config', 'user.name', 'Test User'], { cwd: repo });
    await runCommand('git', ['add', '-A'], { cwd: repo });
    await runCommand('git', ['commit', '-m', 'init'], { cwd: repo });

    const mockRunnerPath = path.join(repo, 'mock-runner.mjs');
    writeTempFile(
      repo,
      'mock-runner.mjs',
      `import fs from 'node:fs';
const promptText = fs.readFileSync(process.argv[2], 'utf8');
const target = 'tests/sample/demo.spec.ts';
fs.mkdirSync('tests/sample', { recursive: true });
if (promptText.includes('Previous Verification Failed')) {
  fs.writeFileSync(target, "test('demo', async ({ sysAdminActor }) => { test.info().annotations.push({ type: AnnotationType.TestId, description: 'Test-1' }); await sysAdminActor.browse().checkPage().hasUrl(/demo/); });\\n", 'utf8');
} else {
  fs.writeFileSync(target, "test('bad', async ({ page }) => { await page.goto('/Admin'); });\\n", 'utf8');
}
`
    );

    const { exitCode, report } = await executeOrchestrator(
      repo,
      {
        brief: 'Test-1 Demo scenario',
        runner: 'custom',
        runnerCmd: `node ${/\s/.test(mockRunnerPath) ? `"${mockRunnerPath}"` : mockRunnerPath} {{promptFile}}`,
        maxAttempts: 3,
        baseRef: 'HEAD',
        inPlace: true,
        installDeps: false,
        skipE2e: true,
        noFailFast: false,
        commit: false,
        draftPr: false,
        cleanupWorktree: false,
        dryRun: false,
        quiet: true,
      },
      {
        verifyWorktree: async (wtDir, specs) => {
          const guardrail = runArchitectureGuardrails(wtDir, specs[0] ?? null);
          return {
            passed: guardrail.passed,
            summary: guardrail.summary,
            failingStages: guardrail.passed ? [] : [guardrail.name],
            rawReport: guardrail,
            failureDetails: guardrail.output ?? '',
          };
        },
      }
    );

    assert.equal(exitCode, 0);
    assert.equal(report.status, 'passed');
    assert.equal(report.attempts.length, 2);
    assert.equal(report.attempts[0]?.verifyPassed, false);
    assert.equal(report.attempts[1]?.verifyPassed, true);
    assert.deepEqual(report.detectedSpecs, ['tests/sample/demo.spec.ts']);
    assert.equal(fs.existsSync(path.join(report.runDir, 'report.json')), true);
    assert.equal(fs.existsSync(path.join(report.runDir, 'report.md')), true);
    assert.equal(fs.existsSync(path.join(report.runDir, 'attempt-2-prompt.md')), true);
    const runLog = fs.readFileSync(path.join(report.runDir, 'attempt-1-runner.log'), 'utf8');
    assert.match(runLog, /^\$ node /);
  });

  void it('streams stdout and stderr chunks incrementally via runCommand callbacks', async () => {
    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];
    const res = await runCommand(
      'node',
      ['-e', 'process.stdout.write("hello-out\\n"); process.stderr.write("hello-err\\n");'],
      {
        onStdout: chunk => stdoutChunks.push(chunk),
        onStderr: chunk => stderrChunks.push(chunk),
      }
    );

    assert.equal(res.exitCode, 0);
    assert.equal(stdoutChunks.join(''), res.stdout);
    assert.equal(stderrChunks.join(''), res.stderr);
    assert.match(stdoutChunks.join(''), /hello-out/);
    assert.match(stderrChunks.join(''), /hello-err/);
  });

  void it('emits heartbeat while quiet runner works and flushes live runner log', async () => {
    const repo = createTempDir('agent-orch-stream-');
    writeTempFile(repo, 'package.json', '{"name":"orch-stream-test"}');
    writeTempFile(repo, 'packages/onspring-ui/src/index.ts', '');

    const initRes = await runCommand('git', ['init'], { cwd: repo });
    assert.equal(initRes.exitCode, 0);
    await runCommand('git', ['config', 'user.email', 'test@example.com'], { cwd: repo });
    await runCommand('git', ['config', 'user.name', 'Test User'], { cwd: repo });
    await runCommand('git', ['add', '-A'], { cwd: repo });
    await runCommand('git', ['commit', '-m', 'init'], { cwd: repo });

    const mockRunnerPath = path.join(repo, 'quiet-runner.mjs');
    writeTempFile(
      repo,
      'quiet-runner.mjs',
      `import fs from 'node:fs';
setTimeout(() => {
  fs.mkdirSync('tests/sample', { recursive: true });
  fs.writeFileSync('tests/sample/demo.spec.ts', "test('demo', async ({ sysAdminActor }) => { test.info().annotations.push({ type: AnnotationType.TestId, description: 'Test-1' }); await sysAdminActor.browse().checkPage().hasUrl(/demo/); });\\n", 'utf8');
  console.log('runner-finished');
}, 140);
`
    );

    const { exitCode, report } = await executeOrchestrator(
      repo,
      {
        brief: 'Test-2 Streaming heartbeat check',
        runner: 'custom',
        runnerCmd: `node ${/\s/.test(mockRunnerPath) ? `"${mockRunnerPath}"` : mockRunnerPath}`,
        maxAttempts: 1,
        baseRef: 'HEAD',
        inPlace: true,
        installDeps: false,
        skipE2e: true,
        noFailFast: false,
        commit: false,
        draftPr: false,
        cleanupWorktree: false,
        dryRun: false,
        quiet: false,
        heartbeatSeconds: 0.04,
      },
      {
        verifyWorktree: async (wtDir, specs) => {
          const guardrail = runArchitectureGuardrails(wtDir, specs[0] ?? null);
          return {
            passed: guardrail.passed,
            summary: guardrail.summary,
            failingStages: guardrail.passed ? [] : [guardrail.name],
            rawReport: guardrail,
            failureDetails: guardrail.output ?? '',
          };
        },
      }
    );

    assert.equal(exitCode, 0);
    assert.equal(report.status, 'passed');
    const logContent = fs.readFileSync(path.join(report.runDir, 'attempt-1-runner.log'), 'utf8');
    assert.match(logContent, /runner-finished/);
  });
});
