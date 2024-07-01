import { Browser, Page } from '@playwright/test';
import path from 'path';
import { UserFactory } from '../factories/userFactory';
import { Role } from '../models/role';
import { User, UserStatus } from '../models/user';
import { LoginPage } from '../pageObjectModels/authentication/loginPage';
import { DashboardPage } from '../pageObjectModels/dashboards/dashboardPage';
import { AddUserAdminPage } from '../pageObjectModels/users/addUserAdminPage';
import { EditUserAdminPage } from '../pageObjectModels/users/editUserAdminPage';
import { UsersSecurityAdminPage } from '../pageObjectModels/users/usersSecurityAdminPage';
import { AUTH_DIR } from '../playwright.config';
import { errorResponseHandler } from './auth.fixtures';

export async function activeUserWithRole(
  { browser, sysAdminPage, role }: { browser: Browser; sysAdminPage: Page; role: Role },
  use: (r: User) => Promise<void>
) {
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
  page.on('response', errorResponseHandler);

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
  use: (r: User) => Promise<void>
) {
  const addUserAdminPage = new AddUserAdminPage(sysAdminPage);
  const editUserAdminPage = new EditUserAdminPage(sysAdminPage);
  const usersSecurityAdminPage = new UsersSecurityAdminPage(sysAdminPage);
  const user = UserFactory.createNewUser(userStatus, sysAdmin);
  user.roles.push(...roles);

  await addUserAdminPage.goto();
  await addUserAdminPage.addUser(user);
  await addUserAdminPage.page.waitForURL(editUserAdminPage.pathRegex);
  await editUserAdminPage.page.waitForLoadState();
  await editUserAdminPage.changePassword(user.password);
  await editUserAdminPage.saveUser();
  user.id = editUserAdminPage.getUserIdFromUrl();

  const userAuthStoragePath = await logUserIn({ browser, user });
  user.authStoragePath = userAuthStoragePath;

  await use(user);

  await usersSecurityAdminPage.deleteUsers([user.username]);
}

async function logUserIn({ browser, user }: { browser: Browser; user: User }) {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('response', errorResponseHandler);

  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  await loginPage.login(user);
  await loginPage.page.waitForURL(dashboardPage.path);

  const userAuthStoragePath = path.join(AUTH_DIR, `${user.username}.json`);
  await page.context().storageState({ path: userAuthStoragePath });
  await context.close();

  return userAuthStoragePath;
}
