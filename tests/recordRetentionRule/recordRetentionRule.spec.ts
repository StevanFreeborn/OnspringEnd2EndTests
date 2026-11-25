import { App, DateRule, FakeDataFactory, RecordRetentionRule, SimpleRuleLogic } from '@stevanfreeborn/onspring-models';
import { AppRecordRetentionTabTargets, AppTasks, RecordRetentionRuleTasks } from '@stevanfreeborn/onspring-ui';
import { AppFixture, test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';

const test = base.extend<{ app: App }>({
  app: AppFixture.create().build(),
});

test.describe('record retention rule', () => {
  test('Create a record retention rule from the Record Retention tab of an app', async ({ app, sysAdminActor }) => {
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

    await test.step('Navigate to the record retention tab', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppRecordRetentionTab(app.id));
    });

    await test.step('Create the record retention rule', async () => {
      await sysAdminActor.attemptsTo(RecordRetentionRuleTasks.addRule(recordRetentionRule));
    });

    await test.step('Verify the record retention rule was created', async () => {
      await sysAdminActor
        .browse()
        .check(AppRecordRetentionTabTargets.ruleRowByName(recordRetentionRule.name))
        .isVisible();
    });
  });

  test('Update a record retention rule from the Record Retention tab of an app', async ({ app, sysAdminActor }) => {
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

    await test.step('Navigate to the record retention tab', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppRecordRetentionTab(app.id));
    });

    await test.step('Create the record retention rule', async () => {
      await sysAdminActor.attemptsTo(RecordRetentionRuleTasks.addRule(updatedRecordRetentionRule));
    });

    updatedRecordRetentionRule.name = newName;

    await test.step('Update the record retention rule', async () => {
      await sysAdminActor.attemptsTo(RecordRetentionRuleTasks.updateRule(originalName, updatedRecordRetentionRule));
    });

    await test.step('Verify the record retention rule was updated', async () => {
      await sysAdminActor
        .browse()
        .check(AppRecordRetentionTabTargets.ruleRowByName(updatedRecordRetentionRule.name))
        .isVisible();
    });
  });

  test('Delete a record retention rule from the Record Retention tab of an app', async ({ app, sysAdminActor }) => {
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

    await test.step('Navigate to the record retention tab', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppRecordRetentionTab(app.id));
    });

    await test.step('Create the record retention rule', async () => {
      await sysAdminActor.attemptsTo(RecordRetentionRuleTasks.addRule(recordRetentionRule));
    });

    await test.step('Delete the record retention rule', async () => {
      await sysAdminActor.attemptsTo(RecordRetentionRuleTasks.deleteRule(recordRetentionRule.name));
    });

    await test.step('Verify the record retention rule was deleted', async () => {
      await sysAdminActor
        .browse()
        .check(AppRecordRetentionTabTargets.ruleRowByName(recordRetentionRule.name))
        .isHidden();
    });
  });

  test("Enable a record retention rule from an app's Record Retention tab", async ({ app, sysAdminActor }) => {
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

    await test.step('Navigate to the record retention tab', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppRecordRetentionTab(app.id));
    });

    await test.step('Create the record retention rule', async () => {
      await sysAdminActor.attemptsTo(RecordRetentionRuleTasks.addRule(recordRetentionRule));
    });

    recordRetentionRule.status = true;

    await test.step('Enable the record retention rule', async () => {
      await sysAdminActor.attemptsTo(
        RecordRetentionRuleTasks.updateRule(recordRetentionRule.name, recordRetentionRule)
      );
    });

    await test.step('Verify the record retention rule is enabled', async () => {
      await sysAdminActor
        .browse()
        .check(AppRecordRetentionTabTargets.ruleRowByName(recordRetentionRule.name))
        .hasText(/enabled/i);
    });
  });

  test("Disable a record retention rule from an app's Record Retention tab", async ({ app, sysAdminActor }) => {
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

    await test.step('Navigate to the record retention tab', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppRecordRetentionTab(app.id));
    });

    await test.step('Create the record retention rule', async () => {
      await sysAdminActor.attemptsTo(RecordRetentionRuleTasks.addRule(recordRetentionRule));
    });

    recordRetentionRule.status = false;

    await test.step('Disable the record retention rule', async () => {
      await sysAdminActor.attemptsTo(
        RecordRetentionRuleTasks.updateRule(recordRetentionRule.name, recordRetentionRule)
      );
    });

    await test.step('Verify the record retention rule is disabled', async () => {
      await sysAdminActor
        .browse()
        .check(AppRecordRetentionTabTargets.ruleRowByName(recordRetentionRule.name))
        .hasText(/disabled/i);
    });
  });
});
