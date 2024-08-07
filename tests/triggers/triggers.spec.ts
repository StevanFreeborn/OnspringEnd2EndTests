import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { ObjectVisibilityOutcome, ObjectVisibilitySection } from '../../models/objectVisibilityOutcome';
import { Trigger } from '../../models/trigger';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AnnotationType } from '../annotations';

type TriggersTestFixtures = {
  app: App;
  appAdminPage: AppAdminPage;
};

const test = base.extend<TriggersTestFixtures>({
  app: app,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
});

test.describe('Triggers', () => {
  test('Add a trigger to an app', async ({ app, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-186',
    });

    const trigger = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      description: 'This is a test trigger.',
    });

    await test.step("Navigate to the app's trigger tab", async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.triggersTabButton.click();
    });

    await test.step('Add a new trigger', async () => {
      await appAdminPage.triggersTab.addTrigger(trigger);
    });

    await test.step('Verify the trigger was added', async () => {
      const triggerRow = appAdminPage.triggersTab.triggersGrid.getByRole('row', { name: trigger.name });
      await expect(triggerRow).toBeVisible();
    });
  });

  test('Enable a trigger on an app', async ({ app, appAdminPage }) => {
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
      await appAdminPage.goto(app.id);
      await appAdminPage.triggersTabButton.click();
    });

    await test.step('Add a new enabled trigger', async () => {
      await appAdminPage.triggersTab.addTrigger(trigger);
    });

    await test.step('Verify the trigger was enabled', async () => {
      const triggerRow = appAdminPage.triggersTab.triggersGrid.getByRole('row', { name: trigger.name });

      await expect(triggerRow).toBeVisible();
      await expect(triggerRow).toHaveText(/enabled/i);
    });
  });

  test('Disable a trigger on an app', async ({ app, appAdminPage }) => {
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
      await appAdminPage.goto(app.id);
      await appAdminPage.triggersTabButton.click();
    });

    await test.step('Add a new enabled trigger', async () => {
      await appAdminPage.triggersTab.addTrigger(trigger);
    });

    await test.step('Disable the trigger', async () => {
      const triggerRow = appAdminPage.triggersTab.triggersGrid.getByRole('row', { name: trigger.name });

      await triggerRow.click();
      await appAdminPage.triggersTab.addOrEditTriggerModal.generalTab.statusToggle.click();
      await appAdminPage.triggersTab.addOrEditTriggerModal.saveButton.click();
    });

    await test.step('Verify the trigger was disabled', async () => {
      const triggerRow = appAdminPage.triggersTab.triggersGrid.getByRole('row', { name: trigger.name });

      await expect(triggerRow).toBeVisible();
      await expect(triggerRow).toHaveText(/disabled/i);
    });
  });

  test('Update the configuration of a trigger on an app', async ({ app, appAdminPage }) => {
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
      await appAdminPage.goto(app.id);
      await appAdminPage.triggersTabButton.click();
    });

    await test.step('Add a new trigger', async () => {
      await appAdminPage.triggersTab.addTrigger(trigger);
    });

    await test.step('Update the trigger configuration', async () => {
      const triggerRow = appAdminPage.triggersTab.triggersGrid.getByRole('row', { name: trigger.name });

      await triggerRow.click();
      await appAdminPage.triggersTab.addOrEditTriggerModal.generalTab.nameInput.fill(updatedTriggerName);
      await appAdminPage.triggersTab.addOrEditTriggerModal.saveButton.click();
    });

    await test.step('Verify the trigger was updated', async () => {
      const triggerRow = appAdminPage.triggersTab.triggersGrid.getByRole('row', { name: updatedTriggerName });

      await expect(triggerRow).toBeVisible();
    });
  });

  test('Delete a trigger from an app', async ({ app, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-190',
    });

    const trigger = new Trigger({
      name: FakeDataFactory.createFakeTriggerName(),
      description: 'This is a test trigger.',
    });

    await test.step("Navigate to the app's trigger tab", async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.triggersTabButton.click();
    });

    await test.step('Add a new trigger', async () => {
      await appAdminPage.triggersTab.addTrigger(trigger);

      const triggerRow = appAdminPage.triggersTab.triggersGrid.getByRole('row', { name: trigger.name });
      await expect(triggerRow).toBeVisible();
    });

    await test.step('Delete the trigger', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.triggersTabButton.click();
      await appAdminPage.triggersTab.deleteTrigger(trigger.name);
    });

    await test.step('Verify the trigger was deleted', async () => {
      const triggerRow = appAdminPage.triggersTab.triggersGrid.getByRole('row', { name: trigger.name });

      await expect(triggerRow).toBeHidden();
    });
  });

  test('Filter triggers by outcome type', async ({ app, appAdminPage }) => {
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
      await appAdminPage.goto(app.id);
      await appAdminPage.triggersTabButton.click();
    });

    await test.step('Add a trigger with an outcome', async () => {
      await appAdminPage.triggersTab.addTrigger(trigger);
    });

    await test.step('Filter triggers by outcome type', async () => {
      await appAdminPage.triggersTab.filterTriggersByOutcome('Create One Record');
    });

    await test.step('Verify the trigger is not displayed', async () => {
      const triggerRow = appAdminPage.triggersTab.triggersGrid.getByRole('row', { name: trigger.name });

      await expect(triggerRow).toBeHidden();
    });
  });
});
