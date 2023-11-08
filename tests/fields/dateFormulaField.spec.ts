import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, fieldTest as test } from '../../fixtures';
import { DateFormulaField } from '../../models/dateFormulaField';
import { AnnotationType } from '../annotations';

test.describe('date formula field', () => {
  test.beforeEach(async ({ appAdminPage, app }) => {
    await appAdminPage.goto(app.id);
    await appAdminPage.layoutTabButton.click();
  });

  test('Add a Date/Time Formula Field to an app from the Fields & Objects report', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-156',
    });

    const field = new DateFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      formula: 'return new Date();',
    });

    await test.step('Add the date formula field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Verify the field was added', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await expect(fieldRow).toBeVisible();
    });
  });

  test('Create a copy of a Date/Time Formula Field on an app from the Fields & Objects report using the row copy button', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-157',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Create a copy of a Date/Time Formula Field on an app from the Fields & Objects report using the Add Field button', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-824',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Add a Date/Time Formula Field to an app from a layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-158',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Create a copy of a Date/Time Formula Field on an app from a layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-159',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test("Add a Date/Time Formula Field to an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-160',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test("Remove a Date/Time Formula Field from an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-161',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Delete a Date/Time Formula Field from an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-162',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Update the configuration of a Date/Time Formula Field on an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-163',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Date/Time Formula Field private by role to prevent access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-164',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Date/Time Formula Field private by role to give access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-825',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Date/Time Formula Field public', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-165',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });
});
