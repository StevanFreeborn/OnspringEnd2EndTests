import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, fieldTest as test } from '../../fixtures';
import { ImageField } from '../../models/imageField';
import { AnnotationType } from '../annotations';

test.describe('image field', () => {
  test.beforeEach(async ({ appAdminPage, app }) => {
    await appAdminPage.goto(app.id);
    await appAdminPage.layoutTabButton.click();
  });

  test('Add an Image Field to an app from the Fields & Objects report', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-106',
    });

    const field = new ImageField({ name: FakeDataFactory.createFakeFieldName() });

    await test.step('Add the image field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Verify the field was added', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await expect(fieldRow).toBeVisible();
    });
  });

  test('Create a copy of an Image Field on an app from the Fields & Objects report using the row copy button', async ({
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-107',
    });

    const field = new ImageField({ name: FakeDataFactory.createFakeFieldName() });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Add the the image field to be copied', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Add a copy of the image field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await fieldRow.hover();
      await fieldRow.getByTitle('Copy').click();

      const addImageFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Image');
      await expect(addImageFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);
      await addImageFieldModal.saveButton.click();
    });

    await test.step('Verify the field was copied', async () => {
      await appAdminPage.page.waitForLoadState('networkidle');
      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedFieldName,
      });
      await expect(copiedFieldRow).toBeVisible();
    });
  });

  test('Create a copy of an Image Field on an app from the Fields & Objects report using the Add Field button', async ({
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-832',
    });

    const field = new ImageField({ name: FakeDataFactory.createFakeFieldName() });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Add the image field to copy', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Add a copy of the image field', async () => {
      await appAdminPage.layoutTab.addFieldButton.click();
      await appAdminPage.layoutTab.addLayoutItemMenu.selectItem(field.type);
      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromRadioButton.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.selectDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getLayoutItemToCopy(field.name).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();

      const addImageFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Image');

      await expect(addImageFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);

      await addImageFieldModal.saveButton.click();
    });

    await test.step('Verify the field was copied', async () => {
      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedFieldName,
      });
      await expect(copiedFieldRow).toBeVisible();
    });
  });

  test('Add an Image Field to an app from a layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-108',
    });

    // Implement test
    expect(false).toBe(true);
  });

  test('Create a copy of an Image Field on an app from a layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-109',
    });

    // Implement test
    expect(false).toBe(true);
  });

  test("Add an Image Field to an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-110',
    });

    // Implement test
    expect(false).toBe(true);
  });

  test("Remove an Image Field from an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-111',
    });

    // Implement test
    expect(false).toBe(true);
  });

  test('Update the configuration of an Image Field on an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-112',
    });

    // Implement test
    expect(false).toBe(true);
  });

  test('Delete an Image Field from an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-113',
    });

    // Implement test
    expect(false).toBe(true);
  });

  test('Make an Image Field private by role to prevent access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-114',
    });

    // Implement test
    expect(false).toBe(true);
  });

  test('Make an Image Field private by role to give access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-833',
    });

    // Implement test
    expect(false).toBe(true);
  });

  test('Make an Image Field public', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-115',
    });

    // Implement test
    expect(false).toBe(true);
  });
});
