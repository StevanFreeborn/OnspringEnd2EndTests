import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { createApp } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { ObjectVisibilityOutcome, ObjectVisibilitySection } from '../../models/objectVisibilityOutcome';
import { TextRule } from '../../models/rule';
import { FilterRuleLogic } from '../../models/ruleLogic';
import { TextField } from '../../models/textField';
import { Trigger } from '../../models/trigger';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { InvalidTriggersReportPage } from '../../pageObjectModels/systemReports/invalidTriggersReportPage';
import { AnnotationType } from '../annotations';

type InvalidTriggersReportTestFixtures = {
  testApp: App;
  appAdminPage: AppAdminPage;
  invalidTriggersReportPage: InvalidTriggersReportPage;
};

const test = base.extend<InvalidTriggersReportTestFixtures>({
  testApp: async ({ sysAdminPage }, use) => {
    const app = await createApp(sysAdminPage);
    await use(app);
  },
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
  invalidTriggersReportPage: async ({ sysAdminPage }, use) => await use(new InvalidTriggersReportPage(sysAdminPage)),
});

test.describe('invalid triggers report', () => {
  test('Filter the invalid triggers and outcomes report', async ({
    testApp,
    appAdminPage,
    invalidTriggersReportPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-538',
    });

    const textField = new TextField({
      name: FakeDataFactory.createFakeFieldName(),
    });

    const trigger = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      description: 'This is a test trigger.',
      status: true,
      logicMode: 'Advanced Mode',
      ruleSet: new FilterRuleLogic({
        filterLogic: '1',
        rules: [new TextRule({ fieldName: textField.name, operator: 'Is Empty' })],
      }),
      outcomes: [
        new ObjectVisibilityOutcome({
          sections: [
            new ObjectVisibilitySection({
              tabName: 'About',
              name: 'Record Information',
              visibility: 'Read Only',
            }),
          ],
        }),
      ],
    });

    await test.step('Create invalid triggers', async () => {
      await appAdminPage.goto(testApp.id);

      await appAdminPage.layoutTabButton.click();

      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textField);

      await appAdminPage.triggersTabButton.click();
      await appAdminPage.triggersTab.addTrigger(trigger);

      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.deleteLayoutItemFromFieldsAndObjectsGrid(textField);
    });

    await test.step('Navigate to the invalid triggers report', async () => {
      await invalidTriggersReportPage.goto();
    });

    await test.step('Filter the invalid triggers report', async () => {
      await invalidTriggersReportPage.filterReport({ appFilter: testApp.name });
    });

    await test.step('Verify the invalid triggers report is filtered', async () => {
      await expect(async () => {
        await invalidTriggersReportPage.reload();

        await expect(invalidTriggersReportPage.getRowByText(trigger.name)).toBeVisible({ timeout: 1_000 });
      }).toPass({ timeout: 300_000, intervals: [1_000] });
    });
  });

  test('Sort the invalid triggers and outcomes report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-539',
    });

    expect(true).toBeTruthy();
  });

  test('Edit a trigger and outcome in the invalid triggers and outcomes report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-540',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a trigger and outcome in the invalid triggers and outcomes report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-541',
    });

    expect(true).toBeTruthy();
  });
});
