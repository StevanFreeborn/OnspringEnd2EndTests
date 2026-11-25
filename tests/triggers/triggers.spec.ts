import {
  App,
  FakeDataFactory,
  ObjectVisibilityOutcome,
  ObjectVisibilitySection,
  Trigger,
} from '@stevanfreeborn/onspring-models';
import { AppTasks, AppTriggersTabTargets, TriggerModalTargets, TriggerTasks } from '@stevanfreeborn/onspring-ui';
import { AppFixture, test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';

const test = base.extend<{ app: App }>({
  app: AppFixture.create().build(),
});

test.describe('Triggers', () => {
  test('Add a trigger to an app', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-186',
    });

    const trigger = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      description: 'This is a test trigger.',
    });

    await test.step("Navigate to the app's trigger tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(app.id));
    });

    await test.step('Add a new trigger', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.addTrigger(trigger));
    });

    await test.step('Verify the trigger was added', async () => {
      await sysAdminActor.browse().check(AppTriggersTabTargets.triggerRowByName(trigger.name)).isVisible();
    });
  });

  test('Enable a trigger on an app', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-187',
    });

    const trigger = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      description: 'This is a test trigger.',
      status: true,
    });

    await test.step("Navigate to the app's trigger tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(app.id));
    });

    await test.step('Add a new enabled trigger', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.addTrigger(trigger));
    });

    await test.step('Verify the trigger was enabled', async () => {
      const triggerRow = AppTriggersTabTargets.triggerRowByName(trigger.name);
      await sysAdminActor.browse().check(triggerRow).isVisible();
      await sysAdminActor
        .browse()
        .check(triggerRow)
        .hasText(/enabled/i);
    });
  });

  test('Disable a trigger on an app', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-188',
    });

    const trigger = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      description: 'This is a test trigger.',
      status: true,
    });

    await test.step("Navigate to the app's trigger tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(app.id));
    });

    await test.step('Add a new enabled trigger', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.addTrigger(trigger));
    });

    await test.step('Disable the trigger', async () => {
      await sysAdminActor.attemptsTo(
        TriggerTasks.openTrigger(trigger.name),
        TriggerTasks.setModalStatus(false),
        TriggerTasks.saveModal()
      );
    });

    await test.step('Verify the trigger was disabled', async () => {
      const triggerRow = AppTriggersTabTargets.triggerRowByName(trigger.name);
      await sysAdminActor.browse().check(triggerRow).isVisible();
      await sysAdminActor
        .browse()
        .check(triggerRow)
        .hasText(/disabled/i);
    });
  });

  test('Update the configuration of a trigger on an app', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-189',
    });

    const trigger = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      description: 'This is a test trigger.',
    });

    const updatedTriggerName = FakeDataFactory.createFakeTriggerName();

    await test.step("Navigate to the app's trigger tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(app.id));
    });

    await test.step('Add a new trigger', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.addTrigger(trigger));
    });

    await test.step('Update the trigger configuration', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.openTrigger(trigger.name));
      await sysAdminActor.browse().fill(TriggerModalTargets.generalTab.nameInput, updatedTriggerName);
      await sysAdminActor.attemptsTo(TriggerTasks.saveModal());
    });

    await test.step('Verify the trigger was updated', async () => {
      await sysAdminActor.browse().check(AppTriggersTabTargets.triggerRowByName(updatedTriggerName)).isVisible();
    });
  });

  test('Delete a trigger from an app', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-190',
    });

    const trigger = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      description: 'This is a test trigger.',
    });

    await test.step("Navigate to the app's trigger tab", async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(app.id));
    });

    await test.step('Add a new trigger', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.addTrigger(trigger));
      await sysAdminActor.browse().check(AppTriggersTabTargets.triggerRowByName(trigger.name)).isVisible();
    });

    await test.step('Delete the trigger', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(app.id), TriggerTasks.deleteTrigger(trigger.name));
    });

    await test.step('Verify the trigger was deleted', async () => {
      await sysAdminActor.browse().check(AppTriggersTabTargets.triggerRowByName(trigger.name)).isHidden();
    });
  });

  test('Filter triggers by outcome type', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-191',
    });

    const trigger = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      description: 'This is a test trigger.',
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

    await test.step('Navigate to the app triggers tab', async () => {
      await sysAdminActor.attemptsTo(AppTasks.gotoAppTriggersTab(app.id));
    });

    await test.step('Add a trigger with an outcome', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.addTrigger(trigger));
    });

    await test.step('Filter triggers by outcome type', async () => {
      await sysAdminActor.attemptsTo(TriggerTasks.filterTriggersByOutcome('Create One Record'));
    });

    await test.step('Verify the trigger is not displayed', async () => {
      await sysAdminActor.browse().check(AppTriggersTabTargets.triggerRowByName(trigger.name)).isHidden();
    });
  });
});
