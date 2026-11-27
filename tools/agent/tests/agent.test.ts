import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, it } from 'node:test';
import {
  fetchGitHubIssueBriefs,
  fetchOnspringBriefs,
  parseCsvBriefs,
  parseJsonBriefs,
  parseMarkdownBriefs,
  parseYamlBriefs,
} from '../src/adapters.js';
import { formatBriefAsMarkdown } from '../src/briefs.js';
import { buildCatalog } from '../src/catalog.js';
import { indexMarkdownSections, parseFrontmatter, rankSections } from '../src/helpSearch.js';
import { executeBatchOrchestrator, executeOrchestrator, parseChangedFilesFromPorcelain } from '../src/orchestrator.js';
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

void describe('input adapters', () => {
  void it('parses single and multi-brief Markdown files and formats canonical brief', () => {
    const md = `## Test-688 Modify an existing targeted recipient campaign
- **Test ID**: Test-688
- **Title**: Modify an existing targeted recipient campaign
- **Domain**: survey
- **Tags**: @notfedramp

### Steps
1. Open campaign edit dialog
2. Save updates

### Expected Assertions
1. Updated values persist

---

## Test-689 Verify a targeted recipient campaign in test mode
- **Domain**: survey
`;
    const briefs = parseMarkdownBriefs(md, 'backlog.md');
    assert.equal(briefs.length, 2);
    assert.equal(briefs[0]?.testId, 'Test-688');
    assert.equal(briefs[0]?.domain, 'survey');
    assert.deepEqual(briefs[0]?.tags, ['@notfedramp']);
    assert.deepEqual(briefs[0]?.steps, ['Open campaign edit dialog', 'Save updates']);
    assert.deepEqual(briefs[0]?.assertions, ['Updated values persist']);
    assert.equal(briefs[1]?.testId, 'Test-689');

    const rendered = formatBriefAsMarkdown(briefs[0]);
    assert.match(rendered, /- \*\*Test ID\*\*: Test-688/);
    assert.match(rendered, /### Expected Assertions/);
  });

  void it('parses RFC-4180 CSV with quotes, commas, and multi-line steps', () => {
    const csv = `\uFEFFTest ID,Title,Domain,Tags,Steps,Expected Result
Test-690,"Launch, verify, and archive campaign",Survey,"notfedramp","1. Save notifier\n2. Click Launch","Status shows ""Running""; Launch button hidden"
`;
    const briefs = parseCsvBriefs(csv, 'backlog.csv');
    assert.equal(briefs.length, 1);
    assert.equal(briefs[0]?.testId, 'Test-690');
    assert.equal(briefs[0]?.title, 'Launch, verify, and archive campaign');
    assert.equal(briefs[0]?.domain, 'survey');
    assert.deepEqual(briefs[0]?.tags, ['@notfedramp']);
    assert.deepEqual(briefs[0]?.steps, ['Save notifier', 'Click Launch']);
    assert.deepEqual(briefs[0]?.assertions, ['Status shows "Running"', 'Launch button hidden']);
  });

  void it('parses JSON and multi-document YAML briefs', () => {
    const jsonBriefs = parseJsonBriefs(
      JSON.stringify({
        briefs: [{ testId: 'Test-101', title: 'Add app', domain: 'apps', steps: ['Create app'] }],
      }),
      'briefs.json'
    );
    assert.equal(jsonBriefs.length, 1);
    assert.equal(jsonBriefs[0]?.testId, 'Test-101');
    assert.equal(jsonBriefs[0]?.domain, 'apps');

    const yaml = `# Sample YAML batch
- testId: Test-201
  title: Create role # inline comment
  domain: role
  tags: [notfedramp, snapshot]
  steps:
    - Open roles page
    - Save role
---
testId: Test-202
title: "Edit role: \\"Admin\\""
domain: role
notes: |
  Line one
  Line two
`;
    const yamlBriefs = parseYamlBriefs(yaml, 'briefs.yaml');
    assert.equal(yamlBriefs.length, 2);
    assert.equal(yamlBriefs[0]?.testId, 'Test-201');
    assert.deepEqual(yamlBriefs[0]?.tags, ['@notfedramp', '@snapshot']);
    assert.deepEqual(yamlBriefs[0]?.steps, ['Open roles page', 'Save role']);
    assert.equal(yamlBriefs[1]?.testId, 'Test-202');
    assert.equal(yamlBriefs[1]?.title, 'Edit role: "Admin"');
    assert.match(yamlBriefs[1]?.notes ?? '', /Line one\nLine two/);
  });

  void it('fetches GitHub issues via mocked gh CLI', async () => {
    const briefs = await fetchGitHubIssueBriefs(
      process.cwd(),
      { label: 'e2e-test', limit: 5 },
      {
        runGh: async args => {
          assert.equal(args.includes('--label'), true);
          return {
            exitCode: 0,
            seconds: 0.05,
            stderr: '',
            stdout: JSON.stringify([
              {
                number: 42,
                title: 'Test-900 Archive record via action bar',
                body: '### Steps\n1. Open record\n2. Archive record',
                labels: [{ name: 'domain:contentRecord' }, { name: 'not-fedramp' }],
                url: 'https://github.com/org/repo/issues/42',
              },
            ]),
          };
        },
      }
    );

    assert.equal(briefs.length, 1);
    assert.equal(briefs[0]?.testId, 'Test-900');
    assert.equal(briefs[0]?.domain, 'contentrecord');
    assert.deepEqual(briefs[0]?.tags, ['@notfedramp']);
    assert.deepEqual(briefs[0]?.steps, ['Open record', 'Archive record']);
    assert.equal(briefs[0]?.source, 'github-issue#42');
  });

  void it('splits unchecked Markdown task-checklist items while preserving context', () => {
    const md = `Survey answer field test coverage:
- [x] Test-652 Existing completed item
- [ ] Test-653 Create a survey answer field
- [ ] **Test-654**: Update a survey answer field
`;
    const briefs = parseMarkdownBriefs(md, 'checklist.md');
    assert.equal(briefs.length, 2);
    assert.equal(briefs[0]?.testId, 'Test-653');
    assert.equal(briefs[0]?.title, 'Create a survey answer field');
    assert.equal(briefs[0]?.source, 'checklist.md#item-1');
    assert.match(briefs[0]?.notes ?? '', /Survey answer field test coverage:/);
    assert.equal(briefs[1]?.testId, 'Test-654');
    assert.equal(briefs[1]?.title, 'Update a survey answer field');
    assert.equal(briefs[1]?.source, 'checklist.md#item-2');
  });

  void it('expands GitHub issue Test-ID checklists into isolated briefs and rejects all-checked issues', async () => {
    const briefs = await fetchGitHubIssueBriefs(
      process.cwd(),
      { issue: '325' },
      {
        runGh: async () => ({
          exitCode: 0,
          seconds: 0.04,
          stderr: '',
          stdout: JSON.stringify({
            number: 325,
            title: '[FEAT]: Add tests for survey answer field',
            body: [
              'Scope note: verify field grid behavior.',
              '- [x] Test-652 Already done',
              '- [ ] Test-653 Create a survey answer field',
              '- [ ] Test-654 Update a survey answer field',
            ].join('\n'),
            labels: [{ name: 'domain:fields' }, { name: 'not-fedramp' }],
            url: 'https://github.com/org/repo/issues/325',
          }),
        }),
      }
    );

    assert.equal(briefs.length, 2);
    assert.equal(briefs[0]?.testId, 'Test-653');
    assert.equal(briefs[0]?.title, 'Create a survey answer field');
    assert.equal(briefs[0]?.source, 'github-issue#325#item-1');
    assert.equal(briefs[0]?.domain, 'fields');
    assert.deepEqual(briefs[0]?.tags, ['@notfedramp']);
    assert.equal(briefs[0]?.rawText, undefined);
    assert.match(briefs[0]?.notes ?? '', /Parent issue: \[FEAT\]: Add tests for survey answer field/);
    assert.match(briefs[0]?.notes ?? '', /Issue URL: https:\/\/github\.com\/org\/repo\/issues\/325/);
    assert.match(briefs[0]?.notes ?? '', /Scope note: verify field grid behavior\./);

    assert.equal(briefs[1]?.testId, 'Test-654');
    assert.equal(briefs[1]?.title, 'Update a survey answer field');
    assert.equal(briefs[1]?.source, 'github-issue#325#item-2');
    assert.equal(briefs[1]?.rawText, undefined);

    await assert.rejects(
      () =>
        fetchGitHubIssueBriefs(
          process.cwd(),
          { issue: '326' },
          {
            runGh: async () => ({
              exitCode: 0,
              seconds: 0.02,
              stderr: '',
              stdout: JSON.stringify({
                number: 326,
                title: '[FEAT]: Completed checklist',
                body: '- [x] Test-655 Delete a survey answer field',
                labels: [],
              }),
            }),
          }
        ),
      /already checked/
    );
  });

  void it('fetches Onspring single record, query, and report data with field-ID mapping', async () => {
    const repo = createTempDir('agent-onspring-ingest-');
    writeTempFile(
      repo,
      'onspring.map.json',
      JSON.stringify({
        appId: 50,
        fields: { testId: 101, title: 102, domain: 103, steps: 104, assertions: 105 },
        columns: { testId: 'Test Case ID', title: 'Scenario', assertions: 'Expected' },
      })
    );
    writeTempFile(repo, '.env', 'ONSPRING_CORP_API_URL=https://api.example.com\nONSPRING_CORP_API_KEY=secret-key\n');

    const prevUrl = process.env.ONSPRING_CORP_API_URL;
    const prevKey = process.env.ONSPRING_CORP_API_KEY;
    delete process.env.ONSPRING_CORP_API_URL;
    delete process.env.ONSPRING_CORP_API_KEY;

    try {
      const singleBriefs = await fetchOnspringBriefs(
        repo,
        { onspringConfigPath: 'onspring.map.json', recordId: 77 },
        {
          fetchFn: async (input, init) => {
            assert.equal(String(input), 'https://api.example.com/v2/records/appId/50/recordId/77?dataFormat=Formatted');
            const hdrs = init?.headers as Record<string, string>;
            assert.equal(hdrs['x-apikey'], 'secret-key');
            assert.equal(hdrs['x-api-version'], '2');
            return new Response(
              JSON.stringify({
                recordId: 77,
                fieldData: [
                  { fieldId: 101, value: 'Test-701' },
                  { fieldId: 102, value: 'Add dashboard widget' },
                  { fieldId: 103, value: { name: 'dashboard' } },
                  { fieldId: 104, value: '<p>1. Open designer</p><p>2. Drag widget</p>' },
                  { fieldId: 105, value: 'Widget saves cleanly' },
                ],
              }),
              { status: 200 }
            );
          },
        }
      );

      assert.equal(singleBriefs.length, 1);
      assert.equal(singleBriefs[0]?.testId, 'Test-701');
      assert.equal(singleBriefs[0]?.domain, 'dashboard');
      assert.deepEqual(singleBriefs[0]?.steps, ['Open designer', 'Drag widget']);

      const reportBriefs = await fetchOnspringBriefs(
        repo,
        { onspringConfigPath: 'onspring.map.json', reportId: 99 },
        {
          fetchFn: async input => {
            assert.equal(
              String(input),
              'https://api.example.com/v2/reports/id/99?apiDataFormat=ReportData&dataFormat=Formatted'
            );
            return new Response(
              JSON.stringify({
                columns: ['Test Case ID', 'Scenario', 'Domain', 'Expected'],
                rows: [{ recordId: 88, cells: ['Test-702', 'Filter grid rows', 'apps', 'Rows match filter'] }],
              }),
              { status: 200 }
            );
          },
        }
      );

      assert.equal(reportBriefs.length, 1);
      assert.equal(reportBriefs[0]?.testId, 'Test-702');
      assert.equal(reportBriefs[0]?.domain, 'apps');
      assert.deepEqual(reportBriefs[0]?.assertions, ['Rows match filter']);
    } finally {
      if (prevUrl !== undefined) process.env.ONSPRING_CORP_API_URL = prevUrl;
      if (prevKey !== undefined) process.env.ONSPRING_CORP_API_KEY = prevKey;
    }
  });
});

void describe('executeBatchOrchestrator', () => {
  async function initTempRepo(prefix: string): Promise<string> {
    const repo = createTempDir(prefix);
    writeTempFile(
      repo,
      'package.json',
      JSON.stringify({ name: 'batch-test', workspaces: ['packages/*'], scripts: { 'build:packages': 'node -e ""' } })
    );
    writeTempFile(repo, 'packages/onspring-ui/src/index.ts', '');

    const initRes = await runCommand('git', ['init'], { cwd: repo });
    assert.equal(initRes.exitCode, 0);
    await runCommand('git', ['config', 'user.email', 'test@example.com'], { cwd: repo });
    await runCommand('git', ['config', 'user.name', 'Test User'], { cwd: repo });
    await runCommand('git', ['add', '-A'], { cwd: repo });
    await runCommand('git', ['commit', '-m', 'init'], { cwd: repo });
    return repo;
  }

  void it('stacks batch briefs sequentially onto one shared branch and cleans up worktree', async () => {
    const repo = await initTempRepo('agent-batch-shared-');
    const mockScript = path.join(repo, 'batch-runner.mjs');
    writeTempFile(
      repo,
      'batch-runner.mjs',
      `import fs from 'node:fs';
const promptText = fs.readFileSync(process.argv[2], 'utf8');
const idMatch = /Test-\\d+/.exec(promptText);
const id = idMatch ? idMatch[0].toLowerCase() : 'demo';
fs.mkdirSync('tests/sample', { recursive: true });
fs.writeFileSync('tests/sample/' + id + '.spec.ts', "test('" + id + "', async ({ sysAdminActor }) => { test.info().annotations.push({ type: AnnotationType.TestId, description: '" + id + "' }); await sysAdminActor.browse().checkPage().hasUrl(/ok/); });\\n", 'utf8');
`
    );

    const briefs = [
      { testId: 'Test-11', title: 'First shared scenario', domain: 'sample', source: 'csv#1' },
      { testId: 'Test-12', title: 'Second shared scenario', domain: 'sample', source: 'csv#2' },
    ];

    const { exitCode, report } = await executeBatchOrchestrator(
      repo,
      briefs,
      {
        runner: 'custom',
        runnerCmd: `node ${/\s/.test(mockScript) ? `"${mockScript}"` : mockScript} {{promptFile}}`,
        domain: 'sample',
        maxAttempts: 1,
        baseRef: 'HEAD',
        inPlace: false,
        installDeps: false,
        skipE2e: true,
        noFailFast: false,
        commit: false,
        draftPr: false,
        cleanupWorktree: true,
        dryRun: false,
        quiet: true,
        sharedBranch: 'feat/shared-batch',
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
    assert.equal(report.mode, 'shared-branch');
    assert.equal(report.sharedBranch, 'feat/shared-batch');
    assert.equal(report.passed, 2);
    assert.equal(Boolean(report.runs[0]?.commitSha), true);
    assert.equal(Boolean(report.runs[1]?.commitSha), true);
    assert.notEqual(report.runs[0]?.commitSha, report.runs[1]?.commitSha);
    assert.equal(fs.existsSync(path.join(report.runDir, 'batch-report.json')), true);
    assert.equal(fs.existsSync(path.join(report.runDir, 'batch-report.md')), true);
    assert.equal(report.sharedWorktreeDir ? fs.existsSync(report.sharedWorktreeDir) : false, false);

    const logRes = await runCommand('git', ['log', '--oneline', 'feat/shared-batch'], { cwd: repo });
    assert.match(logRes.stdout, /Test-11 First shared scenario/);
    assert.match(logRes.stdout, /Test-12 Second shared scenario/);
  });

  void it('runs batch briefs on separate isolated branches by default', async () => {
    const repo = await initTempRepo('agent-batch-iso-');
    const mockScript = path.join(repo, 'iso-runner.mjs');
    writeTempFile(
      repo,
      'iso-runner.mjs',
      `import fs from 'node:fs';
const promptText = fs.readFileSync(process.argv[2], 'utf8');
const idMatch = /Test-\\d+/.exec(promptText);
const id = idMatch ? idMatch[0].toLowerCase() : 'demo';
fs.mkdirSync('tests/sample', { recursive: true });
fs.writeFileSync('tests/sample/' + id + '.spec.ts', "test('" + id + "', async ({ sysAdminActor }) => { test.info().annotations.push({ type: AnnotationType.TestId, description: '" + id + "' }); await sysAdminActor.browse().checkPage().hasUrl(/ok/); });\\n", 'utf8');
`
    );

    const briefs = [
      { testId: 'Test-21', title: 'Isolated alpha', domain: 'sample', source: 'json#1' },
      { testId: 'Test-22', title: 'Isolated beta', domain: 'sample', source: 'json#2' },
    ];

    const { exitCode, report } = await executeBatchOrchestrator(
      repo,
      briefs,
      {
        runner: 'custom',
        runnerCmd: `node ${/\s/.test(mockScript) ? `"${mockScript}"` : mockScript} {{promptFile}}`,
        domain: 'sample',
        maxAttempts: 1,
        baseRef: 'HEAD',
        inPlace: false,
        installDeps: false,
        skipE2e: true,
        noFailFast: false,
        commit: true,
        draftPr: false,
        cleanupWorktree: true,
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
    assert.equal(report.mode, 'isolated');
    assert.equal(report.passed, 2);
    assert.equal(report.runs[0]?.branch, 'agent/test-21-isolated-alpha');
    assert.equal(report.runs[1]?.branch, 'agent/test-22-isolated-beta');
  });
});
