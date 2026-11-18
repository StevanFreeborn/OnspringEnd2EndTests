import { Locator, Page } from '@playwright/test';

export const LoginPageTargets = {
  route: '/Public/Login',
  pathRegex: /\/Public\/Login/,
  usernameInput: (page: Page): Locator => page.locator('#UserName'),
  passwordInput: (page: Page): Locator => page.locator('#Password'),
  loginButton: (page: Page): Locator => page.getByRole('button', { name: 'Login' }),
  validationErrors: (page: Page): Locator => page.locator('.validation-summary-errors'),
  invalidCredentialErrorMessage: 'Username/Password combination is not valid',
  invalidCredentialErrorColor: 'rgb(231, 76, 60)',
  invalidCredentialErrorFontWeight: '700',
};

export const DashboardTargets = {
  route: '/Dashboard',
  pathRegex: /\/Dashboard/,
  usersFullName: (page: Page): Locator => page.locator('#user-name'),
  dashboardsTab: (page: Page): Locator => page.locator('#dashboard-tab'),
  contentTab: (page: Page): Locator => page.locator('#content-tab'),
  adminGearIcon: (page: Page): Locator => page.locator('#admin-tab'),
  pinnedContent: (page: Page): Locator => page.locator('#pinned-items'),
  userImage: (page: Page): Locator => page.locator('#user-image'),
};
