import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { Locator, test as base, expect } from '../../fixtures';
import { App } from '../../models/app';
import { AppPermission, Permission, Role } from '../../models/role';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AppsAdminPage } from '../../pageObjectModels/apps/appsAdminPage';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { AddRoleAdminPage } from '../../pageObjectModels/roles/addRoleAdminPage';
import { RolesSecurityAdminPage } from '../../pageObjectModels/roles/rolesSecurityAdminPage';
import { AnnotationType } from '../annotations';
import { EditRoleAdminPage } from './../../pageObjectModels/roles/editRoleAdminPage';

type TextFieldTestFixtures = {
  appAdminPage: AppAdminPage;
  app: App;
  role: Role;
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
  testUserPage: async ({ sysAdminPage, role }, use) => {
    // TODO: Create test user fixture
    // Create user, assign role, and set password
    // User new user to login
    // await use(user);
    // Delete user
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
      await appAdminPage.layoutTab.addLayoutItem('Text', fieldName);
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
      await appAdminPage.layoutTab.addLayoutItem('Text', fieldName);
    });

    await test.step('Add a copy of the text field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: fieldName });

      await fieldRow.hover();
      await fieldRow.getByTitle('Copy').click();

      const addTextFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Text');

      await addTextFieldModal.fieldInput.fill(copiedFieldName);
      await addTextFieldModal.fieldInput.fill(copiedFieldName);
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
      await appAdminPage.layoutTab.addLayoutItem('Text', fieldName);
    });

    await test.step('Add a copy of the text field', async () => {
      await appAdminPage.layoutTab.addFieldButton.click();
      await appAdminPage.layoutTab.addLayoutItemMenu.selectItem('Text');
      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromRadioButton.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.selectFieldDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getFieldToCopy(fieldName).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();

      const addTextFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Text');

      await expect(addTextFieldModal.fieldInput).toHaveValue(copiedFieldName);

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
      await appAdminPage.layoutTab.addFieldFromLayoutDesigner('Text', fieldName);
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
      await appAdminPage.layoutTab.addFieldFromLayoutDesigner('Text', fieldName);
    });

    await test.step('Add a copy of the text field', async () => {
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.fieldsTab.addFieldButton.click();
      await appAdminPage.layoutTab.layoutDesignerModal.layoutItemsSection.fieldsTab.addFieldMenu.selectItem('Text');

      await appAdminPage.layoutTab.addLayoutItemDialog.copyFromRadioButton.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.selectFieldDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getFieldToCopy(fieldName).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();

      const addTextFieldModal = appAdminPage.layoutTab.layoutDesignerModal.addFieldModal;

      await expect(addTextFieldModal.fieldInput).toHaveValue(copiedFieldName);

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
      await appAdminPage.layoutTab.addLayoutItem('Text', fieldName);
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
      await appAdminPage.layoutTab.addFieldFromLayoutDesigner('Text', fieldName);
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
      await appAdminPage.layoutTab.addLayoutItem('Text', fieldName);
    });

    await test.step('Update the text field', async () => {
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: fieldName });
      await fieldRow.hover();
      await fieldRow.getByTitle('Edit').click();

      const editTextFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Text');
      await editTextFieldModal.fieldInput.fill(updatedFieldName);
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
      await appAdminPage.layoutTab.addLayoutItem('Text', fieldName);
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

  test('Make a Text Field private by role', async ({ role }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-99',
    });

    // I want to have a role that has permissions to the app
    // I want to have a user that has that role
    // I want to have that user logged in

    // await test.step('Add the text field', async () => {});

    // await test.step('Verify the field is private by role', async () => {});

    expect(role).toBeDefined();
  });
});
