import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect, Locator } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { ObjectVisibilityOutcome, ObjectVisibilitySection } from '../../models/objectVisibilityOutcome';
import { TextRule } from '../../models/rule';
import { FilterRuleLogic, SimpleRuleLogic } from '../../models/ruleLogic';
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
  testApp: app,
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
      await createInvalidTriggers(testApp, appAdminPage, textField, trigger);
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

  test('Sort the invalid triggers and outcomes report', async ({
    testApp,
    appAdminPage,
    invalidTriggersReportPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-539',
    });

    const textField = new TextField({
      name: FakeDataFactory.createFakeFieldName(),
    });

    const invalidTriggerOne = new Trigger({
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

    const invalidTriggerTwo = invalidTriggerOne.clone();
    invalidTriggerTwo.name = FakeDataFactory.createFakeTriggerName();

    const invalidTriggers = [invalidTriggerOne, invalidTriggerTwo];

    await test.step('Create invalid triggers', async () => {
      await createInvalidTriggers(testApp, appAdminPage, textField, ...invalidTriggers);
    });

    await test.step('Navigate to the invalid formulas report', async () => {
      await invalidTriggersReportPage.goto();
    });

    await test.step('Sort the invalid formulas report', async () => {
      await invalidTriggersReportPage.clearSort();
      await invalidTriggersReportPage.sortGridBy('Last Saved', 'descending');
    });

    await test.step('Verify the invalid triggers report is sorted', async () => {
      let rows: Locator[] = [];

      await invalidTriggersReportPage.filterReport({ appFilter: testApp.name });

      await expect(async () => {
        await invalidTriggersReportPage.reload();

        rows = await invalidTriggersReportPage.getRows();
        expect(rows.length).toBeGreaterThanOrEqual(invalidTriggers.length);
      }).toPass({ timeout: 300_000, intervals: [1_000] });

      const timestamps: number[] = [];

      for (const row of rows) {
        const lastSavedText = await row.locator('td').nth(3).innerText();
        const lastSavedDate = new Date(lastSavedText.trim()).getTime();
        timestamps.push(lastSavedDate);
      }

      for (let i = 0; i < rows.length - 1; i++) {
        const lastSavedDateColumnIndex = 3;
        const currentRowLastSavedText = await rows[i].locator('td').nth(lastSavedDateColumnIndex).innerText();
        const nextRowLastSavedText = await rows[i + 1].locator('td').nth(lastSavedDateColumnIndex).innerText();

        const currentRowTimestamp = new Date(currentRowLastSavedText.trim()).getTime();
        const nextRowTimestamp = new Date(nextRowLastSavedText.trim()).getTime();

        expect(currentRowTimestamp).toBeGreaterThanOrEqual(nextRowTimestamp);
      }
    });
  });

  test('Edit a trigger and outcome in the invalid triggers and outcomes report', async ({
    testApp,
    appAdminPage,
    invalidTriggersReportPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-540',
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
      await createInvalidTriggers(testApp, appAdminPage, textField, trigger);
    });

    await test.step('Navigate to the invalid triggers report', async () => {
      await invalidTriggersReportPage.goto();
    });

    await test.step('Edit the invalid trigger', async () => {
      await invalidTriggersReportPage.filterReport({ appFilter: testApp.name });

      await expect(async () => {
        await invalidTriggersReportPage.reload();
        const row = invalidTriggersReportPage.getRowByText(trigger.name);
        await expect(row).toBeVisible({ timeout: 100 });
      }).toPass({ timeout: 300_000, intervals: [1_000] });

      trigger.status = false;
      trigger.ruleSet = new SimpleRuleLogic({ rules: [] });

      await invalidTriggersReportPage.updateTrigger(trigger);
    });

    await test.step('Verify the trigger was edited successfully', async () => {
      await appAdminPage.goto(testApp.id);
      await appAdminPage.triggersTabButton.click();

      const triggerRow = appAdminPage.triggersTab.triggersGrid.getByRole('row', { name: trigger.name });
      await expect(triggerRow).toHaveText(/Disabled/);
    });
  });

  test('Delete a trigger and outcome in the invalid triggers and outcomes report', async ({
    testApp,
    appAdminPage,
    invalidTriggersReportPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-541',
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

    await test.step('Create the invalid trigger', async () => {
      await createInvalidTriggers(testApp, appAdminPage, textField, trigger);
    });

    await test.step('Navigate to the invalid triggers report', async () => {
      await invalidTriggersReportPage.goto();
    });

    await test.step('Delete the invalid trigger', async () => {
      await invalidTriggersReportPage.filterReport({ appFilter: testApp.name });

      await expect(async () => {
        await invalidTriggersReportPage.reload();
        const row = invalidTriggersReportPage.getRowByText(trigger.name);
        await expect(row).toBeVisible({ timeout: 100 });
      }).toPass({ timeout: 300_000, intervals: [1_000] });

      await invalidTriggersReportPage.deleteTrigger(trigger);
    });

    await test.step('Verify the trigger was deleted successfully', async () => {
      await appAdminPage.goto(testApp.id);
      await appAdminPage.triggersTabButton.click();

      const triggerRow = appAdminPage.triggersTab.triggersGrid.getByRole('row', { name: trigger.name });
      await expect(triggerRow).toBeHidden();
    });
  });
});

async function createInvalidTriggers(
  testApp: App,
  appAdminPage: AppAdminPage,
  fieldToDelete: TextField,
  ...triggers: Trigger[]
) {
  await appAdminPage.goto(testApp.id);

  await appAdminPage.layoutTabButton.click();

  await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(fieldToDelete);

  for (const trigger of triggers) {
    await appAdminPage.triggersTabButton.click();
    await appAdminPage.triggersTab.addTrigger(trigger);
  }

  await appAdminPage.layoutTabButton.click();
  await appAdminPage.layoutTab.deleteLayoutItemFromFieldsAndObjectsGrid(fieldToDelete);
}
