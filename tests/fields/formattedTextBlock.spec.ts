import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { expect, layoutItemTest as test } from '../../fixtures';
import { FormattedTextBlock } from '../../models/formattedTextBlock';
import { AnnotationType } from '../annotations';

test.describe('formatted text block', () => {
  test.beforeEach(async ({ appAdminPage, app }) => {
    await appAdminPage.goto(app.id);
    await appAdminPage.layoutTabButton.click();
  });

  test('Add a Formatted Text Block Object to an app from the Fields & Objects report', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-176',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'Hello World!',
    });

    await test.step('Add the formatted text block field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textBlock);
    });

    await test.step('Verify the formatted text block was added', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: textBlock.name });
      await expect(fieldRow).toBeVisible();
    });
  });

  test('Create a copy of a Formatted Text Block Object on an app from the Fields & Objects report using the row copy button', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-177',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Create a copy of a Formatted Text Block Object on an app from the Fields & Objects report using the Add Field button', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-856',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Add a Formatted Text Block Object to an app from a layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-178',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Create a copy of a Formatted Text Block Object on an app from a layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-179',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test("Add a Formatted Text Block Object to an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-180',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test("Remove a Formatted Text Block Object from an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-181',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Update the configuration of a Formatted Text Block Object on an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-182',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Delete a Formatted Text Block Object from an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-183',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Formatted Text Block Object private by role to prevent access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-184',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Formatted Text Block Object private by role to give access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-857',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Formatted Text Block Object public', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-185',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });
});
