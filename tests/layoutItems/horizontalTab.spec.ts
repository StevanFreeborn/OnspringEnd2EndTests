import { App } from '@stevanfreeborn/onspring-models';
import { AppTasks, ContentRecordTargets, ContentTasks } from '@stevanfreeborn/onspring-ui';
import { AppFixture, test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';

type HorizontalTabTestFixtures = {
  app: App;
};

const test = base.extend<HorizontalTabTestFixtures>({
  app: AppFixture.create().build(),
});

test.describe('horizontal tab', () => {
  test.beforeEach(async ({ sysAdminActor, app }) => {
    await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id));
  });

  test("Add a horizontal tab to an app's layout", async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-42',
    });

    const tabName = 'New Tab';

    await test.step('Add a horizontal tab to the layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.addLayoutTab({ name: tabName }),
        AppTasks.dragFieldOntoLayout({
          tabName,
          sectionName: 'Section 1',
          column: 0,
          row: 0,
          fieldName: 'Last Saved By',
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Verify the horizontal tab is added', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      await sysAdminActor.browse().check(ContentRecordTargets.tabByName(tabName)).isVisible();
    });
  });

  test("Update a horizontal tab on an app's layout", async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-43',
    });

    const tabName = 'Updated Tab Name';

    await test.step('Update a horizontal tab on the layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.dragFieldOntoLayout({
          tabName: 'Tab 2',
          sectionName: 'Section 1',
          column: 0,
          row: 0,
          fieldName: 'Last Saved By',
        }),
        AppTasks.updateLayoutTabName({ currentName: 'Tab 2', newName: tabName }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Verify the horizontal tab is updated', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      await sysAdminActor.browse().check(ContentRecordTargets.tabByName(tabName)).isVisible();
    });
  });

  test("Delete a horizontal tab on an app's layout", async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-44',
    });

    const tabName = 'Tab 2';

    await test.step('Delete a horizontal tab on the layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.deleteLayoutTab(tabName),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Verify the horizontal tab is deleted', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      await sysAdminActor.browse().check(ContentRecordTargets.tabByName(tabName)).isHidden();
    });
  });

  test("Rearrange the horizontal tabs on an app's layout", async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-45',
    });

    await test.step('Rearrange the horizontal tabs on the layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.dragFieldOntoLayout({
          tabName: 'Tab 2',
          sectionName: 'Section 1',
          column: 0,
          row: 0,
          fieldName: 'Last Saved By',
        }),
        AppTasks.dragLayoutTab({ tabName: 'Tab 2', index: 0 }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Verify the horizontal tabs are rearranged', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.tabByName('Tab 2'))
        .isLeftOf(ContentRecordTargets.tabByName('About'));
    });
  });
});
