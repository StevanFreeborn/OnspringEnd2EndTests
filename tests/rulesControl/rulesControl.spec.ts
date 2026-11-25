import { App, FakeDataFactory, SimpleRuleLogic, Trigger } from '@stevanfreeborn/onspring-models';
import {
  AppTasks,
  AppTriggersTabTargets,
  RuleControlTargets,
  TriggerModalTargets,
  TriggerTasks,
} from '@stevanfreeborn/onspring-ui';
import { AppFixture, test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';

const test = base.extend<{ app: App }>({
  app: AppFixture.create().build(),
});

test.describe('rules control', () => {
  test('Verify Record is New rules can be added and are maintained after closing control and re-opening', async ({
    app,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-807',
    });

    const trigger = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      description: 'This is a test trigger.',
      ruleSet: new SimpleRuleLogic({ rules: [], addRecordIsNew: true }),
    });

    await test.step("Navigate to the app's trigger tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(app.id));
    });

    await test.step('Add a new trigger with a "Record is New" rule', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.addTrigger(trigger));
    });

    await test.step('Verify the trigger was added', async () => {
      await sysAdminActor.browse().check(AppTriggersTabTargets.triggerRowByName(trigger.name)).isVisible();
    });

    await test.step('Re-open the trigger and verify the "Record is New" rule is still selected', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.openTrigger(trigger.name));
      await sysAdminActor.browse().click(TriggerModalTargets.rulesTabButton);
      await sysAdminActor
        .browse()
        .check(RuleControlTargets.rulesList(TriggerModalTargets.rulesTab.ruleSetControl))
        .hasText(/Record is New/);
    });
  });
});
