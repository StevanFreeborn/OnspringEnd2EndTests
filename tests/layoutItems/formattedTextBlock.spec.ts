import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { Locator, expect, layoutItemTest as test } from '../../fixtures';
import { FormattedTextBlock } from '../../models/formattedTextBlock';
import { LayoutItemPermission } from '../../models/layoutItem';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { EditContentPage } from '../../pageObjectModels/content/editContentPage';
import { ViewContentPage } from '../../pageObjectModels/content/viewContentPage';
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

      await addTextBlockModal.generalTab.nameInput.waitFor();
      await expect(addTextBlockModal.generalTab.nameInput).toHaveValue(copiedTextBlockName);
      await addTextBlockModal.save();
    });

    await test.step('Verify the text block was copied', async () => {
      const copiedTextBlockRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedTextBlockName,
      });

      await copiedTextBlockRow.waitFor();
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
      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getLayoutItemToCopy(textBlock.name).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();

      const addTextBlockModal = appAdminPage.layoutTab.getLayoutItemModal('Formatted Text Block');

      await addTextBlockModal.generalTab.nameInput.waitFor();
      await expect(addTextBlockModal.generalTab.nameInput).toHaveValue(copiedTextBlockName);

      await addTextBlockModal.save();
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

  test('Create a copy of a Formatted Text Block Object on an app from a layout', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-179',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'Do I Look Civilized To You?',
    });
    const copiedTextBlockName = `${textBlock.name} (1)`;

    await test.step('Open layout designer for default layout', async () => {
      await appAdminPage.layoutTab.openLayout();
    });

    await test.step('Add the formatted text block to copy', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(textBlock);
    });

    await test.step('Add a copy of the formatted text block', async () => {
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.objectsTab.addObjectButton.click();
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.objectsTab.addObjectMenu.selectItem(
        'Formatted Text Block'
      );

      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromRadioButton.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getLayoutItemToCopy(textBlock.name).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();

      const addTextBlockModal = appAdminPage.layoutTab.layoutDesignerModal.getLayoutItemModal(
        'Formatted Text Block',
        1
      );

      await addTextBlockModal.generalTab.nameInput.waitFor();
      await expect(addTextBlockModal.generalTab.nameInput).toHaveValue(copiedTextBlockName);

      await addTextBlockModal.save();
    });

    await test.step('Verify the text block was copied', async () => {
      const copiedTextBlock =
        appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.objectsTab.getObjectFromBank(copiedTextBlockName);

      await expect(copiedTextBlock).toBeVisible();
      await expect(copiedTextBlock).not.toHaveClass(/ui-draggable-disabled/);

      await appAdminPage.layoutTab.layoutDesignerModal.closeButton.click();

      const copiedTextBlockRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedTextBlockName,
      });

      await expect(copiedTextBlockRow).toBeVisible();
    });
  });

  test("Add a Formatted Text Block Object to an app's layout", async ({ appAdminPage, sysAdminPage, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-180',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'Do I Look Civilized To You?',
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Add the formatted text block that will be added to layout', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textBlock);
    });

    await test.step('Add the formatted text block to the layout', async () => {
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.objectsTabButton.click();

      const { object: textBlockInBank, dropzone } =
        await appAdminPage.layoutTab.layoutDesignerModal.dragObjectOnToLayout({
          tabName: tabName,
          sectionName: sectionName,
          sectionColumn: 0,
          sectionRow: 0,
          objectName: textBlock.name,
        });

      await expect(textBlockInBank).toHaveClass(/ui-draggable-disabled/);
      await expect(dropzone).toHaveText(new RegExp(textBlock.name));

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the text block was added to the layout', async () => {
      const addContentPage = new AddContentPage(sysAdminPage);
      await addContentPage.goto(app.id);

      const textBlockContent = await addContentPage.form.getObject({
        tabName: tabName,
        sectionName: sectionName,
        objectName: textBlock.name,
      });

      await expect(textBlockContent).toBeVisible();
      await expect(textBlockContent).toHaveText(new RegExp(textBlock.formattedText));
    });
  });

  test("Remove a Formatted Text Block Object from an app's layout", async ({ appAdminPage, sysAdminPage, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-181',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'Do I Look Civilized To You?',
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    let textBlockInBank: Locator;
    let textBlockLayoutDropzone: Locator;

    await test.step('Add the formatted text block that will be removed from layout', async () => {
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(textBlock);
      const { object: textBlockFromBank, dropzone } =
        await appAdminPage.layoutTab.layoutDesignerModal.dragObjectOnToLayout({
          tabName: tabName,
          sectionName: sectionName,
          sectionColumn: 0,
          sectionRow: 0,
          objectName: textBlock.name,
        });

      textBlockLayoutDropzone = dropzone;
      textBlockInBank = textBlockFromBank;

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Remove the text block from the layout', async () => {
      await appAdminPage.layoutTab.openLayout();
      await textBlockLayoutDropzone.hover();
      await textBlockLayoutDropzone.getByTitle('Remove Object from Layout').click();

      await expect(textBlockInBank).not.toHaveClass(/ui-draggable-disabled/);
      await expect(textBlockLayoutDropzone).not.toHaveText(new RegExp(textBlock.name));

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the text block was removed from the layout', async () => {
      const addContentPage = new AddContentPage(sysAdminPage);
      await addContentPage.goto(app.id);
      const textBlockContent = await addContentPage.form.getObject({
        tabName: tabName,
        sectionName: sectionName,
        objectName: textBlock.name,
      });

      await expect(textBlockContent).toBeHidden();
    });
  });

  test('Update the configuration of a Formatted Text Block Object on an app', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-182',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'Do I Look Civilized To You?',
    });
    const updatedTextBlockName = `${textBlock.name} updated`;

    await test.step('Add the formatted text block', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textBlock);
    });

    await test.step('Update the formatted text block', async () => {
      const textBlockRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: textBlock.name });
      await textBlockRow.hover();
      await textBlockRow.getByTitle('Edit').click();

      const editTextBlockModal = appAdminPage.layoutTab.getLayoutItemModal('Formatted Text Block');
      await editTextBlockModal.generalTab.nameInput.waitFor();
      await editTextBlockModal.generalTab.nameInput.fill(updatedTextBlockName);
      await editTextBlockModal.save();
    });

    await test.step('Verify the text block was updated', async () => {
      const updatedTextBlockRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: updatedTextBlockName,
      });
      await expect(updatedTextBlockRow).toBeVisible();
    });
  });

  test('Delete a Formatted Text Block Object from an app', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-183',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'Do I Look Civilized To You?',
    });

    await test.step('Add the formatted text block', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textBlock);
    });

    await test.step('Delete the formatted text block', async () => {
      const textBlockRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: textBlock.name });
      await textBlockRow.hover();
      await textBlockRow.getByTitle('Delete').click();

      const deleteResponse = appAdminPage.waitForLayoutItemDeleteResponse();
      await appAdminPage.layoutTab.deleteLayoutItemDialog.deleteButton.click();
      await deleteResponse;
    });

    await test.step('Verify the text block was deleted', async () => {
      const deletedTextBlockRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: textBlock.name,
      });

      await expect(deletedTextBlockRow).toBeHidden();
    });
  });

  test('Make a Formatted Text Block Object private by role to prevent access', async ({
    sysAdminPage,
    role,
    appAdminPage,
    app,
    testUserPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-184',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'This should not be visible to the test user',
      permissions: [new LayoutItemPermission({ roleName: role.name })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const addContentPage = new AddContentPage(sysAdminPage);
    const editContentPage = new EditContentPage(sysAdminPage);
    const viewContentPage = new ViewContentPage(testUserPage);
    let recordId: number;

    await test.step('Add the formatted text block', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textBlock);
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.objectsTabButton.click();
      await appAdminPage.layoutTab.layoutDesignerModal.dragObjectOnToLayout({
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        sectionColumn: 0,
        sectionRow: 0,
        objectName: textBlock.name,
      });
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Create a record with the formatted text block as system admin', async () => {
      await addContentPage.goto(app.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
      await editContentPage.page.waitForLoadState();
      recordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Navigate to created record as test user who does not have access to the text block by their role', async () => {
      await viewContentPage.goto(app.id, recordId);
    });

    await test.step('Verify the text block is not visible', async () => {
      const textBlockContent = await viewContentPage.form.getObject({
        tabName: tabName,
        sectionName: sectionName,
        objectName: textBlock.name,
      });
      await expect(textBlockContent).toBeHidden();
    });
  });

  test('Make a Formatted Text Block Object private by role to give access', async ({
    sysAdminPage,
    role,
    appAdminPage,
    app,
    testUserPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-857',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'This should be visible to the test user',
      permissions: [new LayoutItemPermission({ roleName: role.name, read: true })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const addContentPage = new AddContentPage(sysAdminPage);
    const editContentPage = new EditContentPage(sysAdminPage);
    const viewContentPage = new ViewContentPage(testUserPage);
    let recordId: number;

    await test.step('Add the formatted text block', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textBlock);
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.objectsTabButton.click();
      await appAdminPage.layoutTab.layoutDesignerModal.dragObjectOnToLayout({
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        sectionColumn: 0,
        sectionRow: 0,
        objectName: textBlock.name,
      });
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Create a record with the formatted text block as system admin', async () => {
      await addContentPage.goto(app.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
      await editContentPage.page.waitForLoadState();
      recordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Navigate to created record as test user who does have access to the text block by their role', async () => {
      await viewContentPage.goto(app.id, recordId);
    });

    await test.step('Verify the text block is visible', async () => {
      const textBlockContent = await viewContentPage.form.getObject({
        tabName: tabName,
        sectionName: sectionName,
        objectName: textBlock.name,
      });
      await expect(textBlockContent).toBeVisible();
      await expect(textBlockContent).toHaveText(new RegExp(textBlock.formattedText));
    });
  });

  test('Make a Formatted Text Block Object public', async ({ sysAdminPage, role, appAdminPage, app, testUserPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-185',
    });

    const textBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeTextBlockName(),
      formattedText: 'This should be visible to the test user',
      permissions: [new LayoutItemPermission({ roleName: role.name })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const addContentPage = new AddContentPage(sysAdminPage);
    const editContentPage = new EditContentPage(sysAdminPage);
    const viewContentPage = new ViewContentPage(testUserPage);
    let recordId: number;

    await test.step('Add the formatted text block', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(textBlock);
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.objectsTabButton.click();
      await appAdminPage.layoutTab.layoutDesignerModal.dragObjectOnToLayout({
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        sectionColumn: 0,
        sectionRow: 0,
        objectName: textBlock.name,
      });
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Create a record with the formatted text block as system admin', async () => {
      await addContentPage.goto(app.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
      await editContentPage.page.waitForLoadState();
      recordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Navigate to created record as test user who does not have access to the text block by their role', async () => {
      await viewContentPage.goto(app.id, recordId);
    });

    await test.step('Verify the text block is not visible', async () => {
      const textBlockContent = await viewContentPage.form.getObject({
        tabName: tabName,
        sectionName: sectionName,
        objectName: textBlock.name,
      });
      await expect(textBlockContent).toBeHidden();
    });

    await test.step('Update the text block so that it is public', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
      const textBlockRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: textBlock.name });
      await textBlockRow.hover();
      await textBlockRow.getByTitle('Edit').click();

      const editTextBlockModal = appAdminPage.layoutTab.getLayoutItemModal('Formatted Text Block');
      await editTextBlockModal.securityTabButton.waitFor();
      await editTextBlockModal.securityTabButton.click();
      await editTextBlockModal.securityTab.setPermissions([]);
      await editTextBlockModal.save();
    });

    await test.step('Navigate to created record again as test user', async () => {
      await viewContentPage.goto(app.id, recordId);
      await viewContentPage.page.reload();
    });

    await test.step('Verify the text block is visible', async () => {
      const textBlockContent = await viewContentPage.form.getObject({
        tabName: tabName,
        sectionName: sectionName,
        objectName: textBlock.name,
      });
      await expect(textBlockContent).toBeVisible();
      await expect(textBlockContent).toHaveText(new RegExp(textBlock.formattedText));
    });
  });
});
