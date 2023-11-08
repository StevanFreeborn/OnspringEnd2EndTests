import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, fieldTest as test } from '../../fixtures';
import { ListValue } from '../../models/listField';
import { ListFormulaField } from '../../models/listFormulaField';
import { AnnotationType } from '../annotations';

test.describe('list formula field', () => {
  test.beforeEach(async ({ appAdminPage, app }) => {
    await appAdminPage.goto(app.id);
    await appAdminPage.layoutTabButton.click();
  });

  test('Add a List Formula Field to an app from the Fields & Objects report', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-166',
    });

    const listValues = [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })];

    const field = new ListFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      values: listValues,
      formula: `return [:${listValues[0].value}];`,
    });

    await test.step('Add the list formula field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Verify the field was added', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await expect(fieldRow).toBeVisible();
    });
  });

  test('Create a copy of a List Formula Field on an app from the Fields & Objects report using the row copy button', async ({
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-167',
    });

    const listValues = [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })];
    const field = new ListFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      values: listValues,
      formula: `return [:${listValues[0].value}];`,
    });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Add the the list formula field to be copied', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Add a copy of the list formula field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });

      await fieldRow.hover();
      await fieldRow.getByTitle('Copy').click();

      const addListFormulaFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Formula');

      await expect(addListFormulaFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);
      await addListFormulaFieldModal.saveButton.click();
    });

    await test.step('Verify the field was copied', async () => {
      await appAdminPage.page.waitForLoadState('networkidle');
      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedFieldName,
      });
      await expect(copiedFieldRow).toBeVisible();
    });
  });

  test('Create a copy of a List Formula Field on an app from the Fields & Objects report using the Add Field button', async ({
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-830',
    });

    const listValues = [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })];
    const field = new ListFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      values: listValues,
      formula: `return [:${listValues[0].value}];`,
    });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Add the list formula field to copy', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Add a copy of the list formula field', async () => {
      await appAdminPage.layoutTab.addFieldButton.click();
      await appAdminPage.layoutTab.addLayoutItemMenu.selectItem(field.type);
      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromRadioButton.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.selectDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getLayoutItemToCopy(field.name).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();

      const addListFormulaFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Formula');

      await expect(addListFormulaFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);

      await addListFormulaFieldModal.saveButton.click();
    });

    await test.step('Verify the field was copied', async () => {
      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedFieldName,
      });
      await expect(copiedFieldRow).toBeVisible();
    });
  });

  test('Add a List Formula Field to an app from a layout', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-168',
    });

    const listValues = [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })];
    const field = new ListFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      values: listValues,
      formula: `return [:${listValues[0].value}];`,
    });

    await test.step('Open layout designer for default layout', async () => {
      await appAdminPage.layoutTab.openLayout();
    });

    await test.step('Add the list formula field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(field);
    });

    await test.step('Verify the field was added', async () => {
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

  test('Create a copy of a List Formula Field on an app from a layout', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-169',
    });

    const listValues = [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })];
    const field = new ListFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      values: listValues,
      formula: `return [:${listValues[0].value}];`,
    });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Open layout designer for default layout', async () => {
      await appAdminPage.layoutTab.openLayout();
    });

    await test.step('Add the list formula field to copy', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(field);
    });

    await test.step('Add a copy of the list formula field', async () => {
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.fieldsTab.addFieldButton.click();
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.fieldsTab.addFieldMenu.selectItem('Formula');

      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromRadioButton.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.selectDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getLayoutItemToCopy(field.name).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();

      const addListFormulaFieldModal = appAdminPage.layoutTab.layoutDesignerModal.getLayoutItemModal('Formula', 1);

      await expect(addListFormulaFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);

      await addListFormulaFieldModal.saveButton.click();
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

  test("Add a List Formula Field to an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-170',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test("Remove a List Formula Field from an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-171',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Update the configuration of a List Formula Field on an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-173',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Delete a List Formula Field from an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-172',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Make a List Formula Field private by role to prevent access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-174',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Make a List Formula Field private by role to give access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-831',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });

  test('Make a List Formula Field public', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-175',
    });

    // TODO: implement test
    expect(false).toBe(true);
  });
});
