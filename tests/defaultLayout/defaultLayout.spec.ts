import { App } from '@stevanfreeborn/onspring-models';
import { AppTasks, ContentQuestions, ContentRecordTargets, ContentTasks } from '@stevanfreeborn/onspring-ui';
import { AppFixture, test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';

type DefaultLayoutTestFixtures = {
  app: App;
};

const test = base.extend<DefaultLayoutTestFixtures>({
  app: AppFixture.create().build(),
});

test.describe('default layout', () => {
  test.beforeEach(async ({ sysAdminActor, app }) => {
    await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id));
  });

  test('Update the default layout of an app', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-34',
    });

    await test.step('Update the default layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.dragFieldOntoLayout({
          tabName: 'Tab 2',
          sectionName: 'Section 1',
          column: 0,
          row: 0,
          fieldName: 'Record ID',
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Verify the default layout is updated', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      const section = await sysAdminActor.asks(
        ContentQuestions.section({ tabName: 'Tab 2', sectionName: 'Section 1' })
      );

      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.readOnlyTextFieldInSection(section, 'Record ID'))
        .isVisible();
    });
  });

  test('Update the number of columns for a default layout', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-868',
    });

    await test.step('Update the number of columns', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.updateLayoutSectionColumnCount({
          tabName: 'Tab 2',
          sectionName: 'Section 1',
          columnCount: 3,
        }),
        AppTasks.dragFieldOntoLayout({
          tabName: 'Tab 2',
          sectionName: 'Section 1',
          column: 0,
          row: 0,
          fieldName: 'Record Id',
        }),
        AppTasks.dragFieldOntoLayout({
          tabName: 'Tab 2',
          sectionName: 'Section 1',
          column: 1,
          row: 0,
          fieldName: 'Last Saved By',
        }),
        AppTasks.dragFieldOntoLayout({
          tabName: 'Tab 2',
          sectionName: 'Section 1',
          column: 2,
          row: 0,
          fieldName: 'Last User Save Date',
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Verify the number of columns is updated', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      const section = await sysAdminActor.asks(
        ContentQuestions.section({ tabName: 'Tab 2', sectionName: 'Section 1' })
      );

      const recordIdField = ContentRecordTargets.readOnlyTextFieldInSection(section, 'Record Id');
      const lastSavedByField = ContentRecordTargets.readOnlyTextFieldInSection(section, 'Last Saved By');
      const lastUserSaveDateField = ContentRecordTargets.readOnlyTextFieldInSection(section, 'Last User Save Date');

      await sysAdminActor.browse().check(recordIdField).isVisible();
      await sysAdminActor.browse().check(lastSavedByField).isVisible();
      await sysAdminActor.browse().check(lastUserSaveDateField).isVisible();

      await sysAdminActor.browse().check(lastSavedByField).isRightOf(recordIdField);
      await sysAdminActor.browse().check(lastUserSaveDateField).isRightOf(lastSavedByField);
    });
  });
});
