import { FakeDataFactory, Role, User, UserStatus } from '@stevanfreeborn/onspring-models';
import { UserQuestions, UserTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export class UserFixtureBuilder<TDeps extends { sysAdminActor: WebActor } = { sysAdminActor: WebActor }> {
  private status: UserStatus = 'Active';
  private sysAdmin: boolean = false;
  private roles: string[] = [];
  private rolesFactory?: (deps: { role: Role }) => string[];

  withStatus(status: UserStatus): this {
    this.status = status;
    return this;
  }

  withSysAdmin(sysAdmin: boolean): this {
    this.sysAdmin = sysAdmin;
    return this;
  }

  withRole(role: string): this {
    this.roles.push(role);
    return this;
  }

  withRoles(roles: string[]): this;
  withRoles(factory: (deps: { role: Role }) => string[]): UserFixtureBuilder<TDeps & { role: Role }>;
  withRoles(
    rolesOrFactory: string[] | ((deps: { role: Role }) => string[])
  ): this | UserFixtureBuilder<TDeps & { role: Role }> {
    if (Array.isArray(rolesOrFactory)) {
      this.roles.push(...rolesOrFactory);
      return this;
    }

    this.rolesFactory = rolesOrFactory;
    return this as unknown as UserFixtureBuilder<TDeps & { role: Role }>;
  }

  private async runFixture(
    sysAdminActor: WebActor,
    roles: string[],
    use: (user: User) => Promise<void>
  ): Promise<void> {
    const user = FakeDataFactory.createFakeUser(this.status, this.sysAdmin);
    user.roles.push(...roles);

    await sysAdminActor.attemptsTo(UserTasks.create(user), UserTasks.changePassword(user.password));
    user.id = await sysAdminActor.asks(UserQuestions.currentId());

    try {
      await use(user);
    } finally {
      await sysAdminActor.attemptsTo(UserTasks.deleteUsers([user.username]));
    }
  }

  build(): (deps: TDeps, use: (user: User) => Promise<void>) => Promise<void> {
    if (this.rolesFactory) {
      const rolesFactory = this.rolesFactory;
      return (async (
        { sysAdminActor, role }: { sysAdminActor: WebActor; role: Role },
        use: (user: User) => Promise<void>
      ) => {
        const dynamicRoles = rolesFactory({ role });
        await this.runFixture(sysAdminActor, [...this.roles, ...dynamicRoles], use);
      }) as unknown as (deps: TDeps, use: (user: User) => Promise<void>) => Promise<void>;
    }

    return (async ({ sysAdminActor }: { sysAdminActor: WebActor }, use: (user: User) => Promise<void>) => {
      await this.runFixture(sysAdminActor, [...this.roles], use);
    }) as (deps: TDeps, use: (user: User) => Promise<void>) => Promise<void>;
  }
}

export class UserFixture {
  static create(): UserFixtureBuilder {
    return new UserFixtureBuilder();
  }
}

export const user = UserFixture.create().build();
