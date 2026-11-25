import {
  App,
  FakeDataFactory,
  FilterRuleLogic,
  ObjectVisibilityOutcome,
  ObjectVisibilitySection,
  SimpleRuleLogic,
  TextField,
  TextRule,
  Trigger,
} from '@stevanfreeborn/onspring-models';
import {
  AppTasks,
  AppTriggersTabTargets,
  FieldTasks,
  InvalidTriggersReportTargets,
  InvalidTriggersReportTasks,
  TriggerTasks,
} from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { AppFixture, expect, test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';

type InvalidTriggersReportTestFixtures = {
  testApp: App;
};

const test = base.extend<InvalidTriggersReportTestFixtures>({
  testApp: AppFixture.create().build(),
});

test.describe('invalid triggers report', () => {
  test('Filter the invalid triggers and outcomes report', async ({ testApp, sysAdminActor }) => {
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
      await createInvalidTriggers(testApp, sysAdminActor, textField, trigger);
    });

    await test.step('Navigate to the invalid triggers report', async () => {
      await sysAdminActor.attemptsTo(InvalidTriggersReportTasks.goto());
    });

    await test.step('Filter the invalid triggers report', async () => {
      await sysAdminActor.attemptsTo(InvalidTriggersReportTasks.filterReport({ appFilter: testApp.name }));
    });

    await test.step('Verify the invalid triggers report is filtered', async () => {
      await expect(async () => {
        await sysAdminActor.attemptsTo(InvalidTriggersReportTasks.reload());
        await sysAdminActor
          .browse()
          .check(InvalidTriggersReportTargets.rowByText(trigger.name))
          .isVisible({ timeout: 1_000 });
      }).toPass({ timeout: 300_000, intervals: [1_000] });
    });
  });

  test('Sort the invalid triggers and outcomes report', async ({ testApp, sysAdminActor }) => {
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
      await createInvalidTriggers(testApp, sysAdminActor, textField, ...invalidTriggers);
    });

    await test.step('Navigate to the invalid formulas report', async () => {
      await sysAdminActor.attemptsTo(InvalidTriggersReportTasks.goto());
    });

    await test.step('Sort the invalid formulas report', async () => {
      await sysAdminActor.attemptsTo(
        InvalidTriggersReportTasks.clearSort(),
        InvalidTriggersReportTasks.sortGridBy('Last Saved', 'descending')
      );
    });

    await test.step('Verify the invalid triggers report is sorted', async () => {
      await sysAdminActor.attemptsTo(InvalidTriggersReportTasks.filterReport({ appFilter: testApp.name }));

      await expect(async () => {
        await sysAdminActor.attemptsTo(InvalidTriggersReportTasks.reload());

        const rowCount = await sysAdminActor.browse().count(InvalidTriggersReportTargets.rows);
        expect(rowCount).toBeGreaterThanOrEqual(invalidTriggers.length);
      }).toPass({ timeout: 300_000, intervals: [1_000] });

      const lastSavedTexts = await sysAdminActor.browse().getAllTexts(InvalidTriggersReportTargets.lastSavedCells);

      for (let i = 0; i < lastSavedTexts.length - 1; i++) {
        const currentRowTimestamp = new Date(lastSavedTexts[i].trim()).getTime();
        const nextRowTimestamp = new Date(lastSavedTexts[i + 1].trim()).getTime();

        expect(currentRowTimestamp).toBeGreaterThanOrEqual(nextRowTimestamp);
      }
    });
  });

  test('Edit a trigger and outcome in the invalid triggers and outcomes report', async ({ testApp, sysAdminActor }) => {
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
      await createInvalidTriggers(testApp, sysAdminActor, textField, trigger);
    });

    await test.step('Navigate to the invalid triggers report', async () => {
      await sysAdminActor.attemptsTo(InvalidTriggersReportTasks.goto());
    });

    await test.step('Edit the invalid trigger', async () => {
      await sysAdminActor.attemptsTo(InvalidTriggersReportTasks.filterReport({ appFilter: testApp.name }));

      await expect(async () => {
        await sysAdminActor.attemptsTo(InvalidTriggersReportTasks.reload());
        await sysAdminActor
          .browse()
          .check(InvalidTriggersReportTargets.rowByText(trigger.name))
          .isVisible({ timeout: 100 });
      }).toPass({ timeout: 300_000, intervals: [1_000] });

      trigger.status = false;
      trigger.ruleSet = new SimpleRuleLogic({ rules: [] });

      await sysAdminActor.attemptsTo(InvalidTriggersReportTasks.updateTrigger(trigger));
    });

    await test.step('Verify the trigger was edited successfully', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(testApp.id));

      await sysAdminActor
        .browse()
        .check(AppTriggersTabTargets.triggerRowByName(trigger.name))
        .hasText(/Disabled/);
    });
  });

  test('Delete a trigger and outcome in the invalid triggers and outcomes report', async ({
    testApp,
    sysAdminActor,
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
      await createInvalidTriggers(testApp, sysAdminActor, textField, trigger);
    });

    await test.step('Navigate to the invalid triggers report', async () => {
      await sysAdminActor.attemptsTo(InvalidTriggersReportTasks.goto());
    });

    await test.step('Delete the invalid trigger', async () => {
      await sysAdminActor.attemptsTo(InvalidTriggersReportTasks.filterReport({ appFilter: testApp.name }));

      await expect(async () => {
        await sysAdminActor.attemptsTo(InvalidTriggersReportTasks.reload());
        await sysAdminActor
          .browse()
          .check(InvalidTriggersReportTargets.rowByText(trigger.name))
          .isVisible({ timeout: 100 });
      }).toPass({ timeout: 300_000, intervals: [1_000] });

      await sysAdminActor.attemptsTo(InvalidTriggersReportTasks.deleteTrigger(trigger.name));
    });

    await test.step('Verify the trigger was deleted successfully', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(testApp.id));

      await sysAdminActor.browse().check(AppTriggersTabTargets.triggerRowByName(trigger.name)).isHidden();
    });
  });
});

async function createInvalidTriggers(testApp: App, actor: WebActor, fieldToDelete: TextField, ...triggers: Trigger[]) {
  await actor.attemptsTo(AppTasks.gotoAppLayoutTab(testApp.id), FieldTasks.addFromGrid(fieldToDelete));

  for (const trigger of triggers) {
    await actor.attemptsTo(AppTasks.gotoAppTriggersTab(testApp.id), TriggerTasks.addTrigger(trigger));
  }

  await actor.attemptsTo(AppTasks.gotoAppLayoutTab(testApp.id), FieldTasks.deleteFromGrid(fieldToDelete.name));
}
