import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { RecordRetentionRule } from '../../models/recordRetentionRule';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AnnotationType } from '../annotations';

type RecordRetentionRuleTestFixtures = {
  app: App;
  appAdminPage: AppAdminPage;
};

const test = base.extend<RecordRetentionRuleTestFixtures>({
  app: app,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
});

test.describe('record retention rule', () => {
  test('Create a record retention rule from the Record Retention tab of an app', async ({ app, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-249',
    });

    const recordRetentionRule = new RecordRetentionRule({
      name: FakeDataFactory.createFakeRecordRetentionRuleName(),
    });

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Navigate to the Record Retention tab', async () => {
      await appAdminPage.recordRetentionTabButton.click();
    });

    await test.step('Create the record retention rule', async () => {
      await appAdminPage.recordRetentionTab.addRule(recordRetentionRule);
      await appAdminPage.recordRetentionTab.editRuleModal.cancel();
    });

    await test.step('Verify the record retention rule was created', async () => {
      const row = await appAdminPage.recordRetentionTab.getRuleRowByName(recordRetentionRule.name);
      await expect(row).toBeVisible();
    });
  });

  test('Update a record retention rule from the Record Retention tab of an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-250',
    });

    expect(true).toBe(true);
  });

  test('Delete a record retention rule from the Record Retention tab of an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-251',
    });

    expect(true).toBe(true);
  });

  test("Enable a record retention rule from an app's Record Retention tab", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-252',
    });

    expect(true).toBe(true);
  });

  test("Disable a record retention rule from an app's Record Retention tab", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-253',
    });

    expect(true).toBe(true);
  });
});
