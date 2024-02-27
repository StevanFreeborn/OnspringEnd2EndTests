import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { Locator, expect, layoutItemTest as test } from '../../fixtures';
import { DateField } from '../../models/dateField';
import { LayoutItemPermission } from '../../models/layoutItem';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { EditContentPage } from '../../pageObjectModels/content/editContentPage';
import { ViewContentPage } from '../../pageObjectModels/content/viewContentPage';
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

  test('Create a copy of a Date/Time Field on an app from the Fields & Objects report using row copy button', async ({
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-57',
    });

    const field = new DateField({ name: FakeDataFactory.createFakeFieldName() });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Add the the date/time field to be copied', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Add a copy of the date/time field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });

      await fieldRow.hover();
      await fieldRow.getByTitle('Copy').click();
      await appAdminPage.page.waitForLoadState('networkidle');

      const addDateFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Date/Time');

      await expect(addDateFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);
      await addDateFieldModal.save();
    });

    await test.step('Verify the field was copied', async () => {
      await appAdminPage.page.waitForLoadState('networkidle');
      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedFieldName,
      });
      await expect(copiedFieldRow).toBeVisible();
    });
  });

  test('Create a copy of a Date/Time Field on an app from the Fields & Objects report using Add Field button', async ({
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-814',
    });

    const field = new DateField({ name: FakeDataFactory.createFakeFieldName() });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Add the date/time field to copy', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Add a copy of the date/time field', async () => {
      await appAdminPage.layoutTab.addFieldButton.click();
      await appAdminPage.layoutTab.addLayoutItemMenu.selectItem(field.type);
      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromRadioButton.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getLayoutItemToCopy(field.name).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();
      await appAdminPage.page.waitForLoadState('networkidle');

      const addDateFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Date/Time');

      await expect(addDateFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);

      await addDateFieldModal.save();
    });

    await test.step('Verify the field was copied', async () => {
      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedFieldName,
      });
      await expect(copiedFieldRow).toBeVisible();
    });
  });

  test('Add a Date/Time Field to an app from a layout', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-58',
    });

    const field = new DateField({ name: FakeDataFactory.createFakeFieldName() });

    await test.step('Open layout designer for default layout', async () => {
      await appAdminPage.layoutTab.openLayout();
    });

    await test.step('Add the date/time field', async () => {
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

  test('Create a copy of a Date/Time Field on an app from a layout', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-59',
    });

    const field = new DateField({ name: FakeDataFactory.createFakeFieldName() });
    const copiedFieldName = `${field.name} (1)`;

    await test.step('Open layout designer for default layout', async () => {
      await appAdminPage.layoutTab.openLayout();
    });

    await test.step('Add the date/time field to copy', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(field);
    });

    await test.step('Add a copy of the date/time field', async () => {
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.fieldsTab.addFieldButton.click();
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.fieldsTab.addFieldMenu.selectItem(
        'Date/Time'
      );

      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromRadioButton.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getLayoutItemToCopy(field.name).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();
      await appAdminPage.page.waitForLoadState('networkidle');

      const addDateFieldModal = appAdminPage.layoutTab.layoutDesignerModal.getLayoutItemModal('Date/Time', 1);

      await expect(addDateFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);

      await addDateFieldModal.save();
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

  test("Add a Date/Time Field to an app's layout", async ({ sysAdminPage, appAdminPage, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-64',
    });

    const field = new DateField({ name: FakeDataFactory.createFakeFieldName() });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Add the date/time field that will be added to layout', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Add the date/time field to the layout', async () => {
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

      const dateTimePicker = await addContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Date/Time',
      });

      await expect(dateTimePicker.input).toBeVisible();
      await expect(dateTimePicker.calendarButton).toBeVisible();
    });
  });

  test("Remove a Date/Time Field from an app's layout", async ({ sysAdminPage, appAdminPage, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-69',
    });

    const field = new DateField({ name: FakeDataFactory.createFakeFieldName() });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    let fieldInBank: Locator;
    let fieldLayoutDropzone: Locator;

    await test.step('Add the date/time field that will be removed from layout', async () => {
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

    await test.step('Remove the date/time field from the layout', async () => {
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
      const dateTimePicker = await addContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Date/Time',
      });

      await expect(dateTimePicker.input).toBeHidden();
      await expect(dateTimePicker.calendarButton).toBeHidden();
    });
  });

  test('Delete a Date/Time Field from an app', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-70',
    });

    const field = new DateField({ name: FakeDataFactory.createFakeFieldName() });

    await test.step('Add the date/time field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Delete the date/time field', async () => {
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

  test('Update the configuration of a Date/Time Field on an app', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-73',
    });

    const field = new DateField({ name: FakeDataFactory.createFakeFieldName() });
    const updatedFieldName = `${field.name} updated`;

    await test.step('Add the date/time field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Update the date/time field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await fieldRow.hover();
      await fieldRow.getByTitle('Edit').click();
      await appAdminPage.page.waitForLoadState('networkidle');

      const editDateFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Date/Time');
      await editDateFieldModal.generalTab.fieldInput.fill(updatedFieldName);
      await editDateFieldModal.save();
    });

    await test.step('Verify the field was updated', async () => {
      const updatedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: updatedFieldName,
      });
      await expect(updatedFieldRow).toBeVisible();
    });
  });

  test('Make a Date/Time Field private by role to prevent access', async ({
    sysAdminPage,
    appAdminPage,
    app,
    role,
    testUserPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-98',
    });

    const field = new DateField({
      name: FakeDataFactory.createFakeFieldName(),
      permissions: [new LayoutItemPermission({ roleName: role.name, read: false, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const addContentPage = new AddContentPage(sysAdminPage);
    const editContentPage = new EditContentPage(sysAdminPage);
    const viewContentPage = new ViewContentPage(testUserPage);
    const { year, month, day } = getTestDate();
    let recordId: number;

    await test.step('Add the date/time field', async () => {
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

    await test.step('Create a record with a value in the date/time field as system admin', async () => {
      await addContentPage.goto(app.id);
      const dateTimePicker = await addContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Date/Time',
      });
      await dateTimePicker.selectDateUsingCalendar(year, month, day);
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
        fieldType: 'Date/Time',
      });
      await expect(contentField).toBeHidden();
    });
  });

  test('Make a Date/Time Field private by role to give access', async ({
    sysAdminPage,
    role,
    appAdminPage,
    app,
    testUserPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-812',
    });

    const field = new DateField({
      name: FakeDataFactory.createFakeFieldName(),
      permissions: [new LayoutItemPermission({ roleName: role.name, read: true, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const addContentPage = new AddContentPage(sysAdminPage);
    const editContentPage = new EditContentPage(sysAdminPage);
    const viewContentPage = new ViewContentPage(testUserPage);
    const { year, month, day, fieldValue } = getTestDate();
    let recordId: number;

    await test.step('Add the date/time field', async () => {
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

    await test.step('Create a record with a value in the date/time field as system admin', async () => {
      await addContentPage.goto(app.id);
      const dateTimePicker = await addContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Date/Time',
      });
      await dateTimePicker.selectDateUsingCalendar(year, month, day);
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
        fieldType: 'Date/Time',
      });
      await expect(contentField).toBeVisible();
      await expect(contentField).toHaveText(new RegExp(fieldValue));
    });
  });

  test('Make a Date/Time Field public', async ({ sysAdminPage, role, appAdminPage, app, testUserPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-102',
    });

    const field = new DateField({
      name: FakeDataFactory.createFakeFieldName(),
      permissions: [new LayoutItemPermission({ roleName: role.name, read: false, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const addContentPage = new AddContentPage(sysAdminPage);
    const editContentPage = new EditContentPage(sysAdminPage);
    const viewContentPage = new ViewContentPage(testUserPage);
    const { year, month, day, fieldValue } = getTestDate();
    let recordId: number;

    await test.step('Add the date/time field', async () => {
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

    await test.step('Create a record with a value in the date/time field as system admin', async () => {
      await addContentPage.goto(app.id);
      const dateTimePicker = await addContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Date/Time',
      });
      await dateTimePicker.selectDateUsingCalendar(year, month, day);
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
        fieldType: 'Date/Time',
      });
      await expect(contentField).toBeHidden();
    });

    await test.step('Update the date/time field so that it is public', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await fieldRow.hover();
      await fieldRow.getByTitle('Edit').click();
      await appAdminPage.page.waitForLoadState('networkidle');

      const editDateFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Date/Time');
      await editDateFieldModal.securityTabButton.click();
      await editDateFieldModal.securityTab.setPermissions([]);
      await editDateFieldModal.save();
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
        fieldType: 'Date/Time',
      });
      await expect(contentField).toBeVisible();
      await expect(contentField).toHaveText(new RegExp(fieldValue));
    });
  });
});

function getTestDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const fieldValue = `${month}/${day}/${year}`;

  return { year, month, day, fieldValue };
}
