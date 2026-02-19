import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, layoutItemTest as test } from '../../fixtures';
import { SectionLabel } from '../../models/sectionLabel';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { AnnotationType } from '../annotations';

test.describe('section label object', () => {
  test('Add a section label object to an app', async ({ appAdminPage, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-872',
    });

    const sectionLabel = new SectionLabel({
      name: FakeDataFactory.createFakeSectionLabelName(),
    });

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Add the section label', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(sectionLabel);
    });

    await test.step('Verify the section label was added', async () => {
      const sectionLabelRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: sectionLabel.name });
      await expect(sectionLabelRow).toBeVisible();
    });
  });

  // NOTE: Currently broken: https://corp.onspring.com/Content/8/4940
  test.fail('Create a copy of a section label object', async ({ appAdminPage, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-873',
    });

    const sectionLabel = new SectionLabel({
      name: FakeDataFactory.createFakeSectionLabelName(),
    });
    const copiedSectionLabelName = `${sectionLabel.name} (1)`;

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Add the section label to be copied', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(sectionLabel);
    });

    await test.step('Add a copy of the section label', async () => {
      const sectionLabelRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: sectionLabel.name });

      await sectionLabelRow.hover();
      await sectionLabelRow.getByTitle('Copy').click();

      const addSectionLabelModal = appAdminPage.layoutTab.getLayoutItemModal('Section Label');

      await addSectionLabelModal.generalTab.nameInput.waitFor({ timeout: 1000 });
      await expect(addSectionLabelModal.generalTab.nameInput).toHaveValue(copiedSectionLabelName);
      await addSectionLabelModal.save();
    });

    await test.step('Verify the section label was copied', async () => {
      const copiedSectionLabelRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedSectionLabelName,
      });

      await copiedSectionLabelRow.waitFor();
      await expect(copiedSectionLabelRow).toBeVisible();
    });
  });

  test("Add a section label object to an app's layout", async ({ appAdminPage, sysAdminPage, app }) => {
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

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Add the section label that will be added to the layout', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(sectionLabel);
    });

    await test.step('Add the section label to the layout', async () => {
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.objectsTabButton.click();

      const { object: sectionLabelInBank, dropzone } =
        await appAdminPage.layoutTab.layoutDesignerModal.dragObjectOnToLayout({
          tabName: tabName,
          sectionName: sectionName,
          sectionColumn: 0,
          sectionRow: 0,
          objectName: sectionLabel.name,
        });

      await expect(sectionLabelInBank).toHaveClass(/ui-draggable-disabled/);
      await expect(dropzone).toHaveText(new RegExp(sectionLabel.name));

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the section label was added to the layout', async () => {
      const addContentPage = new AddContentPage(sysAdminPage);
      await addContentPage.goto(app.id);

      const sectionLabelContent = await addContentPage.form.getObject({
        tabName: tabName,
        sectionName: sectionName,
        objectName: sectionLabel.name,
      });

      await expect(sectionLabelContent).toBeVisible();
      await expect(sectionLabelContent).toHaveText(new RegExp(sectionLabel.text));
    });
  });

  test('Update the configuration of a Section Label Object in an app', async ({ appAdminPage, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-875',
    });

    const sectionLabel = new SectionLabel({
      name: FakeDataFactory.createFakeSectionLabelName(),
      text: 'Section Label',
    });
    const updatedSectionLabelName = `${sectionLabel.name} updated`;

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
    });

    await test.step('Add the section label', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(sectionLabel);
    });

    await test.step('Update the section label', async () => {
      const sectionLabelRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: sectionLabel.name });
      await sectionLabelRow.hover();
      await sectionLabelRow.getByTitle('Edit').click();

      const editSectionLabelModal = appAdminPage.layoutTab.getLayoutItemModal('Section Label');
      await editSectionLabelModal.generalTab.nameInput.waitFor();
      await editSectionLabelModal.generalTab.nameInput.fill(updatedSectionLabelName);
      await editSectionLabelModal.save();
    });

    await test.step('Verify the section label was updated', async () => {
      const updatedSectionLabelRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: updatedSectionLabelName,
      });
      await expect(updatedSectionLabelRow).toBeVisible();
    });
  });

  test('Delete a Section Label Object from an app', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-876',
    });

    expect(true).toBeTruthy();
  });
});
