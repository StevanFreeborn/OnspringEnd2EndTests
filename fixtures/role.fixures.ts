import { Page } from '@playwright/test';
import { FakeDataFactory } from '../factories/fakeDataFactory';
import { App } from '../models/app';
import { AppPermission, Permission, Role, RoleStatus } from '../models/role';
import { AddRoleAdminPage } from '../pageObjectModels/roles/addRoleAdminPage';
import { EditRoleAdminPage } from '../pageObjectModels/roles/editRoleAdminPage';
import { RolesSecurityAdminPage } from '../pageObjectModels/roles/rolesSecurityAdminPage';

export async function activeRoleWithPermissions(
  { sysAdminPage, app }: { sysAdminPage: Page; app: App },
  use: (r: Role) => Promise<void>
) {
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
}

// TODO: could this be used in referenceField.spec.ts?
export async function createRoleFixture(
  {
    sysAdminPage,
    roleStatus,
    appPermissions,
  }: { sysAdminPage: Page; roleStatus: RoleStatus; appPermissions: AppPermission[] },
  use: (r: Role) => Promise<void>
) {
  const addRoleAdminPage = new AddRoleAdminPage(sysAdminPage);
  const editRoleAdminPage = new EditRoleAdminPage(sysAdminPage);
  const roleSecurityAdminPage = new RolesSecurityAdminPage(sysAdminPage);
  const roleName = FakeDataFactory.createFakeRoleName();
  const role = new Role({
    name: roleName,
    status: roleStatus,
    appPermissions: appPermissions,
  });

  await addRoleAdminPage.addRole(role);
  await addRoleAdminPage.page.waitForURL(editRoleAdminPage.pathRegex);
  await editRoleAdminPage.page.waitForLoadState();

  role.id = editRoleAdminPage.getRoleIdFromUrl();

  await use(role);

  await roleSecurityAdminPage.deleteRoles([roleName]);
}
