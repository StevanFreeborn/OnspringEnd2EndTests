import test, { expect } from "@playwright/test";
import { FakeDataFactory } from "../../factories/fakeDataFactory";
import { UserFactory } from "../../factories/userFactory";
import { AdminHomePage } from "../../pageObjectModels/adminHomePage";
import { DashboardPage } from "../../pageObjectModels/DashboardPage";
import { LoginPage } from "../../pageObjectModels/loginPage";

test.describe('app', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const user = UserFactory.createSysAdminUser();
        await loginPage.login(user);
    });

    test('Create an app via the create button on the header of on the admin home page', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.sharedNavPage.clickAdminGearIcon();

        const adminHomePage = new AdminHomePage(page);
        await adminHomePage.sharedAdminNavPage.adminCreateButton.hover();
        await adminHomePage.sharedAdminNavPage.appCreateMenuOption.click();
        await adminHomePage.sharedAdminNavPage.createDialogContinueButton.click();
        await adminHomePage.sharedAdminNavPage.nameInput.click();

        const appName = FakeDataFactory.createFakeAppName();

        await adminHomePage.sharedAdminNavPage.nameInput.type(appName);
        await adminHomePage.sharedAdminNavPage.saveButton.click();
    });
});