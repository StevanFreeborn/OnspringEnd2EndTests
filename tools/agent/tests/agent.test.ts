import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, it } from 'node:test';
import { buildCatalog } from '../src/catalog.js';
import { indexMarkdownSections, parseFrontmatter, rankSections } from '../src/helpSearch.js';
import { parseCliArgs } from '../src/utils.js';
import { runArchitectureGuardrails } from '../src/verify.js';

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
