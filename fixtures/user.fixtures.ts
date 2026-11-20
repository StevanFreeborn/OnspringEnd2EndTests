import { Browser, Page, TestInfo } from '@playwright/test';
import { FakeDataFactory, Role, User, UserStatus } from '@stevanfreeborn/onspring-models';
import { UserQuestions, UserTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import path from 'path';
import { Role as LegacyRole } from '../models/role';
import { LoginPage } from '../pageObjectModels/authentication/loginPage';
import { DashboardPage } from '../pageObjectModels/dashboards/dashboardPage';
import { AddUserAdminPage } from '../pageObjectModels/users/addUserAdminPage';
import { EditUserAdminPage } from '../pageObjectModels/users/editUserAdminPage';
import { UsersSecurityAdminPage } from '../pageObjectModels/users/usersSecurityAdminPage';
import { AUTH_DIR } from '../playwright.config';
import { errorResponseHandler, pageErrorHandler } from './auth.fixtures';

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

export async function activeUserWithRole(
  { browser, sysAdminPage, role }: { browser: Browser; sysAdminPage: Page; role: LegacyRole },
  use: (r: User) => Promise<void>,
  testInfo: TestInfo
) {
  const addUserAdminPage = new AddUserAdminPage(sysAdminPage);
  const editUserAdminPage = new EditUserAdminPage(sysAdminPage);
  const usersSecurityAdminPage = new UsersSecurityAdminPage(sysAdminPage);
  const user = FakeDataFactory.createFakeUser('Active');
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
  page.on('response', errorResponseHandler);
  page.on('pageerror', async error => await pageErrorHandler(error, testInfo));

  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  await loginPage.login(user);
  await loginPage.page.waitForURL(dashboardPage.path);

  const userAuthStoragePath = path.join(AUTH_DIR, `${user.username}.json`);
  await page.context().storageState({ path: userAuthStoragePath });
  await context.close();

  user.authStoragePath = userAuthStoragePath;

  await use(user);

  await usersSecurityAdminPage.deleteUsers([user.username]);
}

export async function createUserFixture(
  {
    browser,
    sysAdminPage,
    sysAdmin = false,
    userStatus,
    roles = [],
  }: { browser: Browser; sysAdminPage: Page; sysAdmin?: boolean; userStatus: UserStatus; roles?: string[] },
  use: (r: User) => Promise<void>,
  testInfo: TestInfo
) {
  const addUserAdminPage = new AddUserAdminPage(sysAdminPage);
  const editUserAdminPage = new EditUserAdminPage(sysAdminPage);
  const usersSecurityAdminPage = new UsersSecurityAdminPage(sysAdminPage);
  const user = FakeDataFactory.createFakeUser(userStatus, sysAdmin);
  user.roles.push(...roles);

  await addUserAdminPage.goto();
  await addUserAdminPage.addUser(user);
  await addUserAdminPage.page.waitForURL(editUserAdminPage.pathRegex);
  await editUserAdminPage.page.waitForLoadState();
  await editUserAdminPage.changePassword(user.password);
  await editUserAdminPage.saveUser();
  user.id = editUserAdminPage.getUserIdFromUrl();

  if (user.status === 'Active') {
    const userAuthStoragePath = await logUserIn({ browser, user, testInfo });
    user.authStoragePath = userAuthStoragePath;
  }

  await use(user);

  await usersSecurityAdminPage.deleteUsers([user.username]);
}

async function logUserIn({ browser, user, testInfo }: { browser: Browser; user: User; testInfo: TestInfo }) {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('response', errorResponseHandler);
  page.on('pageerror', async error => await pageErrorHandler(error, testInfo));
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  await loginPage.login(user);
  await loginPage.page.waitForURL(dashboardPage.path);

  const userAuthStoragePath = path.join(AUTH_DIR, `${user.username}.json`);
  await page.context().storageState({ path: userAuthStoragePath });
  await context.close();

  return userAuthStoragePath;
}
