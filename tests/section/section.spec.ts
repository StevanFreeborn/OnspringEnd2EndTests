import { App } from '@stevanfreeborn/onspring-models';
import { AppTasks, ContentQuestions, ContentRecordTargets, ContentTasks } from '@stevanfreeborn/onspring-ui';
import { AppFixture, test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';

type SectionTestFixtures = {
  app: App;
};

const test = base.extend<SectionTestFixtures>({
  app: AppFixture.create().build(),
});

test.describe('section', () => {
  test.beforeEach(async ({ sysAdminActor, app }) => {
    await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id));
  });

  test("Add a section to an app's layout", async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-46',
    });

    const tabName = 'Tab 2';
    const sectionName = 'New Section';
    const fieldName = 'Record Id';

    await test.step('Add a new section to the app layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.addLayoutSection({ tabName, sectionName }),
        AppTasks.dragFieldOntoLayout({ tabName, sectionName, column: 0, row: 0, fieldName }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Verify the section is added successfully', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));

      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.readOnlyTextFieldInSection(section, fieldName))
        .isVisible();
    });
  });

  test("Update a section of an app's layout", async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-47',
    });

    const sectionName = 'Updated Section';

    await test.step('Update a section of the app layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.updateLayoutSectionName({
          tabName: 'Tab 2',
          sectionName: 'Section 1',
          newSectionName: sectionName,
        }),
        AppTasks.dragFieldOntoLayout({
          tabName: 'Tab 2',
          sectionName,
          column: 0,
          row: 0,
          fieldName: 'Record Id',
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Verify the section is updated successfully', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName: 'Tab 2', sectionName }));

      await sysAdminActor
        .browse()
        .check(ContentRecordTargets.readOnlyTextFieldInSection(section, 'Record Id'))
        .isVisible();
    });
  });

  test("Delete a section of an app's layout", async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-48',
    });

    await test.step('Delete a section of the app layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.deleteLayoutSection({ tabName: 'Tab 2', sectionName: 'Section 1' }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Verify the section is deleted successfully', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      await sysAdminActor.browse().check(ContentRecordTargets.tabByName('Tab 2')).isHidden();
    });
  });

  test("Add a standalone section to an app's layout", async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-49',
    });

    const sectionName = 'Standalone Section';

    await test.step('Add a standalone section to the app layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.dragFieldOntoLayout({
          tabName: 'Tab 2',
          sectionName: 'Section 1',
          column: 0,
          row: 0,
          fieldName: 'Record Id',
        }),
        AppTasks.addLayoutSection({ sectionName }),
        AppTasks.dragFieldOntoLayout({
          sectionName,
          column: 0,
          row: 0,
          fieldName: 'Last Saved By',
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Verify the standalone section is added successfully', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      const standAloneSection = ContentRecordTargets.sectionByHeading(sectionName);
      await sysAdminActor.browse().check(standAloneSection).isVisible();
      await sysAdminActor.browse().check(standAloneSection).isAbove(ContentRecordTargets.tabByName('Tab 2'));
    });
  });

  test("Update a standalone section of an app's layout", async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-50',
    });

    const sectionName = 'Standalone Section';
    const newSectionName = 'Updated Standalone Section';

    await test.step('Update a standalone section of the app layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.addLayoutSection({ sectionName }),
        AppTasks.saveAndCloseLayout(),
        AppTasks.openLayoutDesigner(),
        AppTasks.updateLayoutSectionName({ sectionName, newSectionName }),
        AppTasks.dragFieldOntoLayout({
          sectionName: newSectionName,
          column: 0,
          row: 0,
          fieldName: 'Record Id',
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Verify the standalone section is updated successfully', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      await sysAdminActor.browse().check(ContentRecordTargets.sectionByHeading(newSectionName)).isVisible();
    });
  });

  test("Delete a standalone section of an app's layout", async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-51',
    });

    const sectionName = 'Standalone Section';

    await test.step('Delete a standalone section of the app layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.dragFieldOntoLayout({
          tabName: 'Tab 2',
          sectionName: 'Section 1',
          column: 0,
          row: 0,
          fieldName: 'Record Id',
        }),
        AppTasks.addLayoutSection({ sectionName }),
        AppTasks.saveAndCloseLayout(),
        AppTasks.openLayoutDesigner(),
        AppTasks.deleteLayoutSection({ sectionName }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Verify the standalone section is deleted successfully', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      await sysAdminActor.browse().check(ContentRecordTargets.standaloneSectionContainer).isHidden();
    });
  });

  test('Rearrange the sections of an app’s layout', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-52',
    });

    const tabName = 'Tab 2';
    const sectionOneName = 'Section 1';
    const rearrangedSectionName = 'Rearranged Section';

    await test.step('Rearrange the sections of the app layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.dragFieldOntoLayout({
          tabName,
          sectionName: sectionOneName,
          column: 0,
          row: 0,
          fieldName: 'Record Id',
        }),
        AppTasks.addLayoutSection({ tabName, sectionName: rearrangedSectionName }),
        AppTasks.dragFieldOntoLayout({
          tabName,
          sectionName: rearrangedSectionName,
          column: 0,
          row: 0,
          fieldName: 'Last Saved By',
        }),
        AppTasks.dragLayoutSection({
          tabName,
          sectionName: sectionOneName,
          placementIndex: 0,
        }),
        AppTasks.saveAndCloseLayout()
      );
    });

    await test.step('Verify the sections are rearranged successfully', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      const sectionOne = ContentRecordTargets.sectionHeading(sectionOneName);
      const rearrangedSection = ContentRecordTargets.sectionHeading(rearrangedSectionName);

      await sysAdminActor.browse().check(sectionOne).isVisible();
      await sysAdminActor.browse().check(rearrangedSection).isVisible();
      await sysAdminActor.browse().check(sectionOne).isAbove(rearrangedSection);
    });
  });
});
