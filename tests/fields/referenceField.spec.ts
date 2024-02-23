import { CreateRecordModal } from '../../componentObjectModels/modals/createRecordModal';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { Locator, Page, test as base, expect } from '../../fixtures';
import { app, appAdminPage } from '../../fixtures/app.fixtures';
import { testUserPage } from '../../fixtures/auth.fixtures';
import { activeUserWithRole } from '../../fixtures/user.fixtures';
import { App } from '../../models/app';
import { LayoutItemPermission } from '../../models/layoutItem';
import { ReferenceField } from '../../models/referenceField';
import { AppPermission, Permission, Role } from '../../models/role';
import { User } from '../../models/user';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { EditContentPage } from '../../pageObjectModels/content/editContentPage';
import { ViewContentPage } from '../../pageObjectModels/content/viewContentPage';
import { AddRoleAdminPage } from '../../pageObjectModels/roles/addRoleAdminPage';
import { EditRoleAdminPage } from '../../pageObjectModels/roles/editRoleAdminPage';
import { RolesSecurityAdminPage } from '../../pageObjectModels/roles/rolesSecurityAdminPage';
import { AnnotationType } from '../annotations';

type ReferenceFieldTestFixtures = {
  appAdminPage: AppAdminPage;
  app: App;
  referencedApp: App;
  role: Role;
  user: User;
  testUserPage: Page;
};

const test = base.extend<ReferenceFieldTestFixtures>({
  appAdminPage: appAdminPage,
  app: app,
  referencedApp: app,
  role: async ({ sysAdminPage, app, referencedApp }, use) => {
    const addRoleAdminPage = new AddRoleAdminPage(sysAdminPage);
    const editRoleAdminPage = new EditRoleAdminPage(sysAdminPage);
    const roleSecurityAdminPage = new RolesSecurityAdminPage(sysAdminPage);
    const roleName = FakeDataFactory.createFakeRoleName();
    const role = new Role({ name: roleName, status: 'Active' });
    const appPermissions = [
      new AppPermission({
        appName: app.name,
        contentRecords: new Permission({ read: true }),
      }),
      new AppPermission({
        appName: referencedApp.name,
        referencedRecords: new Permission({ read: true }),
      }),
    ];
    role.appPermissions.push(...appPermissions);

    await addRoleAdminPage.addRole(role);
    await addRoleAdminPage.page.waitForURL(editRoleAdminPage.pathRegex);
    await editRoleAdminPage.page.waitForLoadState();

    role.id = editRoleAdminPage.getRoleIdFromUrl();

    await use(role);

    await roleSecurityAdminPage.deleteRoles([roleName]);
  },
  user: activeUserWithRole,
  testUserPage: testUserPage,
});

test.describe('reference field', () => {
  test('Add a Reference Field to an app from the Fields & Objects report', async ({
    appAdminPage,
    referencedApp,
    app,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-116',
    });

    const field = new ReferenceField({ name: FakeDataFactory.createFakeFieldName(), reference: referencedApp.name });

    await test.step('Add the reference field', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Verify the field was added', async () => {
      const referenceFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await expect(referenceFieldRow).toBeVisible();

      await appAdminPage.goto(referencedApp.id);
      await appAdminPage.layoutTabButton.click();
      const parallelReferenceFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: app.name,
      });
      await expect(parallelReferenceFieldRow).toBeVisible();
    });
  });

  test('Create a copy of a Reference Field on an app from the Fields & Objects report using the row copy button', async ({
    appAdminPage,
    referencedApp,
    app,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-117',
    });

    const field = new ReferenceField({ name: FakeDataFactory.createFakeFieldName(), reference: referencedApp.name });
    const copiedFieldName = `${field.name} (1)`;
    const copiedParallelFieldName = `${app.name} (1)`;

    await test.step('Add the the reference field to be copied', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Add a copy of the reference field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });

      await fieldRow.hover();
      await fieldRow.getByTitle('Copy').click();
      await appAdminPage.page.waitForLoadState('networkidle');

      const addReferenceFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Reference');

      await expect(addReferenceFieldModal.generalTab.fieldInput).toBeVisible();
      await expect(addReferenceFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);
      await expect(addReferenceFieldModal.generalTab.selectedGridFields).toBeVisible();
      await addReferenceFieldModal.save();
    });

    await test.step('Verify the field was copied', async () => {
      await appAdminPage.page.waitForLoadState('networkidle');
      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedFieldName,
      });
      await expect(copiedFieldRow).toBeVisible();

      await appAdminPage.goto(referencedApp.id);
      await appAdminPage.layoutTabButton.click();
      const copiedParallelFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedParallelFieldName,
      });

      await expect(copiedParallelFieldRow).toBeVisible();
    });
  });

  test('Create a copy of a Reference Field on an app from the Fields & Objects report using the Add Field button', async ({
    appAdminPage,
    referencedApp,
    app,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-854',
    });

    const field = new ReferenceField({ name: FakeDataFactory.createFakeFieldName(), reference: referencedApp.name });
    const copiedFieldName = `${field.name} (1)`;
    const copiedParallelFieldName = `${app.name} (1)`;

    await test.step('Add the reference field to copy', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Add a copy of the reference field', async () => {
      await appAdminPage.layoutTab.addFieldButton.click();
      await appAdminPage.layoutTab.addLayoutItemMenu.selectItem(field.type);
      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromRadioButton.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getLayoutItemToCopy(field.name).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();
      await appAdminPage.page.waitForLoadState('networkidle');

      const addReferenceFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Reference');

      await expect(addReferenceFieldModal.generalTab.fieldInput).toBeVisible();
      await expect(addReferenceFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);
      await expect(addReferenceFieldModal.generalTab.selectedGridFields).toBeVisible();

      await addReferenceFieldModal.save();
    });

    await test.step('Verify the field was copied', async () => {
      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedFieldName,
      });
      await expect(copiedFieldRow).toBeVisible();

      await appAdminPage.goto(referencedApp.id);
      await appAdminPage.layoutTabButton.click();
      const copiedParallelFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedParallelFieldName,
      });
      await expect(copiedParallelFieldRow).toBeVisible();
    });
  });

  test('Add a Reference Field to an app from a layout', async ({ appAdminPage, referencedApp, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-118',
    });

    const field = new ReferenceField({ name: FakeDataFactory.createFakeFieldName(), reference: referencedApp.name });

    await test.step('Open layout designer for default layout', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.openLayout();
    });

    await test.step('Add the reference field', async () => {
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

      await appAdminPage.goto(referencedApp.id);
      await appAdminPage.layoutTabButton.click();
      const parallelFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: app.name });
      await expect(parallelFieldRow).toBeVisible();
    });
  });

  test('Create a copy of a Reference Field on an app from a layout', async ({ appAdminPage, referencedApp, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-119',
    });

    const field = new ReferenceField({ name: FakeDataFactory.createFakeFieldName(), reference: referencedApp.name });
    const copiedFieldName = `${field.name} (1)`;
    const copiedParallelFieldName = `${app.name} (1)`;

    await test.step('Open layout designer for default layout', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.openLayout();
    });

    await test.step('Add the reference field to copy', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(field);
    });

    await test.step('Add a copy of the reference field', async () => {
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.fieldsTab.addFieldButton.click();
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.fieldsTab.addFieldMenu.selectItem(
        'Reference'
      );

      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromRadioButton.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getLayoutItemToCopy(field.name).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();
      await appAdminPage.page.waitForLoadState('networkidle');

      const addReferenceFieldModal = appAdminPage.layoutTab.layoutDesignerModal.getLayoutItemModal('Reference', 1);

      await expect(addReferenceFieldModal.generalTab.fieldInput).toBeVisible();
      await expect(addReferenceFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);
      await expect(addReferenceFieldModal.generalTab.selectedGridFields).toBeVisible();

      await addReferenceFieldModal.save();
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

      await appAdminPage.goto(referencedApp.id);
      await appAdminPage.layoutTabButton.click();
      const copiedParallelFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedParallelFieldName,
      });
      await expect(copiedParallelFieldRow).toBeVisible();
    });
  });

  test("Add a Reference Field to an app's layout", async ({ sysAdminPage, appAdminPage, referencedApp, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-120',
    });

    const field = new ReferenceField({ name: FakeDataFactory.createFakeFieldName(), reference: referencedApp.name });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Add the reference field that will be added to layout', async () => {
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Add the reference field to the layout', async () => {
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

      const referenceField = await addContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Reference',
      });

      await expect(referenceField.control).toBeVisible();
    });
  });

  test("Remove a Reference Field from an app's layout", async ({ sysAdminPage, appAdminPage, referencedApp, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-121',
    });

    const field = new ReferenceField({ name: FakeDataFactory.createFakeFieldName(), reference: referencedApp.name });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    let fieldInBank: Locator;
    let fieldLayoutDropzone: Locator;

    await test.step('Add the reference field that will be removed from layout', async () => {
      await appAdminPage.layoutTabButton.click();
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

    await test.step('Remove the reference field from the layout', async () => {
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
      const referenceField = await addContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Reference',
      });

      await expect(referenceField.control).toBeHidden();
    });
  });

  test('Update the configuration of a Reference Field on an app', async ({ appAdminPage, referencedApp, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-122',
    });

    const field = new ReferenceField({ name: FakeDataFactory.createFakeFieldName(), reference: referencedApp.name });
    const updatedFieldName = `${field.name} updated`;

    await test.step('Add the reference field', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Update the reference field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await fieldRow.hover();
      await fieldRow.getByTitle('Edit').click();
      await appAdminPage.page.waitForLoadState('networkidle');

      const editReferenceFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Reference');
      await editReferenceFieldModal.generalTab.fieldInput.fill(updatedFieldName);
      await editReferenceFieldModal.save();
    });

    await test.step('Verify the field was updated', async () => {
      const updatedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: updatedFieldName,
      });
      await expect(updatedFieldRow).toBeVisible();
    });
  });

  test('Delete a Reference Field from an app', async ({ appAdminPage, referencedApp, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-123',
    });

    const field = new ReferenceField({ name: FakeDataFactory.createFakeFieldName(), reference: referencedApp.name });

    await test.step('Add the reference field', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    });

    await test.step('Delete the reference field', async () => {
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

  test('Make a Reference Field private by role to prevent access', async ({
    sysAdminPage,
    appAdminPage,
    referencedApp,
    app,
    role,
    testUserPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-124',
    });

    const field = new ReferenceField({
      name: FakeDataFactory.createFakeFieldName(),
      reference: referencedApp.name,
      permissions: [new LayoutItemPermission({ roleName: role.name, read: false, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const addContentPage = new AddContentPage(sysAdminPage);
    const createRecordModal = new CreateRecordModal(sysAdminPage);
    const editContentPage = new EditContentPage(sysAdminPage);
    const viewContentPage = new ViewContentPage(testUserPage);
    let recordId: number;

    await test.step('Add the reference field', async () => {
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

    await test.step('Create a record with a value in the reference field as system admin', async () => {
      await addContentPage.goto(app.id);
      const referenceField = await addContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Reference',
      });

      await referenceField.openCreateNewRecordModal();
      await createRecordModal.saveRecord();

      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
      await editContentPage.page.waitForLoadState();
      recordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Navigate to created record as test user who does not have access to the field by their role', async () => {
      await viewContentPage.goto(app.id, recordId);
    });

    await test.step('Verify the field is not visible', async () => {
      const referenceField = await viewContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Reference',
      });
      await expect(referenceField).toBeHidden();
    });
  });

  test('Make a Reference Field private by role to give access', async ({
    sysAdminPage,
    appAdminPage,
    referencedApp,
    app,
    role,
    testUserPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-855',
    });

    const field = new ReferenceField({
      name: FakeDataFactory.createFakeFieldName(),
      reference: referencedApp.name,
      permissions: [new LayoutItemPermission({ roleName: role.name, read: true, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const addContentPage = new AddContentPage(sysAdminPage);
    const createRecordModal = new CreateRecordModal(sysAdminPage);
    const editContentPage = new EditContentPage(sysAdminPage);
    const viewContentPage = new ViewContentPage(testUserPage);
    let recordId: number;
    let referencedRecordId: number;

    await test.step('Add the reference field', async () => {
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

    await test.step('Create a record with a value in the reference field as system admin', async () => {
      await addContentPage.goto(app.id);
      const referenceField = await addContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Reference',
      });

      await referenceField.openCreateNewRecordModal();
      referencedRecordId = await createRecordModal.saveRecord();

      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
      await editContentPage.page.waitForLoadState();
      recordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Navigate to created record as test user who does have access to the field by their role', async () => {
      await viewContentPage.goto(app.id, recordId);
    });

    await test.step('Verify the field is visible', async () => {
      const referenceField = await viewContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Reference',
      });
      const referencedRecord = referenceField.getByRole('row', { name: referencedRecordId.toString() });

      await expect(referenceField).toBeVisible();
      await expect(referencedRecord).toBeVisible();
    });
  });

  test('Make a Reference Field public', async ({
    sysAdminPage,
    appAdminPage,
    referencedApp,
    app,
    role,
    testUserPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-125',
    });

    const field = new ReferenceField({
      name: FakeDataFactory.createFakeFieldName(),
      reference: referencedApp.name,
      permissions: [new LayoutItemPermission({ roleName: role.name, read: false, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const addContentPage = new AddContentPage(sysAdminPage);
    const createRecordModal = new CreateRecordModal(sysAdminPage);
    const editContentPage = new EditContentPage(sysAdminPage);
    const viewContentPage = new ViewContentPage(testUserPage);
    let recordId: number;
    let referencedRecordId: number;

    await test.step('Add the reference field', async () => {
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

    await test.step('Create a record with a value in the reference field as system admin', async () => {
      await addContentPage.goto(app.id);
      const referenceField = await addContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Reference',
      });

      await referenceField.openCreateNewRecordModal();
      referencedRecordId = await createRecordModal.saveRecord();

      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
      await editContentPage.page.waitForLoadState();
      recordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Navigate to created record as test user who does not have access to the field by their role', async () => {
      await viewContentPage.goto(app.id, recordId);
    });

    await test.step('Verify the field is not visible', async () => {
      const referenceField = await viewContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Reference',
      });
      await expect(referenceField).toBeHidden();
    });

    await test.step('Update the reference field so that it is public', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: field.name });
      await fieldRow.hover();
      await fieldRow.getByTitle('Edit').click();

      const editReferenceFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Text');
      await editReferenceFieldModal.securityTabButton.click();
      await editReferenceFieldModal.securityTab.setPermissions([]);
      await editReferenceFieldModal.save();
    });

    await test.step('Navigate to created record again as test user', async () => {
      await viewContentPage.goto(app.id, recordId);
      await viewContentPage.page.reload();
    });

    await test.step('Verify the field is visible', async () => {
      const referenceField = await viewContentPage.form.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: field.name,
        fieldType: 'Reference',
      });
      const referencedRecord = referenceField.getByRole('row', { name: referencedRecordId.toString() });

      await expect(referenceField).toBeVisible();
      await expect(referencedRecord).toBeVisible();
    });
  });
});
