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
      formattedText: 'Do I Look Civilized To You?',
    });

    await test.step('Add the formatted text block', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textBlock);
    });

    await test.step('Verify the formatted text block was added', async () => {
      const textBlockRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: textBlock.name });
      await expect(textBlockRow).toBeVisible();
    });
  });

  test('Create a copy of a Formatted Text Block Object on an app from the Fields & Objects report using the row copy button', async ({
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-177',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'Do I Look Civilized To You?',
    });
    const copiedTextBlockName = `${textBlock.name} (1)`;

    await test.step('Add the the formatted text block to be copied', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textBlock);
    });

    await test.step('Add a copy of the formatted text block', async () => {
      const textBlockRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: textBlock.name });

      await textBlockRow.hover();
      await textBlockRow.getByTitle('Copy').click();

      const addTextBlockModal = appAdminPage.layoutTab.getLayoutItemModal('Formatted Text Block');

      await expect(addTextBlockModal.generalTab.nameInput).toHaveValue(copiedTextBlockName);
      await addTextBlockModal.saveButton.click();
    });

    await test.step('Verify the text block was copied', async () => {
      await appAdminPage.page.waitForLoadState('networkidle');
      const copiedTextBlockRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedTextBlockName,
      });
      await expect(copiedTextBlockRow).toBeVisible();
    });
  });

  test('Create a copy of a Formatted Text Block Object on an app from the Fields & Objects report using the Add Field button', async ({
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-856',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'Do I Look Civilized To You?',
    });
    const copiedTextBlockName = `${textBlock.name} (1)`;

    await test.step('Add the formatted text block to copy', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textBlock);
    });

    await test.step('Add a copy of the formatted text block', async () => {
      await appAdminPage.layoutTab.addFieldButton.click();
      await appAdminPage.layoutTab.addLayoutItemMenu.selectItem(textBlock.type);
      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromRadioButton.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.selectDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getLayoutItemToCopy(textBlock.name).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();

      const addTextBlockModal = appAdminPage.layoutTab.getLayoutItemModal('Formatted Text Block');

      await expect(addTextBlockModal.generalTab.nameInput).toHaveValue(copiedTextBlockName);

      await addTextBlockModal.saveButton.click();
    });

    await test.step('Verify the text block was copied', async () => {
      const copiedTextBlockRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedTextBlockName,
      });
      await expect(copiedTextBlockRow).toBeVisible();
    });
  });

  test('Add a Formatted Text Block Object to an app from a layout', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-178',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'Do I Look Civilized To You?',
    });

    await test.step('Open layout designer for default layout', async () => {
      await appAdminPage.layoutTab.openLayout();
    });

    await test.step('Add the formatted text block', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(textBlock);
    });

    await test.step('Verify the text block was added', async () => {
      const textBlockInBank =
        appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.objectsTab.getObjectFromBank(textBlock.name);

      await expect(textBlockInBank).toBeVisible();
      await expect(textBlockInBank).not.toHaveClass(/ui-draggable-disabled/);

      await appAdminPage.layoutTab.layoutDesignerModal.closeButton.click();

      const textBlockRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: textBlock.name });

      await expect(textBlockRow).toBeVisible();
    });
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
