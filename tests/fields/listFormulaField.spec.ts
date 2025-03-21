import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { Locator, expect, layoutItemTest as test } from '../../fixtures';
import { LayoutItemPermission } from '../../models/layoutItem';
import { ListFormulaField } from '../../models/listFormulaField';
import { ListValue } from '../../models/listValue';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { EditContentPage } from '../../pageObjectModels/content/editContentPage';
import { ViewContentPage } from '../../pageObjectModels/content/viewContentPage';
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

      await addListFormulaFieldModal.generalTab.fieldInput.waitFor();
      await expect(addListFormulaFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);
      await addListFormulaFieldModal.save();
    });

    await test.step('Verify the field was copied', async () => {
      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedFieldName,
      });

      await copiedFieldRow.waitFor();
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
      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getLayoutItemToCopy(field.name).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();

      const addListFormulaFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Formula');

      await addListFormulaFieldModal.generalTab.fieldInput.waitFor();
      await expect(addListFormulaFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);

      await addListFormulaFieldModal.save();
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
      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getLayoutItemToCopy(field.name).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();

      const addListFormulaFieldModal = appAdminPage.layoutTab.layoutDesignerModal.getLayoutItemModal('Formula', 1);

      await addListFormulaFieldModal.generalTab.fieldInput.waitFor();
      await expect(addListFormulaFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);

      await addListFormulaFieldModal.save();
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

  test("Add a List Formula Field to an app's layout", async ({ sysAdminPage, appAdminPage, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-170',
    });

    const listValues = [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })];
    const field = new ListFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      values: listValues,
      formula: `return [:${listValues[0].value}];`,
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Add the list formula field that will be added to layout', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Add the list formula field to the layout', async () => {
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

      const contentField = await addContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Formula',
      });

      await expect(contentField).toBeVisible();
    });
  });

  test("Remove a List Formula Field from an app's layout", async ({ sysAdminPage, appAdminPage, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-171',
    });

    const listValues = [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })];
    const field = new ListFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      values: listValues,
      formula: `return [:${listValues[0].value}];`,
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    let fieldInBank: Locator;
    let fieldLayoutDropzone: Locator;

    await test.step('Add the list formula field that will be removed from layout', async () => {
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

    await test.step('Remove the list formula field from the layout', async () => {
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
      const contentField = await addContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Formula',
      });

      await expect(contentField).toBeHidden();
    });
  });

  test('Update the configuration of a List Formula Field on an app', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-173',
    });

    const listValues = [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })];
    const field = new ListFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      values: listValues,
      formula: `return [:${listValues[0].value}];`,
    });
    const updatedFieldName = `${field.name} updated`;

    await test.step('Add the list formula field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Update the list formula field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await fieldRow.hover();
      await fieldRow.getByTitle('Edit').click();

      const editListFormulaFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Formula');

      await editListFormulaFieldModal.generalTab.fieldInput.waitFor();
      await editListFormulaFieldModal.generalTab.fieldInput.fill(updatedFieldName);
      await editListFormulaFieldModal.save();
    });

    await test.step('Verify the field was updated', async () => {
      const updatedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: updatedFieldName,
      });
      await expect(updatedFieldRow).toBeVisible();
    });
  });

  test('Delete a List Formula Field from an app', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-172',
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

    await test.step('Delete the list formula field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await fieldRow.hover();
      await fieldRow.getByTitle('Delete').click();

      const deleteResponse = appAdminPage.waitForLayoutItemDeleteResponse();
      await appAdminPage.layoutTab.deleteLayoutItemDialog.deleteButton.click();
      await deleteResponse;
    });

    await test.step('Verify the field was deleted', async () => {
      const deletedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: field.name,
      });

      await expect(deletedFieldRow).toBeHidden();
    });
  });

  test('Make a List Formula Field private by role to prevent access', async ({
    sysAdminPage,
    appAdminPage,
    app,
    role,
    testUserPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-174',
    });

    const listValues = [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })];
    const field = new ListFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      values: listValues,
      formula: `return [:${listValues[0].value}];`,
      permissions: [new LayoutItemPermission({ roleName: role.name, read: false, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const addContentPage = new AddContentPage(sysAdminPage);
    const editContentPage = new EditContentPage(sysAdminPage);
    const viewContentPage = new ViewContentPage(testUserPage);
    let recordId: number;

    await test.step('Add the list formula field', async () => {
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

    await test.step('Create a record with a value in the list formula field as system admin', async () => {
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
      const contentField = await viewContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Formula',
      });
      await expect(contentField).toBeHidden();
    });
  });

  test('Make a List Formula Field private by role to give access', async ({
    sysAdminPage,
    appAdminPage,
    app,
    role,
    testUserPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-831',
    });

    const listValues = [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })];
    const field = new ListFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      values: listValues,
      formula: `return [:${listValues[0].value}];`,
      permissions: [new LayoutItemPermission({ roleName: role.name, read: true, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const addContentPage = new AddContentPage(sysAdminPage);
    const editContentPage = new EditContentPage(sysAdminPage);
    const viewContentPage = new ViewContentPage(testUserPage);
    let recordId: number;

    await test.step('Add the list formula field', async () => {
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

    await test.step('Create a record with a value in the list formula field as system admin', async () => {
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
      const contentField = await viewContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Formula',
      });
      await expect(contentField).toBeVisible();
      await expect(contentField).toHaveText(new RegExp(listValues[0].value));
    });
  });

  test('Make a List Formula Field public', async ({ sysAdminPage, appAdminPage, app, role, testUserPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-175',
    });

    const listValues = [new ListValue({ value: 'No' }), new ListValue({ value: 'Yes' })];
    const field = new ListFormulaField({
      name: FakeDataFactory.createFakeFieldName(),
      values: listValues,
      formula: `return [:${listValues[0].value}];`,
      permissions: [new LayoutItemPermission({ roleName: role.name, read: false, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const addContentPage = new AddContentPage(sysAdminPage);
    const editContentPage = new EditContentPage(sysAdminPage);
    const viewContentPage = new ViewContentPage(testUserPage);
    let recordId: number;

    await test.step('Add the list formula field', async () => {
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

    await test.step('Create a record with a value in the list formula field as system admin', async () => {
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
      const contentField = await viewContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Formula',
      });
      await expect(contentField).toBeHidden();
    });

    await test.step('Update the list formula field so that it is public', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await fieldRow.hover();
      await fieldRow.getByTitle('Edit').click();

      const editListFormulaFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Formula');

      await editListFormulaFieldModal.securityTabButton.waitFor();
      await editListFormulaFieldModal.securityTabButton.click();
      await editListFormulaFieldModal.securityTab.setPermissions([]);
      await editListFormulaFieldModal.save();
    });

    await test.step('Navigate to created record again as test user', async () => {
      await viewContentPage.goto(app.id, recordId);
      await viewContentPage.page.reload();
    });

    await test.step('Verify the field is visible', async () => {
      const contentField = await viewContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Formula',
      });
      await expect(contentField).toBeVisible();
      await expect(contentField).toHaveText(new RegExp(listValues[0].value));
    });
  });
});
