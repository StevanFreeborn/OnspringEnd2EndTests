import { Page } from '@playwright/test';
import { App, AppPermission, FakeDataFactory, Permission, Role, RoleStatus } from '@stevanfreeborn/onspring-models';
import { RoleTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export class RoleFixtureBuilder<TDeps extends { sysAdminActor: WebActor } = { sysAdminActor: WebActor }> {
  private name?: string;
  private status: RoleStatus = 'Active';
  private appPermissions: AppPermission[] = [];
  private appPermissionsFactory?: (deps: { app: App }) => AppPermission[];

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withStatus(status: RoleStatus): this {
    this.status = status;
    return this;
  }

  withAppPermissions(permissions: AppPermission[]): this;
  withAppPermissions(factory: (deps: { app: App }) => AppPermission[]): RoleFixtureBuilder<TDeps & { app: App }>;
  withAppPermissions(
    permissionsOrFactory: AppPermission[] | ((deps: { app: App }) => AppPermission[])
  ): this | RoleFixtureBuilder<TDeps & { app: App }> {
    if (Array.isArray(permissionsOrFactory)) {
      this.appPermissions.push(...permissionsOrFactory);
      return this;
    }

    this.appPermissionsFactory = permissionsOrFactory;
    return this as unknown as RoleFixtureBuilder<TDeps & { app: App }>;
  }

  private async runFixture(
    sysAdminActor: WebActor,
    appPermissions: AppPermission[],
    use: (role: Role) => Promise<void>
  ): Promise<void> {
    const role = new Role({
      name: this.name ?? FakeDataFactory.createFakeRoleName(),
      status: this.status,
      appPermissions,
    });

    await sysAdminActor.attemptsTo(RoleTasks.create(role));
    try {
      await use(role);
    } finally {
      await sysAdminActor.attemptsTo(RoleTasks.deleteRoles([role.name]));
    }
  }

  build(): (deps: TDeps, use: (role: Role) => Promise<void>) => Promise<void> {
    const appPermissionsFactory = this.appPermissionsFactory;

    if (appPermissionsFactory) {
      return (async (
        { sysAdminActor, app }: { sysAdminActor: WebActor; app: App },
        use: (role: Role) => Promise<void>
      ) => {
        await this.runFixture(sysAdminActor, [...this.appPermissions, ...appPermissionsFactory({ app })], use);
      }) as unknown as (deps: TDeps, use: (role: Role) => Promise<void>) => Promise<void>;
    }

    return (async ({ sysAdminActor }: { sysAdminActor: WebActor }, use: (role: Role) => Promise<void>) => {
      await this.runFixture(sysAdminActor, [...this.appPermissions], use);
    }) as (deps: TDeps, use: (role: Role) => Promise<void>) => Promise<void>;
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
