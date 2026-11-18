import { Page } from '@playwright/test';
import { App, AppPermission, FakeDataFactory, Permission, Role, RoleStatus } from '@stevanfreeborn/onspring-models';
import { RoleTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export class RoleFixtureBuilder {
  private name?: string;
  private status: RoleStatus = 'Active';
  private appPermissionsFactory?: (deps: { app?: App }) => AppPermission[];

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withStatus(status: RoleStatus): this {
    this.status = status;
    return this;
  }

  withAppPermissions(factory: (deps: { app?: App }) => AppPermission[]): this {
    this.appPermissionsFactory = factory;
    return this;
  }

  build() {
    return async (
      { sysAdminActor, app }: { sysAdminActor: WebActor; app?: App },
      use: (role: Role) => Promise<void>
    ) => {
      const roleName = this.name ?? FakeDataFactory.createFakeRoleName();
      const appPermissions = this.appPermissionsFactory ? this.appPermissionsFactory({ app }) : [];

      const role = new Role({
        name: roleName,
        status: this.status,
        appPermissions,
      });

      await sysAdminActor.attemptsTo(RoleTasks.create(role));
      await use(role);
      await sysAdminActor.attemptsTo(RoleTasks.deleteRoles([role.name]));
    };
  }
}

export class RoleFixture {
  static create(): RoleFixtureBuilder {
    return new RoleFixtureBuilder();
  }
}

export async function activeRoleWithPermissions(
  { sysAdminActor, sysAdminPage, app }: { sysAdminActor?: WebActor; sysAdminPage: Page; app: App },
  use: (r: Role) => Promise<void>
) {
  const actor = sysAdminActor ?? WebActor.using('SysAdmin', sysAdminPage);
  const roleName = FakeDataFactory.createFakeRoleName();
  const role = new Role({ name: roleName, status: 'Active' });
  role.appPermissions.push(
    new AppPermission({
      appName: app.name,
      contentRecords: new Permission({ read: true }),
    })
  );

  await actor.attemptsTo(RoleTasks.create(role));
  await use(role);
  await actor.attemptsTo(RoleTasks.deleteRoles([roleName]));
}

// Legacy helper for un-migrated tests
export async function createRoleFixture(
  {
    sysAdminActor,
    sysAdminPage,
    roleStatus,
    appPermissions,
  }: { sysAdminActor?: WebActor; sysAdminPage: Page; roleStatus: RoleStatus; appPermissions: AppPermission[] },
  use: (r: Role) => Promise<void>
) {
  const actor = sysAdminActor ?? WebActor.using('SysAdmin', sysAdminPage);
  const role = await createRoleWithActor(actor, roleStatus, appPermissions);
  await use(role);
  await actor.attemptsTo(RoleTasks.deleteRoles([role.name]));
}

export async function createRoleWithActor(
  actor: WebActor,
  roleStatus: RoleStatus,
  appPermissions: AppPermission[]
): Promise<Role> {
  const roleName = FakeDataFactory.createFakeRoleName();
  const role = new Role({
    name: roleName,
    status: roleStatus,
    appPermissions: appPermissions,
  });

  await actor.attemptsTo(RoleTasks.create(role));
  return role;
}

export async function createRole(sysAdminPage: Page, roleStatus: RoleStatus, appPermissions: AppPermission[]) {
  const actor = WebActor.using('SysAdmin', sysAdminPage);
  return createRoleWithActor(actor, roleStatus, appPermissions);
}
