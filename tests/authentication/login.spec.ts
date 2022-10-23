import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pageObjectModels/loginPage';
import { UserFactory } from '../../factories/userFactory';
import { DashboardPage } from '../../pageObjectModels/DashboardPage';
import { FakeDataFactory } from '../../factories/fakeDataFactory';

test.describe('login', () => {
    test('user can login using valid username and password.', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);
        const user = UserFactory.createSysAdminUser();

        await loginPage.goto();
        await loginPage.enterUsername(user.username);
        await loginPage.enterPassword(user.password);
        await loginPage.clickLoginButton();

        await expect(dashboardPage.page).toHaveURL(process.env.INSTANCE_URL + dashboardPage.path);
        await expect(dashboardPage.sharedNavPage.usersFullName).toHaveText(user.fullName);
    });

    test('user cannot login using invalid username.', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const user = UserFactory.createSysAdminUser();

        await loginPage.goto();
        await loginPage.enterUsername(FakeDataFactory.createFakeUsername());
        await loginPage.enterPassword(user.password);
        await loginPage.clickLoginButton();

        await expect(loginPage.page).toHaveURL(process.env.INSTANCE_URL + loginPage.path);
        await expect(loginPage.validationErrors).toHaveText(LoginPage.invalidCredentialError.text);
        await expect(loginPage.validationErrors).toHaveCSS('color', LoginPage.invalidCredentialError.color);
        await expect(loginPage.validationErrors).toHaveCSS('font-weight', LoginPage.invalidCredentialError.fontWeight)
    });

    test('user cannot login using invalid password.', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const user = UserFactory.createSysAdminUser();

        await loginPage.goto();
        await loginPage.enterUsername(user.username);
        await loginPage.enterPassword(FakeDataFactory.createFakePassword());
        await loginPage.clickLoginButton();

        await expect(loginPage.page).toHaveURL(process.env.INSTANCE_URL + loginPage.path);
        await expect(loginPage.validationErrors).toHaveText(LoginPage.invalidCredentialError.text);
        await expect(loginPage.validationErrors).toHaveCSS('color', LoginPage.invalidCredentialError.color);
        await expect(loginPage.validationErrors).toHaveCSS('font-weight', LoginPage.invalidCredentialError.fontWeight)
    });

    test('user cannot login using invalid username and password.', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const user = UserFactory.createSysAdminUser();

        await loginPage.goto();
        await loginPage.enterUsername(user.username);
        await loginPage.enterPassword(FakeDataFactory.createFakePassword());
        await loginPage.clickLoginButton();

        await expect(loginPage.page).toHaveURL(process.env.INSTANCE_URL + loginPage.path);
        await expect(loginPage.validationErrors).toHaveText(LoginPage.invalidCredentialError.text);
        await expect(loginPage.validationErrors).toHaveCSS('color', LoginPage.invalidCredentialError.color);
        await expect(loginPage.validationErrors).toHaveCSS('font-weight', LoginPage.invalidCredentialError.fontWeight)
    });
});