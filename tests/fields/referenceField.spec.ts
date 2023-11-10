import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { Page, test as base, expect } from '../../fixtures';
import { app, appAdminPage } from '../../fixtures/app.fixtures';
import { testUserPage } from '../../fixtures/auth.fixtures';
import { activeUserWithRole } from '../../fixtures/user.fixtures';
import { App } from '../../models/app';
import { ReferenceField } from '../../models/referenceField';
import { AppPermission, Permission, Role } from '../../models/role';
import { User } from '../../models/user';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
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

      const addReferenceFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Reference');

      await expect(addReferenceFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);
      await addReferenceFieldModal.saveButton.click();
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
      await appAdminPage.layoutTab.addLayoutItemDialog.selectDropdown.click();
      await appAdminPage.layoutTab.addLayoutItemDialog.getLayoutItemToCopy(field.name).click();
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();

      const addTextFieldModal = appAdminPage.layoutTab.getLayoutItemModal('Reference');

      await expect(addTextFieldModal.generalTab.fieldInput).toHaveValue(copiedFieldName);

      await addTextFieldModal.saveButton.click();
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

  test('Create a copy of a Reference Field on an app from a layout', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-119',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test("Add a Reference Field to an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-120',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test("Remove a Reference Field from an app's layout", async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-121',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Update the configuration of a Reference Field on an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-122',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Delete a Reference Field from an app', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-123',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Reference Field private by role to prevent access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-124',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Reference Field private by role to give access', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-855',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });

  test('Make a Reference Field public', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-125',
    });

    // TODO: Implement test
    expect(false).toBe(true);
  });
});
