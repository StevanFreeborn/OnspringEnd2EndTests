import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { RecordRetentionRule } from '../../models/recordRetentionRule';
import { DateRule } from '../../models/rule';
import { SimpleRuleLogic } from '../../models/ruleLogic';
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
      ruleSet: new SimpleRuleLogic({
        rules: [new DateRule({ fieldName: 'Created Date', operator: 'Is Not Empty' })],
      }),
    });

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Navigate to the record retention tab', async () => {
      await appAdminPage.recordRetentionTabButton.click();
    });

    await test.step('Create the record retention rule', async () => {
      await appAdminPage.recordRetentionTab.addRule(recordRetentionRule);
    });

    await test.step('Verify the record retention rule was created', async () => {
      const row = await appAdminPage.recordRetentionTab.getRuleRowByName(recordRetentionRule.name);
      await expect(row).toBeVisible();
    });
  });

  test('Update a record retention rule from the Record Retention tab of an app', async ({ app, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-250',
    });

    const originalName = FakeDataFactory.createFakeRecordRetentionRuleName();
    const newName = FakeDataFactory.createFakeRecordRetentionRuleName();

    const updatedRecordRetentionRule = new RecordRetentionRule({
      name: originalName,
      ruleSet: new SimpleRuleLogic({
        rules: [new DateRule({ fieldName: 'Created Date', operator: 'Is Not Empty' })],
      }),
    });

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Navigate to the record retention tab', async () => {
      await appAdminPage.recordRetentionTabButton.click();
    });

    await test.step('Create the record retention rule', async () => {
      await appAdminPage.recordRetentionTab.addRule(updatedRecordRetentionRule);
    });

    updatedRecordRetentionRule.name = newName;

    await test.step('Update the record retention rule', async () => {
      await appAdminPage.recordRetentionTab.updateRule(originalName, updatedRecordRetentionRule);
    });

    await test.step('Verify the record retention rule was updated', async () => {
      const row = await appAdminPage.recordRetentionTab.getRuleRowByName(updatedRecordRetentionRule.name);
      await expect(row).toBeVisible();
    });
  });

  test('Delete a record retention rule from the Record Retention tab of an app', async ({ app, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-251',
    });

    const recordRetentionRule = new RecordRetentionRule({
      name: FakeDataFactory.createFakeRecordRetentionRuleName(),
      ruleSet: new SimpleRuleLogic({
        rules: [new DateRule({ fieldName: 'Created Date', operator: 'Is Not Empty' })],
      }),
    });

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Navigate to the record retention tab', async () => {
      await appAdminPage.recordRetentionTabButton.click();
    });

    await test.step('Create the record retention rule', async () => {
      await appAdminPage.recordRetentionTab.addRule(recordRetentionRule);
    });

    await test.step('Delete the record retention rule', async () => {
      await appAdminPage.recordRetentionTab.deleteRule(recordRetentionRule.name);
    });

    await test.step('Verify the record retention rule was deleted', async () => {
      const row = await appAdminPage.recordRetentionTab.getRuleRowByName(recordRetentionRule.name);
      await expect(row).toBeHidden();
    });
  });

  test("Enable a record retention rule from an app's Record Retention tab", async ({ app, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-252',
    });

    const recordRetentionRule = new RecordRetentionRule({
      name: FakeDataFactory.createFakeRecordRetentionRuleName(),
      ruleSet: new SimpleRuleLogic({
        rules: [new DateRule({ fieldName: 'Created Date', operator: 'Is Not Empty' })],
      }),
    });

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Navigate to the record retention tab', async () => {
      await appAdminPage.recordRetentionTabButton.click();
    });

    await test.step('Create the record retention rule', async () => {
      await appAdminPage.recordRetentionTab.addRule(recordRetentionRule);
    });

    recordRetentionRule.status = true;

    await test.step('Enable the record retention rule', async () => {
      await appAdminPage.recordRetentionTab.updateRule(recordRetentionRule.name, recordRetentionRule);
    });

    await test.step('Verify the record retention rule is enabled', async () => {
      const row = await appAdminPage.recordRetentionTab.getRuleRowByName(recordRetentionRule.name);
      await expect(row).toHaveText(/enabled/i);
    });
  });

  test("Disable a record retention rule from an app's Record Retention tab", async ({ app, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-253',
    });

    const recordRetentionRule = new RecordRetentionRule({
      name: FakeDataFactory.createFakeRecordRetentionRuleName(),
      ruleSet: new SimpleRuleLogic({
        rules: [new DateRule({ fieldName: 'Created Date', operator: 'Is Not Empty' })],
      }),
      status: true,
    });

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Navigate to the record retention tab', async () => {
      await appAdminPage.recordRetentionTabButton.click();
    });

    await test.step('Create the record retention rule', async () => {
      await appAdminPage.recordRetentionTab.addRule(recordRetentionRule);
    });

    recordRetentionRule.status = false;

    await test.step('Disable the record retention rule', async () => {
      await appAdminPage.recordRetentionTab.updateRule(recordRetentionRule.name, recordRetentionRule);
    });

    await test.step('Verify the record retention rule is disabled', async () => {
      const row = await appAdminPage.recordRetentionTab.getRuleRowByName(recordRetentionRule.name);
      await expect(row).toHaveText(/disabled/i);
    });
  });
});
