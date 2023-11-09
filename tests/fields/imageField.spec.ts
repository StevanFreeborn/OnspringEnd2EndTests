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

  test('Create a copy of an Image Field on an app from the Fields & Objects report using the row copy button', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-107',
    });

    // Implement test
    expect(false).toBe(true);
  });

  test('Create a copy of an Image Field on an app from the Fields & Objects report using the Add Field button', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-832',
    });

    // Implement test
    expect(false).toBe(true);
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
