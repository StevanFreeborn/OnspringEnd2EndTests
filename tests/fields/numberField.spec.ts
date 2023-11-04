import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, fieldTest as test } from '../../fixtures';
import { NumberField } from '../../models/numberField';
import { AnnotationType } from '../annotations';

test.describe('number field', () => {
  test.beforeEach(async ({ appAdminPage, app }) => {
    await appAdminPage.goto(app.id);
    await appAdminPage.layoutTabButton.click();
  });

  test('Add a Number Field to an app from the Fields & Objects report', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-66',
    });

    const fieldName = FakeDataFactory.createFakeFieldName();

    await test.step('Add the number field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(new NumberField({ name: fieldName }));
    });

    await test.step('Verify the field was added', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: fieldName });
      await expect(fieldRow).toBeVisible();
    });
  });

  test('Create a copy of a Number Field on an app from the Fields & Objects report', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-67',
    });

    const fieldName = FakeDataFactory.createFakeFieldName();
    const copiedFieldName = `${fieldName} (1)`;

    await test.step('Add the the number field to be copied', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(new NumberField({ name: fieldName }));
    });

    await test.step('Add a copy of the number field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: fieldName });

      await fieldRow.hover();
      await fieldRow.getByTitle('Copy').click();

      const addNumberFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Number');

      await expect(addNumberFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);
      await addNumberFieldModal.saveButton.click();
    });

    await test.step('Verify the field was copied', async () => {
      await appAdminPage.page.waitForLoadState('networkidle');
      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedFieldName,
      });
      await expect(copiedFieldRow).toBeVisible();
    });
  });

  test('Add a Number Field to an app from a layout.', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-68',
    });

    const fieldName = FakeDataFactory.createFakeFieldName();

    await test.step('Open layout designer for default layout', async () => {
      await appAdminPage.layoutTab.openLayout();
    });

    await test.step('Add the number field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(new NumberField({ name: fieldName }));
    });

    await test.step('Verify the number was added', async () => {
      const field = appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.fieldsTab.getFieldFromBank(fieldName);

      await expect(field).toBeVisible();
      await expect(field).not.toHaveClass(/ui-draggable-disabled/);

      await appAdminPage.layoutTab.layoutDesignerModal.closeButton.click();

      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: fieldName });

      await expect(fieldRow).toBeVisible();
    });
  });

  test('Create a copy of a Number Field on an app from a layout', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-75',
    });

    const fieldName = FakeDataFactory.createFakeFieldName();
    const copiedFieldName = `${fieldName} (1)`;

    await test.step('Open layout designer for default layout', async () => {
      await appAdminPage.layoutTab.openLayout();
    });

    await test.step('Add the number field to copy', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(new NumberField({ name: fieldName }));
    });

    await test.step('Add a copy of the number field', async () => {
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.fieldsTab.addFieldButton.click();
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.fieldsTab.addFieldMenu.selectItem('Number');

      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromRadioButton.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.selectDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getLayoutItemToCopy(fieldName).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();

      const addNumberFieldModal = appAdminPage.layoutTab.layoutDesignerModal.getLayoutItemModal('Number', 1);

      await expect(addNumberFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);

      await addNumberFieldModal.saveButton.click();
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

  test("Add a Number Field to an app's layout", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-76',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test("Remove a Number Field from an app's layout", async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-77',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Update the configuration of a Number Field on an app', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-78',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Delete a Number Field from an app', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-79',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Number Field private by role to prevent access', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-101',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Number Field private by role to give access', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-811',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Number Field public', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-104',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });
});
