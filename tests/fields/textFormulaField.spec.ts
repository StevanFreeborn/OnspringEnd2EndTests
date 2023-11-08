import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { Locator, expect, fieldTest as test } from '../../fixtures';
import { LayoutItemPermission } from '../../models/layoutItem';
import { TextFormulaField } from '../../models/textFormulaField';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { EditContentPage } from '../../pageObjectModels/content/editContentPage';
import { ViewContentPage } from '../../pageObjectModels/content/viewContentPage';
import { AnnotationType } from '../annotations';

test.describe('text formula field', () => {
  test.beforeEach(async ({ appAdminPage, app }) => {
    await appAdminPage.goto(app.id);
    await appAdminPage.layoutTabButton.click();
  });

  test('Add a Text Formula Field to an app from the Fields & Objects report', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-136',
    });

    const field = new TextFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      formula: 'return "Hello World";',
    });

    await test.step('Add the text formula field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Verify the field was added', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await expect(fieldRow).toBeVisible();
    });
  });

  test('Create a copy of a Text Formula Field on an app from the Fields & Objects report using the row copy button', async ({
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-137',
    });

    const field = new TextFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      formula: 'return "Hello World";',
    });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Add the the text formula field to be copied', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Add a copy of the text formula field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });

      await fieldRow.hover();
      await fieldRow.getByTitle('Copy').click();

      const addTextFormulaFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Formula');

      await expect(addTextFormulaFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);
      await addTextFormulaFieldModal.saveButton.click();
    });

    await test.step('Verify the field was copied', async () => {
      await appAdminPage.page.waitForLoadState('networkidle');
      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedFieldName,
      });
      await expect(copiedFieldRow).toBeVisible();
    });
  });

  test('Create a copy of a Text Formula Field on an app from the Fields & Objects report using the Add Field button', async ({
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-820',
    });

    const field = new TextFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      formula: 'return "Hello World";',
    });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Add the text formula field to copy', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Add a copy of the text formula field', async () => {
      await appAdminPage.layoutTab.addFieldButton.click();
      await appAdminPage.layoutTab.addLayoutItemMenu.selectItem(field.type);
      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromRadioButton.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.selectDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getLayoutItemToCopy(field.name).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();

      const addTextFormulaFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Formula');

      await expect(addTextFormulaFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);

      await addTextFormulaFieldModal.saveButton.click();
    });

    await test.step('Verify the field was copied', async () => {
      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedFieldName,
      });
      await expect(copiedFieldRow).toBeVisible();
    });
  });

  test('Add a Text Formula Field to an app from a layout', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-138',
    });

    const field = new TextFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      formula: 'return "Hello World";',
    });

    await test.step('Open layout designer for default layout', async () => {
      await appAdminPage.layoutTab.openLayout();
    });

    await test.step('Add the text formula field', async () => {
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

  test('Create a copy of a Text Formula Field on an app from a layout', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-139',
    });

    const field = new TextFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      formula: 'return "Hello World";',
    });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Open layout designer for default layout', async () => {
      await appAdminPage.layoutTab.openLayout();
    });

    await test.step('Add the text formula field to copy', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(field);
    });

    await test.step('Add a copy of the text formula field', async () => {
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.fieldsTab.addFieldButton.click();
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.fieldsTab.addFieldMenu.selectItem('Formula');

      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromRadioButton.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.selectDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getLayoutItemToCopy(field.name).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();

      const addTextFormulaFieldModal = appAdminPage.layoutTab.layoutDesignerModal.getLayoutItemModal('Formula', 1);

      await expect(addTextFormulaFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);

      await addTextFormulaFieldModal.saveButton.click();
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

  test("Add a Text Formula Field to an app's layout", async ({ sysAdminPage, appAdminPage, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-140',
    });

    const field = new TextFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      formula: 'return "Hello World";',
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Add the text formula field that will be added to layout', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Add the text formula field to the layout', async () => {
      await appAdminPage.layoutTab.openLayout();

      const { field: fieldInBank, dropzone } = await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: tabName,
        sectionName: sectionName,
        sectionColumn: 0,
        sectionRow: 0,
        fieldName: field.name,
      });

      await expect(fieldInBank).toHaveClass(/ui-draggable-disabled/);
      await expect(dropzone).toHaveText(new RegExp(field.name));

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the field was added to the layout', async () => {
      const addContentPage = new AddContentPage(sysAdminPage);
      await addContentPage.goto(app.id);

      const contentField = await addContentPage.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Formula',
      });

      await expect(contentField).toBeVisible();
    });
  });

  test("Remove a Text Formula Field from an app's layout", async ({ sysAdminPage, appAdminPage, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-141',
    });

    const field = new TextFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      formula: 'return "Hello World";',
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    let fieldInBank: Locator;
    let fieldLayoutDropzone: Locator;

    await test.step('Add the text formula field that will be removed from layout', async () => {
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(field);
      const { field: fieldFromBank, dropzone } = await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: tabName,
        sectionName: sectionName,
        sectionColumn: 0,
        sectionRow: 0,
        fieldName: field.name,
      });

      fieldLayoutDropzone = dropzone;
      fieldInBank = fieldFromBank;

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Remove the text formula field from the layout', async () => {
      await appAdminPage.layoutTab.openLayout();
      await fieldLayoutDropzone.hover();
      await fieldLayoutDropzone.getByTitle('Remove Field from Layout').click();

      await expect(fieldInBank).not.toHaveClass(/ui-draggable-disabled/);
      await expect(fieldLayoutDropzone).not.toHaveText(new RegExp(field.name));

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the field was removed from the layout', async () => {
      const addContentPage = new AddContentPage(sysAdminPage);
      await addContentPage.goto(app.id);
      const contentField = await addContentPage.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Formula',
      });

      await expect(contentField).toBeHidden();
    });
  });

  test('Update the configuration of a Text Formula Field on an app', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-142',
    });

    const field = new TextFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      formula: 'return "Hello World";',
    });
    const updatedFieldName = `${field.name} updated`;

    await test.step('Add the text formula field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Update the text formula field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await fieldRow.hover();
      await fieldRow.getByTitle('Edit').click();

      const editTextFormulaFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Formula');
      await editTextFormulaFieldModal.generalTab.fieldInput.fill(updatedFieldName);
      await editTextFormulaFieldModal.saveButton.click();
    });

    await test.step('Verify the field was updated', async () => {
      const updatedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: updatedFieldName,
      });
      await expect(updatedFieldRow).toBeVisible();
    });
  });

  test('Delete a Text Formula Field from an app', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-143',
    });

    const field = new TextFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      formula: 'return "Hello World";',
    });

    await test.step('Add the text formula field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Delete the text formula field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await fieldRow.hover();
      await fieldRow.getByTitle('Delete').click();

      await appAdminPage.layoutTab.deleteLayoutItemDialog.deleteButton.click();
      await appAdminPage.page.waitForLoadState('networkidle');
    });

    await test.step('Verify the field was deleted', async () => {
      const deletedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: field.name,
      });

      await expect(deletedFieldRow).toBeHidden();
    });
  });

  test('Make a Text Formula Field private by role to prevent access', async ({
    sysAdminPage,
    role,
    appAdminPage,
    app,
    testUserPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-144',
    });

    const field = new TextFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      formula: 'return "Hello World";',
      permissions: [new LayoutItemPermission({ roleName: role.name, read: false, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const addContentPage = new AddContentPage(sysAdminPage);
    const editContentPage = new EditContentPage(sysAdminPage);
    const viewContentPage = new ViewContentPage(testUserPage);
    let recordId: number;

    await test.step('Add the text formula field', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        sectionColumn: 0,
        sectionRow: 0,
        fieldName: field.name,
      });
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Create a record with a value in the text formula field as system admin', async () => {
      await addContentPage.goto(app.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
      await editContentPage.page.waitForLoadState();
      recordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Navigate to created record as test user who does not have access to the field by their role', async () => {
      await viewContentPage.goto(app.id, recordId);
    });

    await test.step('Verify the field is not visible', async () => {
      const contentField = await viewContentPage.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Formula',
      });
      await expect(contentField).toBeHidden();
    });
  });

  test('Make a Text Formula Field private by role to give access', async ({
    sysAdminPage,
    role,
    appAdminPage,
    app,
    testUserPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-821',
    });

    const returnValue = 'Hello World';
    const field = new TextFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      formula: `return "${returnValue}";`,
      permissions: [new LayoutItemPermission({ roleName: role.name, read: true, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const addContentPage = new AddContentPage(sysAdminPage);
    const editContentPage = new EditContentPage(sysAdminPage);
    const viewContentPage = new ViewContentPage(testUserPage);
    let recordId: number;

    await test.step('Add the text formula field', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        sectionColumn: 0,
        sectionRow: 0,
        fieldName: field.name,
      });
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Create a record with a value in the text formula field as system admin', async () => {
      await addContentPage.goto(app.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
      await editContentPage.page.waitForLoadState();
      recordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Navigate to created record as test user who does have access to the field by their role', async () => {
      await viewContentPage.goto(app.id, recordId);
    });

    await test.step('Verify the field is visible', async () => {
      const contentField = await viewContentPage.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Text',
      });
      await expect(contentField).toBeVisible();
      await expect(contentField).toHaveText(new RegExp(returnValue));
    });
  });

  test('Make a Text Formula Field public', async ({ sysAdminPage, role, appAdminPage, app, testUserPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-145',
    });

    const returnValue = 'Hello World';
    const field = new TextFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      formula: `return "${returnValue}";`,
      permissions: [new LayoutItemPermission({ roleName: role.name, read: false, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const addContentPage = new AddContentPage(sysAdminPage);
    const editContentPage = new EditContentPage(sysAdminPage);
    const viewContentPage = new ViewContentPage(testUserPage);
    let recordId: number;

    await test.step('Add the text formula field', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        sectionColumn: 0,
        sectionRow: 0,
        fieldName: field.name,
      });
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Create a record with a value in the text formula field as system admin', async () => {
      await addContentPage.goto(app.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
      await editContentPage.page.waitForLoadState();
      recordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Navigate to created record as test user who does not have access to the field by their role', async () => {
      await viewContentPage.goto(app.id, recordId);
    });

    await test.step('Verify the field is not visible', async () => {
      const contentField = await viewContentPage.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Text',
      });
      await expect(contentField).toBeHidden();
    });

    await test.step('Update the text formula field so that it is public', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await fieldRow.hover();
      await fieldRow.getByTitle('Edit').click();

      const editTextFormulaFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Formula');
      await editTextFormulaFieldModal.securityTabButton.click();
      await editTextFormulaFieldModal.securityTab.setPermissions([]);
      await editTextFormulaFieldModal.saveButton.click();
    });

    await test.step('Navigate to created record again as test user', async () => {
      await viewContentPage.goto(app.id, recordId);
    });

    await test.step('Verify the field is visible', async () => {
      const contentField = await viewContentPage.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Formula',
      });
      await expect(contentField).toBeVisible();
      await expect(contentField).toHaveText(new RegExp(returnValue));
    });
  });
});
