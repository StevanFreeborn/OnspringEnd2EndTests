import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, fieldTest as test } from '../../fixtures';
import { AttachmentField } from '../../models/attachmentField';
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

  test('Add an Attachment Field to an app from a layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-90',
    });

    // TODO: Implement this test
    expect(false).toBe(true);
  });

  test('Create a copy of an Attachment Field on an app from a layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-91',
    });

    // TODO: Implement this test
    expect(false).toBe(true);
  });

  test("Add an Attachment Field to an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-92',
    });

    // TODO: Implement this test
    expect(false).toBe(true);
  });

  test("Remove an Attachment Field from an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-93',
    });

    // TODO: Implement this test
    expect(false).toBe(true);
  });

  test('Update the configuration of an Attachment Field on an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-94',
    });

    // TODO: Implement this test
    expect(false).toBe(true);
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
