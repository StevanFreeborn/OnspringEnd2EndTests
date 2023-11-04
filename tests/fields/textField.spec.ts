import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { UserFactory } from '../../factories/userFactory';
import { Locator, Page, test as base, expect } from '../../fixtures';
import { App } from '../../models/app';
import { LayoutItemPermission } from '../../models/layoutItem';
import { AppPermission, Permission, Role } from '../../models/role';
import { TextField } from '../../models/textField';
import { UserStatus } from '../../models/user';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AppsAdminPage } from '../../pageObjectModels/apps/appsAdminPage';
import { LoginPage } from '../../pageObjectModels/authentication/loginPage';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { EditContentPage } from '../../pageObjectModels/content/editContentPage';
import { ViewContentPage } from '../../pageObjectModels/content/viewContentPage';
import { DashboardPage } from '../../pageObjectModels/dashboards/dashboardPage';
import { AddRoleAdminPage } from '../../pageObjectModels/roles/addRoleAdminPage';
import { RolesSecurityAdminPage } from '../../pageObjectModels/roles/rolesSecurityAdminPage';
import { AddUserAdminPage } from '../../pageObjectModels/users/addUserAdminPage';
import { EditUserAdminPage } from '../../pageObjectModels/users/editUserAdminPage';
import { MS_PER_MIN } from '../../playwright.config';
import { AnnotationType } from '../annotations';
import { EditRoleAdminPage } from './../../pageObjectModels/roles/editRoleAdminPage';
import { UsersSecurityAdminPage } from './../../pageObjectModels/users/usersSecurityAdminPage';

type TextFieldTestFixtures = {
  appAdminPage: AppAdminPage;
  app: App;
  role: Role;
  testUserPage: Page;
};

const test = base.extend<TextFieldTestFixtures>({
  appAdminPage: async ({ sysAdminPage }, use) => {
    const appAdminPage = new AppAdminPage(sysAdminPage);
    await use(appAdminPage);
  },
  app: async ({ sysAdminPage }, use) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    const appsAdminPage = new AppsAdminPage(sysAdminPage);
    const appAdminPage = new AppAdminPage(sysAdminPage);
    const appName = FakeDataFactory.createFakeAppName();

    await adminHomePage.goto();
    await adminHomePage.createApp(appName);
    await appAdminPage.page.waitForURL(appAdminPage.pathRegex);
    const appId = appAdminPage.getAppIdFromUrl();
    const app = new App({ id: appId, name: appName });

    await use(app);

    await appsAdminPage.deleteApps([appName]);
  },
  role: async ({ sysAdminPage, app }, use) => {
    const addRoleAdminPage = new AddRoleAdminPage(sysAdminPage);
    const editRoleAdminPage = new EditRoleAdminPage(sysAdminPage);
    const roleSecurityAdminPage = new RolesSecurityAdminPage(sysAdminPage);
    const roleName = FakeDataFactory.createFakeRoleName();
    const role = new Role({ name: roleName, status: 'Active' });
    role.appPermissions.push(
      new AppPermission({
        appName: app.name,
        contentRecords: new Permission({ read: true }),
      })
    );

    await addRoleAdminPage.addRole(role);
    await addRoleAdminPage.page.waitForURL(editRoleAdminPage.pathRegex);
    await editRoleAdminPage.page.waitForLoadState();

    role.id = editRoleAdminPage.getRoleIdFromUrl();

    await use(role);

    await roleSecurityAdminPage.deleteRoles([roleName]);
  },
  testUserPage: async ({ browser, sysAdminPage, role }, use) => {
    const addUserAdminPage = new AddUserAdminPage(sysAdminPage);
    const editUserAdminPage = new EditUserAdminPage(sysAdminPage);
    const usersSecurityAdminPage = new UsersSecurityAdminPage(sysAdminPage);
    const user = UserFactory.createNewUser(UserStatus.Active);
    user.roles.push(role.name);

    await addUserAdminPage.goto();
    await addUserAdminPage.addUser(user);
    await addUserAdminPage.page.waitForURL(editUserAdminPage.pathRegex);
    await editUserAdminPage.page.waitForLoadState();
    await editUserAdminPage.changePassword(user.password);
    await editUserAdminPage.saveUser();
    user.id = editUserAdminPage.getUserIdFromUrl();

    const context = await browser.newContext();
    const page = await context.newPage();

    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    await loginPage.login(user);
    await loginPage.page.waitForURL(dashboardPage.path);

    await use(page);

    await usersSecurityAdminPage.deleteUsers([user.username]);
    await context.close();
  },
});

test.describe('text field', () => {
  test.beforeEach(async ({ appAdminPage, app }) => {
    await appAdminPage.goto(app.id);
    await appAdminPage.layoutTabButton.click();
  });

  test('Add a Text Field to an app from the Fields & Objects report', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-80',
    });

    const fieldName = FakeDataFactory.createFakeFieldName();

    await test.step('Add the text field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(new TextField({ name: fieldName }));
    });

    await test.step('Verify the field was added', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: fieldName });
      await expect(fieldRow).toBeVisible();
    });
  });

  test('Add a copy of a Text Field on an app from the Fields & Objects report using row copy button', async ({
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-81',
    });

    const fieldName = FakeDataFactory.createFakeFieldName();
    const copiedFieldName = `${fieldName} (copy)`;

    await test.step('Add the the text field to be copied', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(new TextField({ name: fieldName }));
    });

    await test.step('Add a copy of the text field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: fieldName });

      await fieldRow.hover();
      await fieldRow.getByTitle('Copy').click();

      const addTextFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Text');

      await addTextFieldModal.generalTab.fieldInput.fill(copiedFieldName);
      await addTextFieldModal.generalTab.fieldInput.fill(copiedFieldName);
      await addTextFieldModal.saveButton.click();
    });

    await test.step('Verify the field was copied', async () => {
      await appAdminPage.page.waitForLoadState('networkidle');
      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedFieldName,
      });
      await expect(copiedFieldRow).toBeVisible();
    });
  });

  test('Add a copy of a Text Field on an app from the Fields & Objects report using Add Field button.', async ({
    appAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-809',
    });

    const fieldName = FakeDataFactory.createFakeFieldName();
    const copiedFieldName = `${fieldName} (1)`;

    await test.step('Add the text field to copy', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(new TextField({ name: fieldName }));
    });

    await test.step('Add a copy of the text field', async () => {
      await appAdminPage.layoutTab.addFieldButton.click();
      await appAdminPage.layoutTab.addLayoutItemMenu.selectItem('Text');
      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromRadioButton.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.selectFieldDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getFieldToCopy(fieldName).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();

      const addTextFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Text');

      await expect(addTextFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);

      await addTextFieldModal.saveButton.click();
    });

    await test.step('Verify the field was copied', async () => {
      const copiedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: copiedFieldName,
      });
      await expect(copiedFieldRow).toBeVisible();
    });
  });

  test('Add a Text Field to an app from a layout', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-82',
    });

    const fieldName = FakeDataFactory.createFakeFieldName();

    await test.step('Open layout designer for default layout', async () => {
      await appAdminPage.layoutTab.openLayout();
    });

    await test.step('Add the text field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(new TextField({ name: fieldName }));
    });

    await test.step('Verify the field was added', async () => {
      const field = appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.fieldsTab.getFieldFromBank(fieldName);

      await expect(field).toBeVisible();
      await expect(field).not.toHaveClass(/ui-draggable-disabled/);

      await appAdminPage.layoutTab.layoutDesignerModal.closeButton.click();

      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: fieldName });

      await expect(fieldRow).toBeVisible();
    });
  });

  test('Add a copy of a Text Field on an app from a layout.', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-83',
    });

    const fieldName = FakeDataFactory.createFakeFieldName();
    const copiedFieldName = `${fieldName} (1)`;

    await test.step('Open layout designer for default layout', async () => {
      await appAdminPage.layoutTab.openLayout();
    });

    await test.step('Add the text field to copy', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(new TextField({ name: fieldName }));
    });

    await test.step('Add a copy of the text field', async () => {
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.fieldsTab.addFieldButton.click();
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.fieldsTab.addFieldMenu.selectItem('Text');

      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromRadioButton.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.selectFieldDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getFieldToCopy(fieldName).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();

      const addTextFieldModal = appAdminPage.layoutTab.layoutDesignerModal.getLayoutItemModal('Text', 1);

      await expect(addTextFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);

      await addTextFieldModal.saveButton.click();
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

  test("Add a Text Field to an app's layout", async ({ appAdminPage, app, sysAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-84',
    });

    const fieldName = FakeDataFactory.createFakeFieldName();
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';

    await test.step('Add the text field that will be added to layout', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(new TextField({ name: fieldName }));
    });

    await test.step('Add the text field to the layout', async () => {
      await appAdminPage.layoutTab.openLayout();

      const { field, dropzone } = await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: tabName,
        sectionName: sectionName,
        sectionColumn: 0,
        sectionRow: 0,
        fieldName: fieldName,
      });

      await expect(field).toHaveClass(/ui-draggable-disabled/);
      await expect(dropzone).toHaveText(new RegExp(fieldName));

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the field was added to the layout', async () => {
      const addContentPage = new AddContentPage(sysAdminPage);
      await addContentPage.goto(app.id);

      const field = await addContentPage.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: fieldName,
        fieldType: 'Text',
      });

      await expect(field).toBeVisible();
    });
  });

  test("Remove a Text Field from an app's layout", async ({ appAdminPage, app, sysAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-85',
    });

    const fieldName = FakeDataFactory.createFakeFieldName();
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    let fieldInBank: Locator;
    let fieldLayoutDropzone: Locator;

    await test.step('Add the text field that will be removed from layout', async () => {
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(new TextField({ name: fieldName }));
      const { field, dropzone } = await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: tabName,
        sectionName: sectionName,
        sectionColumn: 0,
        sectionRow: 0,
        fieldName: fieldName,
      });

      fieldLayoutDropzone = dropzone;
      fieldInBank = field;

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Remove the text field from the layout', async () => {
      await appAdminPage.layoutTab.openLayout();
      await fieldLayoutDropzone.hover();
      await fieldLayoutDropzone.getByTitle('Remove Field from Layout').click();

      await expect(fieldInBank).not.toHaveClass(/ui-draggable-disabled/);
      await expect(fieldLayoutDropzone).not.toHaveText(new RegExp(fieldName));

      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Verify the field was removed from the layout', async () => {
      const addContentPage = new AddContentPage(sysAdminPage);
      await addContentPage.goto(app.id);
      const field = await addContentPage.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: fieldName,
        fieldType: 'Text',
      });

      await expect(field).toBeHidden();
    });
  });

  test('Update the configuration of a Text Field on an app', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-86',
    });

    const fieldName = FakeDataFactory.createFakeFieldName();
    const updatedFieldName = `${fieldName} updated`;

    await test.step('Add the text field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(new TextField({ name: fieldName }));
    });

    await test.step('Update the text field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: fieldName });
      await fieldRow.hover();
      await fieldRow.getByTitle('Edit').click();

      const editTextFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Text');
      await editTextFieldModal.generalTab.fieldInput.fill(updatedFieldName);
      await editTextFieldModal.saveButton.click();
    });

    await test.step('Verify the field was updated', async () => {
      const updatedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: updatedFieldName,
      });
      await expect(updatedFieldRow).toBeVisible();
    });
  });

  test('Delete a Text Field from an app', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-87',
    });

    const fieldName = FakeDataFactory.createFakeFieldName();

    await test.step('Add the text field', async () => {
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(new TextField({ name: fieldName }));
    });

    await test.step('Delete the text field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: fieldName });
      await fieldRow.hover();
      await fieldRow.getByTitle('Delete').click();

      await appAdminPage.layoutTab.deleteLayoutItemDialog.deleteButton.click();
      await appAdminPage.page.waitForLoadState('networkidle');
    });

    await test.step('Verify the field was deleted', async () => {
      const deletedFieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
        name: fieldName,
      });

      await expect(deletedFieldRow).toBeHidden();
    });
  });

  test('Make a Text Field private by role to prevent access', async ({
    sysAdminPage,
    role,
    appAdminPage,
    app,
    testUserPage,
  }) => {
    // test requires significant setup
    test.setTimeout(4 * MS_PER_MIN);

    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-99',
    });

    const fieldName = FakeDataFactory.createFakeFieldName();
    const field = new TextField({
      name: fieldName,
      permissions: [new LayoutItemPermission({ roleName: role.name, read: false, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const addContentPage = new AddContentPage(sysAdminPage);
    const editContentPage = new EditContentPage(sysAdminPage);
    const viewContentPage = new ViewContentPage(testUserPage);
    let recordId: number;

    await test.step('Add the text field', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        sectionColumn: 0,
        sectionRow: 0,
        fieldName: fieldName,
      });
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Create a record with a value in the text field as system admin', async () => {
      await addContentPage.goto(app.id);
      const field = await addContentPage.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: fieldName,
        fieldType: 'Text',
      });
      await field.fill('This should not be visible to the test user');
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
      await editContentPage.page.waitForLoadState();
      recordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Navigate to created record as test user who does not have access to the field by their role', async () => {
      await viewContentPage.goto(app.id, recordId);
    });

    await test.step('Verify the field is not visible', async () => {
      const field = await viewContentPage.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: fieldName,
        fieldType: 'Text',
      });
      await expect(field).toBeHidden();
    });
  });

  test('Make a Text Field private by role to give access', async ({
    sysAdminPage,
    role,
    appAdminPage,
    app,
    testUserPage,
  }) => {
    // test requires significant setup
    test.setTimeout(4 * MS_PER_MIN);

    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-810',
    });

    const fieldName = FakeDataFactory.createFakeFieldName();
    const field = new TextField({
      name: fieldName,
      permissions: [new LayoutItemPermission({ roleName: role.name, read: true, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const addContentPage = new AddContentPage(sysAdminPage);
    const editContentPage = new EditContentPage(sysAdminPage);
    const viewContentPage = new ViewContentPage(testUserPage);
    const fieldValue = 'This should be visible to the test user';
    let recordId: number;

    await test.step('Add the text field', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        sectionColumn: 0,
        sectionRow: 0,
        fieldName: fieldName,
      });
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Create a record with a value in the text field as system admin', async () => {
      await addContentPage.goto(app.id);
      const field = await addContentPage.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: fieldName,
        fieldType: 'Text',
      });
      await field.fill(fieldValue);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
      await editContentPage.page.waitForLoadState();
      recordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Navigate to created record as test user who does have access to the field by their role', async () => {
      await viewContentPage.goto(app.id, recordId);
    });

    await test.step('Verify the field is visible', async () => {
      const field = await viewContentPage.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: fieldName,
        fieldType: 'Text',
      });
      await expect(field).toBeVisible();
      await expect(field).toHaveText(new RegExp(fieldValue));
    });
  });

  test('Make a Text Field public', async ({ sysAdminPage, role, appAdminPage, app, testUserPage }) => {
    // test requires significant setup
    test.setTimeout(4 * MS_PER_MIN);

    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-105',
    });

    const fieldName = FakeDataFactory.createFakeFieldName();
    const field = new TextField({
      name: fieldName,
      permissions: [new LayoutItemPermission({ roleName: role.name, read: false, update: false })],
    });
    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const addContentPage = new AddContentPage(sysAdminPage);
    const editContentPage = new EditContentPage(sysAdminPage);
    const viewContentPage = new ViewContentPage(testUserPage);
    let recordId: number;

    await test.step('Add the text field', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
      await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
      await appAdminPage.layoutTab.openLayout();
      await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        sectionColumn: 0,
        sectionRow: 0,
        fieldName: fieldName,
      });
      await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
    });

    await test.step('Create a record with a value in the text field as system admin', async () => {
      await addContentPage.goto(app.id);
      const field = await addContentPage.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: fieldName,
        fieldType: 'Text',
      });
      await field.fill('This should not be visible to the test user');
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
      await editContentPage.page.waitForLoadState();
      recordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Navigate to created record as test user who does not have access to the field by their role', async () => {
      await viewContentPage.goto(app.id, recordId);
    });

    await test.step('Verify the field is not visible', async () => {
      const field = await viewContentPage.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: fieldName,
        fieldType: 'Text',
      });
      await expect(field).toBeHidden();
    });

    await test.step('Update the text field so that it is public', async () => {
      await appAdminPage.goto(app.id);
      await appAdminPage.layoutTabButton.click();
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: fieldName });
      await fieldRow.hover();
      await fieldRow.getByTitle('Edit').click();

      const editTextFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Text');
      await editTextFieldModal.securityTabButton.click();
      await editTextFieldModal.securityTab.setPermissions([]);
      await editTextFieldModal.saveButton.click();
    });

    await test.step('Navigate to created record again as test user', async () => {
      await viewContentPage.goto(app.id, recordId);
    });

    await test.step('Verify the field is visible', async () => {
      const field = await viewContentPage.getField({
        tabName: tabName,
        sectionName: sectionName,
        fieldName: fieldName,
        fieldType: 'Text',
      });
      await expect(field).toBeVisible();
    });
  });
});
