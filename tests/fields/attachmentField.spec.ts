import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { Locator, expect, fieldTest as test } from '../../fixtures';
import { AttachmentField } from '../../models/attachmentField';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { AnnotationType } from '../annotations';

test.describe('attachment field', () => {
  test.beforeEach(async ({ appAdminPage, app }) => {
    await appAdminPage.goto(app.id);
    await appAdminPage.layoutTabButton.click();
  });

  test('Add an Attachment Field to an app from the Fields & Objects report', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-88',
    });

    const field = new AttachmentField({ name: FakeDataFactory.createFakeFieldName() });

    await test.step('Add the attachment field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Verify the field was added', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await expect(fieldRow).toBeVisible();
    });
  });

  test('Create a copy of an Attachment Field on an app from the Fields & Objects report using the row copy button', async ({
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-89',
    });

    const field = new AttachmentField({ name: FakeDataFactory.createFakeFieldName() });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Add the the attachment field to be copied', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Add a copy of the attachment field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await fieldRow.hover();
      await fieldRow.getByTitle('Copy').click();

      const addAttachmentFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Attachment');
      await expect(addAttachmentFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);
      await addAttachmentFieldModal.saveButton.click();
    });

    await test.step('Verify the field was copied', async () => {
      await appAdminPage.page.waitForLoadState('networkidle');
      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedFieldName,
      });
      await expect(copiedFieldRow).toBeVisible();
    });
  });

  test('Create a copy of an Attachment Field on an app from the Fields & Objects report using the Add Field button', async ({
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-852',
    });

    const field = new AttachmentField({ name: FakeDataFactory.createFakeFieldName() });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Add the attachment field to copy', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Add a copy of the attachment field', async () => {
      await appAdminPage.layoutTab.addFieldButton.click();
      await appAdminPage.layoutTab.addLayoutItemMenu.selectItem(field.type);
      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromRadioButton.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.selectDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getLayoutItemToCopy(field.name).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();

      const addAttachmentFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Attachment');

      await expect(addAttachmentFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);

      await addAttachmentFieldModal.saveButton.click();
    });

    await test.step('Verify the field was copied', async () => {
      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedFieldName,
      });
      await expect(copiedFieldRow).toBeVisible();
    });
  });

  test('Add an Attachment Field to an app from a layout', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-90',
    });

    const field = new AttachmentField({ name: FakeDataFactory.createFakeFieldName() });

    await test.step('Open layout designer for default layout', async () => {
      await appAdminPage.layoutTab.openLayout();
    });

    await test.step('Add the attachment field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(field);
    });

    await test.step('Verify the attachment field was added', async () => {
      const fieldInBank = appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.fieldsTab.getFieldFromBank(
        field.name
      );

      await expect(fieldInBank).toBeVisible();
      await expect(fieldInBank).not.toHaveClass(/ui-draggable-disabled/);

      await appAdminPage.layoutTab.layoutDesignerModal.closeButton.click();

      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });

      await expect(fieldRow).toBeVisible();
    });
  });

  test('Create a copy of an Attachment Field on an app from a layout', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-91',
    });

    const field = new AttachmentField({ name: FakeDataFactory.createFakeFieldName() });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Open layout designer for default layout', async () => {
      await appAdminPage.layoutTab.openLayout();
    });

    await test.step('Add the attachment field to copy', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(field);
    });

    await test.step('Add a copy of the attachment field', async () => {
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.fieldsTab.addFieldButton.click();
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.fieldsTab.addFieldMenu.selectItem(
        'Attachment'
      );

      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromRadioButton.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.selectDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getLayoutItemToCopy(field.name).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();

      const addAttachmentFieldModal = appAdminPage.layoutTab.layoutDesignerModal.getLayoutItemModal('Attachment', 1);

      await expect(addAttachmentFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);

      await addAttachmentFieldModal.saveButton.click();
    });

    await test.step('Verify the field was copied', async () => {
      const copiedField =
        appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.fieldsTab.getFieldFromBank(copiedFieldName);

      await expect(copiedField).toBeVisible();
      await expect(copiedField).not.toHaveClass(/ui-draggable-disabled/);

      await appAdminPage.layoutTab.layoutDesignerModal.closeButton.click();

      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedFieldName,
      });

      await expect(copiedFieldRow).toBeVisible();
    });
  });

  test("Add an Attachment Field to an app's layout", async ({ sysAdminPage, appAdminPage, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-92',
    });

    const field = new AttachmentField({ name: FakeDataFactory.createFakeFieldName() });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Add the attachment field that will be added to layout', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Add the attachment field to the layout', async () => {
      await appAdminPage.layoutTab.openLayout();

      const { field: fieldInBank, dropzone } = await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: tabName,
        sectionName: sectionName,
        sectionColumn: 0,
        sectionRow: 0,
        fieldName: field.name,
      });

      await expect(fieldInBank).toHaveClass(/ui-draggable-disabled/);
      await expect(dropzone).toHaveText(new RegExp(field.name));

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the field was added to the layout', async () => {
      const addContentPage = new AddContentPage(sysAdminPage);
      await addContentPage.goto(app.id);

      const attachmentField = await addContentPage.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Attachment',
      });

      await expect(attachmentField.control).toBeVisible();
    });
  });

  test("Remove an Attachment Field from an app's layout", async ({ sysAdminPage, appAdminPage, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-93',
    });

    const field = new AttachmentField({ name: FakeDataFactory.createFakeFieldName() });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    let fieldInBank: Locator;
    let fieldLayoutDropzone: Locator;

    await test.step('Add the attachment field that will be removed from layout', async () => {
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(field);
      const { field: fieldFromBank, dropzone } = await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: tabName,
        sectionName: sectionName,
        sectionColumn: 0,
        sectionRow: 0,
        fieldName: field.name,
      });

      fieldLayoutDropzone = dropzone;
      fieldInBank = fieldFromBank;

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Remove the attachment field from the layout', async () => {
      await appAdminPage.layoutTab.openLayout();
      await fieldLayoutDropzone.hover();
      await fieldLayoutDropzone.getByTitle('Remove Field from Layout').click();

      await expect(fieldInBank).not.toHaveClass(/ui-draggable-disabled/);
      await expect(fieldLayoutDropzone).not.toHaveText(new RegExp(field.name));

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the field was removed from the layout', async () => {
      const addContentPage = new AddContentPage(sysAdminPage);
      await addContentPage.goto(app.id);
      const attachmentField = await addContentPage.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Attachment',
      });

      await expect(attachmentField.control).toBeHidden();
    });
  });

  test('Update the configuration of an Attachment Field on an app', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-94',
    });

    const field = new AttachmentField({ name: FakeDataFactory.createFakeFieldName() });
    const updatedFieldName = `${field.name} updated`;

    await test.step('Add the attachment field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Update the attachment field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await fieldRow.hover();
      await fieldRow.getByTitle('Edit').click();

      const editAttachmentFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Attachment');
      await editAttachmentFieldModal.generalTab.fieldInput.fill(updatedFieldName);
      await editAttachmentFieldModal.saveButton.click();
    });

    await test.step('Verify the field was updated', async () => {
      const updatedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: updatedFieldName,
      });
      await expect(updatedFieldRow).toBeVisible();
    });
  });

  test('Delete an Attachment Field from an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-95',
    });

    // TODO: Implement this test
    expect(false).toBe(true);
  });

  test('Make an Attachment Field private by role to prevent access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-96',
    });

    // TODO: Implement this test
    expect(false).toBe(true);
  });

  test('Make an Attachment Field private by role to give access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-853',
    });

    // TODO: Implement this test
    expect(false).toBe(true);
  });

  test('Make an Attachment Field public', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-97',
    });

    // TODO: Implement this test
    expect(false).toBe(true);
  });
});
