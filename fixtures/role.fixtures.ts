import {
  AdminReportPermission,
  App,
  AppPermission,
  FakeDataFactory,
  Role,
  RoleStatus,
} from '@stevanfreeborn/onspring-models';
import { RoleTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export class RoleFixtureBuilder<TDeps extends { sysAdminActor: WebActor } = { sysAdminActor: WebActor }> {
  private name?: string;
  private status: RoleStatus = 'Active';
  private appPermissions: AppPermission[] = [];
  private adminReportPermissions: AdminReportPermission[] = [];
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

  withAdminReportPermissions(permissions: AdminReportPermission[]): this {
    this.adminReportPermissions.push(...permissions);
    return this;
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
      adminReportPermissions: [...this.adminReportPermissions],
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
