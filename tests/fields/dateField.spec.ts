import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, fieldTest as test } from '../../fixtures';
import { DateField } from '../../models/dateField';
import { AnnotationType } from '../annotations';

test.describe('date/time field', () => {
  test.beforeEach(async ({ appAdminPage, app }) => {
    await appAdminPage.goto(app.id);
    await appAdminPage.layoutTabButton.click();
  });

  test('Add a Date/Time Field to an app from the Fields & Objects report', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-56',
    });

    const field = new DateField({ name: FakeDataFactory.createFakeFieldName() });

    await test.step('Add the date/time field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Verify the field was added', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await expect(fieldRow).toBeVisible();
    });
  });

  test('Create a copy of a Date/Time Field on an app from the Fields & Objects report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-57',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Add a Date/Time Field to an app from a layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-58',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Create a copy of a Date/Time Field on an app from a layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-59',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test("Add a Date/Time Field to an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-64',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test("Remove a Date/Time Field from an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-69',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Delete a Date/Time Field from an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-70',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Update the configuration of a Date/Time Field on an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-73',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Date/Time Field private by role to prevent access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-98',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Date/Time Field private by role to give access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-812',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Date/Time Field public', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-102',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });
});
