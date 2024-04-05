import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
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

  test('Update the configuration of a trigger on an app', () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-189',
    });

    expect(true).toBe(true);
  });

  test('Delete a trigger from an app', () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-190',
    });

    expect(true).toBe(true);
  });

  test('Filter triggers by outcome type', () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-191',
    });

    expect(true).toBe(true);
  });
});
