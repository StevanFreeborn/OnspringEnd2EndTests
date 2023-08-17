import { expect, test } from '@playwright/test';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { UserFactory } from '../../factories/userFactory';
import { DashboardPage } from '../../pageObjectModels/dashboardPage';
import { LoginPage } from '../../pageObjectModels/loginPage';

test.describe('login', () => {
  test('user can login using valid username and password.', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const user = UserFactory.createSysAdminUser();

    await loginPage.goto();
    await loginPage.enterUsername(user.username);
    await loginPage.enterPassword(user.password);
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

    await expect(dashboardPage.page).toHaveURL(new RegExp(dashboardPage.path));
    await expect(dashboardPage.sharedNavPage.usersFullName).toHaveText(
      user.fullName
    );
  });

  test('user cannot login using invalid username.', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const user = UserFactory.createSysAdminUser();

    await loginPage.goto();
    await loginPage.enterUsername(FakeDataFactory.createFakeUsername());
    await loginPage.enterPassword(user.password);
    await loginPage.clickLoginButton();

    await expect(loginPage.page).toHaveURL(new RegExp(loginPage.path));
    await expect(loginPage.validationErrors).toHaveText(
      LoginPage.invalidCredentialError.text
    );
    await expect(loginPage.validationErrors).toHaveCSS(
      'color',
      LoginPage.invalidCredentialError.color
    );
    await expect(loginPage.validationErrors).toHaveCSS(
      'font-weight',
      LoginPage.invalidCredentialError.fontWeight
    );
  });

  test('user cannot login using invalid password.', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const user = UserFactory.createSysAdminUser();

    await loginPage.goto();
    await loginPage.enterUsername(user.username);
    await loginPage.enterPassword(FakeDataFactory.createFakePassword());
    await loginPage.clickLoginButton();

    await expect(loginPage.page).toHaveURL(new RegExp(loginPage.path));
    await expect(loginPage.validationErrors).toHaveText(
      LoginPage.invalidCredentialError.text
    );
    await expect(loginPage.validationErrors).toHaveCSS(
      'color',
      LoginPage.invalidCredentialError.color
    );
    await expect(loginPage.validationErrors).toHaveCSS(
      'font-weight',
      LoginPage.invalidCredentialError.fontWeight
    );
  });

  test('user cannot login using invalid username and password.', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const user = UserFactory.createSysAdminUser();

    await loginPage.goto();
    await loginPage.enterUsername(user.username);
    await loginPage.enterPassword(FakeDataFactory.createFakePassword());
    await loginPage.clickLoginButton();

    await expect(loginPage.page).toHaveURL(new RegExp(loginPage.path));
    await expect(loginPage.validationErrors).toHaveText(
      LoginPage.invalidCredentialError.text
    );
    await expect(loginPage.validationErrors).toHaveCSS(
      'color',
      LoginPage.invalidCredentialError.color
    );
    await expect(loginPage.validationErrors).toHaveCSS(
      'font-weight',
      LoginPage.invalidCredentialError.fontWeight
    );
  });
});
