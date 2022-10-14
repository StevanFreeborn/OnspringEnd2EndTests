import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pageObjectModels/loginPage';
import { UserFactory } from '../../factories/userFactory';
import { DashboardPage } from '../../pageObjectModels/DashboardPage';

test.describe('', () => {
    test('user can login using valid username and password.', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);
        const user = UserFactory.createSysAdminUser();

        await loginPage.goto();
        await loginPage.enterUsername(user.username);
        await loginPage.enterPassword(user.password);
        await loginPage.clickLoginButton();
        await expect(dashboardPage.page).toHaveURL(/.*Dashboard/);
        await expect(dashboardPage.usersFullName).toHaveText(user.fullName);
    });

    // test('user cannot login using invalid username.', async ({ page }) => {
    // });

    // test('user cannot login using invalid password.', async ({ page }) => {
    // });

    // test('user cannot login using invalid username and password.', async ({ page }) => {
    // });
});