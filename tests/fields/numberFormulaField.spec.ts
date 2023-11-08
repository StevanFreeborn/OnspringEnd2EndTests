import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, fieldTest as test } from '../../fixtures';
import { NumberFormulaField } from '../../models/numberFormulaField';
import { AnnotationType } from '../annotations';

test.describe('number formula field', () => {
  test.beforeEach(async ({ appAdminPage, app }) => {
    await appAdminPage.goto(app.id);
    await appAdminPage.layoutTabButton.click();
  });

  test('Add a Number Formula Field to an app from the Fields & Objects report', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-146',
    });

    const field = new NumberFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      formula: 'return 1',
    });

    await test.step('Add the number formula field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Verify the field was added', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await expect(fieldRow).toBeVisible();
    });
  });

  test('Create a copy of a Number Formula Field on an app from the Fields & Objects report using the row copy button', async ({
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-147',
    });

    const field = new NumberFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      formula: 'return 1',
    });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Add the the number formula field to be copied', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Add a copy of the number formula field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });

      await fieldRow.hover();
      await fieldRow.getByTitle('Copy').click();

      const addNumberFormulaFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Formula');

      await expect(addNumberFormulaFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);
      await addNumberFormulaFieldModal.saveButton.click();
    });

    await test.step('Verify the field was copied', async () => {
      await appAdminPage.page.waitForLoadState('networkidle');
      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedFieldName,
      });
      await expect(copiedFieldRow).toBeVisible();
    });
  });

  test('Create a copy of a Number Formula Field on an app from the Fields & Objects report using the Add Field button', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-822',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Add a Number Formula Field to an app from a layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-148',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Create a copy of a Number Formula Field on an app from a layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-149',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test("Add a Number Formula Field to an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-150',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test("Remove a Number Formula Field from an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-151',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Update the configuration of a Number Formula Field on an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-152',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Delete a Number Formula Field from an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-153',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Number Formula Field private by role to prevent access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-154',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Number Formula Field private by role to give access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-823',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Number Formula Field public', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-155',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });
});
