import { App, FakeDataFactory, SectionLabel } from '@stevanfreeborn/onspring-models';
import {
  AppLayoutTabTargets,
  AppQuestions,
  AppTasks,
  ContentQuestions,
  ContentRecordTargets,
  ContentTasks,
  FieldTargets,
  LayoutObjectTasks,
} from '@stevanfreeborn/onspring-ui';
import { AppFixture, test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';

type SectionLabelTestFixtures = {
  app: App;
};

const test = base.extend<SectionLabelTestFixtures>({
  app: AppFixture.create().build(),
});

test.describe('section label object', () => {
  test.beforeEach(async ({ sysAdminActor, app }) => {
    await sysAdminActor.attemptsTo(AppTasks.gotoAppLayoutTab(app.id));
  });

  test('Add a section label object to an app', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-872',
    });

    const sectionLabel = new SectionLabel({
      name: FakeDataFactory.createFakeSectionLabelName(),
    });

    await test.step('Add the section label', async () => {
      await sysAdminActor.attemptsTo(LayoutObjectTasks.addFromGrid(sectionLabel));
    });

    await test.step('Verify the section label was added', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(sectionLabel.name)).isVisible();
    });
  });

  // NOTE: Currently broken: https://corp.onspring.com/Content/8/4940
  test.fail('Create a copy of a section label object', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-873',
    });

    const sectionLabel = new SectionLabel({
      name: FakeDataFactory.createFakeSectionLabelName(),
    });
    const copiedSectionLabelName = `${sectionLabel.name} (1)`;

    await test.step('Add the section label to be copied', async () => {
      await sysAdminActor.attemptsTo(LayoutObjectTasks.addFromGrid(sectionLabel));
    });

    await test.step('Add a copy of the section label', async () => {
      await sysAdminActor.attemptsTo(
        LayoutObjectTasks.copyFromGridRow(sectionLabel.name, copiedSectionLabelName, { timeout: 1000 })
      );
    });

    await test.step('Verify the section label was copied', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(copiedSectionLabelName)).isVisible();
    });
  });

  test("Add a section label object to an app's layout", async ({ sysAdminActor, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-874',
    });

    const sectionLabel = new SectionLabel({
      name: FakeDataFactory.createFakeSectionLabelName(),
      text: 'Section Label',
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Add the section label that will be added to the layout', async () => {
      await sysAdminActor.attemptsTo(LayoutObjectTasks.addFromGrid(sectionLabel));
    });

    await test.step('Add the section label to the layout', async () => {
      await sysAdminActor.attemptsTo(
        AppTasks.openLayoutDesigner(),
        AppTasks.dragObjectOntoLayout({
          tabName,
          sectionName,
          column: 0,
          row: 0,
          objectName: sectionLabel.name,
        })
      );

      const dropzone = await sysAdminActor.asks(
        AppQuestions.layoutDropzone({ tabName, sectionName, column: 0, row: 0 })
      );
      await sysAdminActor
        .browse()
        .check(AppLayoutTabTargets.designer.objectFromBank(sectionLabel.name))
        .hasClass(/ui-draggable-disabled/);
      await sysAdminActor.browse().check(dropzone).hasText(new RegExp(sectionLabel.name));

      await sysAdminActor.attemptsTo(AppTasks.saveAndCloseLayout());
    });

    await test.step('Verify the section label was added to the layout', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id));
      const section = await sysAdminActor.asks(ContentQuestions.section({ tabName, sectionName }));
      const sectionLabelContent = ContentRecordTargets.objectInSection(section, sectionLabel.name);

      await sysAdminActor.browse().check(sectionLabelContent).isVisible();
      await sysAdminActor.browse().check(sectionLabelContent).hasText(new RegExp(sectionLabel.text));
    });
  });

  test('Update the configuration of a Section Label Object in an app', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-875',
    });

    const sectionLabel = new SectionLabel({
      name: FakeDataFactory.createFakeSectionLabelName(),
      text: 'Section Label',
    });
    const updatedSectionLabelName = `${sectionLabel.name} updated`;

    await test.step('Add the section label', async () => {
      await sysAdminActor.attemptsTo(LayoutObjectTasks.addFromGrid(sectionLabel));
    });

    await test.step('Update the section label', async () => {
      await sysAdminActor.attemptsTo(LayoutObjectTasks.updateNameFromGrid(sectionLabel.name, updatedSectionLabelName));
    });

    await test.step('Verify the section label was updated', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(updatedSectionLabelName)).isVisible();
    });
  });

  test('Delete a Section Label Object from an app', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-876',
    });

    const sectionLabel = new SectionLabel({
      name: FakeDataFactory.createFakeSectionLabelName(),
    });

    await test.step('Add the section label', async () => {
      await sysAdminActor.attemptsTo(LayoutObjectTasks.addFromGrid(sectionLabel));
    });

    await test.step('Delete the section label', async () => {
      await sysAdminActor.attemptsTo(LayoutObjectTasks.deleteFromGrid(sectionLabel.name));
    });

    await test.step('Verify the section label was deleted', async () => {
      await sysAdminActor.browse().check(FieldTargets.rowByName(sectionLabel.name)).isHidden();
    });
  });
});
