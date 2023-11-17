import { Page, test as base, expect } from '@playwright/test';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { UserFactory } from '../../factories/userFactory';
import { errorResponseHandler } from '../../fixtures/auth.fixtures';
import { LoginPage } from '../../pageObjectModels/authentication/loginPage';
import { DashboardPage } from '../../pageObjectModels/dashboards/dashboardPage';

type LoginTestFixtures = {
  page: Page;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

const test = base.extend<LoginTestFixtures>({
  page: async ({ page }, use) => {
    page.on('response', errorResponseHandler);
    await use(page);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
});

test.describe('login', () => {
  test('user can login using valid username and password.', async ({ loginPage, dashboardPage }) => {
    const user = UserFactory.createSysAdminUser();

    await test.step('Navigate to login page.', async () => {
      await loginPage.goto();
    });

    await test.step('Enter username and password.', async () => {
      await loginPage.enterUsername(user.username);
      await loginPage.enterPassword(user.password);
    });

    await test.step('Click login button.', async () => {
      await loginPage.clickLoginButton();
      // Login will fail randomly across different browsers
      // when initially inputting correct password. Almost
      // as if the password gets cleared right before posting
      // the login form.
      // TODO: Re-evaluate
      const currentUrl = loginPage.page.url();

      // eslint-disable-next-line playwright/no-conditional-in-test
      if (currentUrl.includes(loginPage.path)) {
        await loginPage.enterPassword(user.password);
        await loginPage.clickLoginButton();
      }
    });

    await test.step('Verify user is logged in.', async () => {
      await expect(dashboardPage.page).toHaveURL(new RegExp(dashboardPage.path));
      await expect(dashboardPage.sidebar.usersFullName).toHaveText(user.fullName);
    });
  });

  test('user cannot login using invalid username.', async ({ loginPage }) => {
    const user = UserFactory.createSysAdminUser();
    const fakeUsername = FakeDataFactory.createFakeUsername();

    await test.step('Navigate to login page.', async () => {
      await loginPage.goto();
    });

    await test.step('Enter username and password.', async () => {
      await loginPage.enterUsername(fakeUsername);
      await loginPage.enterPassword(user.password);
    });

    await test.step('Click login button.', async () => {
      await loginPage.clickLoginButton();
    });

    await test.step('Verify user is not logged in.', async () => {
      await expect(loginPage.page).toHaveURL(new RegExp(loginPage.path));
      await expect(loginPage.validationErrors).toHaveText(LoginPage.invalidCredentialError.text);
      await expect(loginPage.validationErrors).toHaveCSS('color', LoginPage.invalidCredentialError.color);
      await expect(loginPage.validationErrors).toHaveCSS('font-weight', LoginPage.invalidCredentialError.fontWeight);
    });
  });

  test('user cannot login using invalid password.', async ({ loginPage }) => {
    const user = UserFactory.createSysAdminUser();
    const fakePassword = FakeDataFactory.createFakePassword();

    await test.step('Navigate to login page.', async () => {
      await loginPage.goto();
    });

    await test.step('Enter username and password.', async () => {
      await loginPage.enterUsername(user.username);
      await loginPage.enterPassword(fakePassword);
    });

    await test.step('Click login button.', async () => {
      await loginPage.clickLoginButton();
    });

    await test.step('Verify user is not logged in.', async () => {
      await expect(loginPage.page).toHaveURL(new RegExp(loginPage.path));
      await expect(loginPage.validationErrors).toHaveText(LoginPage.invalidCredentialError.text);
      await expect(loginPage.validationErrors).toHaveCSS('color', LoginPage.invalidCredentialError.color);
      await expect(loginPage.validationErrors).toHaveCSS('font-weight', LoginPage.invalidCredentialError.fontWeight);
    });
  });

  test('user cannot login using invalid username and password.', async ({ loginPage }) => {
    const fakeUsername = FakeDataFactory.createFakeUsername();
    const fakePassword = FakeDataFactory.createFakePassword();

    await test.step('Navigate to login page.', async () => {
      await loginPage.goto();
    });

    await test.step('Enter username and password.', async () => {
      await loginPage.enterUsername(fakeUsername);
      await loginPage.enterPassword(fakePassword);
    });

    await test.step('Click login button.', async () => {
      await loginPage.clickLoginButton();
    });

    await test.step('Verify user is not logged in.', async () => {
      await expect(loginPage.page).toHaveURL(new RegExp(loginPage.path));
      await expect(loginPage.validationErrors).toHaveText(LoginPage.invalidCredentialError.text);
      await expect(loginPage.validationErrors).toHaveCSS('color', LoginPage.invalidCredentialError.color);
      await expect(loginPage.validationErrors).toHaveCSS('font-weight', LoginPage.invalidCredentialError.fontWeight);
    });
  });
});
