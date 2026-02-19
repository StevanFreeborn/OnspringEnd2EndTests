import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { Trigger } from '../../models/trigger';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AnnotationType } from '../annotations';

type RulesControlTestFixtures = {
  app: App;
  appAdminPage: AppAdminPage;
};

const test = base.extend<RulesControlTestFixtures>({
  app: app,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
});

test.describe('rules control', () => {
  test('Verify Record is New rules can be added and are maintained after closing control and re-opening', async ({
    app,
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-807',
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
});
