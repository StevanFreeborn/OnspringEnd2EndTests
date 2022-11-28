import { test, expect } from "@playwright/test";
import { CreateAppDialogComponent } from "../../componentObjectModels/createAppDialogComponent";
import { CreateAppModalComponent } from "../../componentObjectModels/createAppModalComponent";
import { FakeDataFactory } from "../../factories/fakeDataFactory";
import { UserFactory } from "../../factories/userFactory";
import { AdminHomePage } from "../../pageObjectModels/adminHomePage";
import { AppAdminPage } from "../../pageObjectModels/appAdminPage";
import { AppsAdminPage } from "../../pageObjectModels/appsAdminPage";
import { DashboardPage } from "../../pageObjectModels/DashboardPage";
import { LoginPage } from "../../pageObjectModels/loginPage";

test.describe('app', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const user = UserFactory.createSysAdminUser();
        await loginPage.login(user);

        const dashboardPage = new DashboardPage(page);
        await dashboardPage.sharedNavPage.clickAdminGearIcon();
    });

    test('Create an app via the create button on the header of on the admin home page', async ({ page }) => {
        const adminHomePage = new AdminHomePage(page);
        await adminHomePage.page.waitForLoadState();
        await adminHomePage.sharedAdminNavPage.adminCreateButton.hover();
        await adminHomePage.sharedAdminNavPage.adminCreateMenu.waitFor();
        await adminHomePage.sharedAdminNavPage.appCreateMenuOption.click();
        
        const createAppDialogComponent = new CreateAppDialogComponent(page);
        await createAppDialogComponent.continueButton.click();

        const createAppModalComponent = new CreateAppModalComponent(page);
        await createAppModalComponent.nameInput.click();

        const appName = FakeDataFactory.createFakeAppName();

        await createAppModalComponent.nameInput.type(appName);
        await createAppModalComponent.saveButton.click();

        const appAdminPage = new AppAdminPage(page);
        await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
        await expect(appAdminPage.appName).toHaveText(appName);
    });

    test('Create an app via the create button on the Apps tile on the admin home page', async ({ page }) => {
        const adminHomePage = new AdminHomePage(page);
        await adminHomePage.page.waitForLoadState();
        await adminHomePage.appTileLink.hover();
        await adminHomePage.appTileCreateButton.waitFor();
        await adminHomePage.appTileCreateButton.click();
        
        const createAppDialogComponent = new CreateAppDialogComponent(page);
        await createAppDialogComponent.continueButton.click();
        
        const createAppModalComponent = new CreateAppModalComponent(page);
        await createAppModalComponent.nameInput.click();

        const appName = FakeDataFactory.createFakeAppName();

        await createAppModalComponent.nameInput.type(appName);
        await createAppModalComponent.saveButton.click();

        const appAdminPage = new AppAdminPage(page);
        await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
        await expect(appAdminPage.appName).toHaveText(appName);
    });

    test('Create an app via the "Create App" button on the Apps admin page', async ({ page }) => {
        const adminHomePage = new AdminHomePage(page);
        await adminHomePage.appTileLink.click();

        const appsAdminPage = new AppsAdminPage(page);
        await appsAdminPage.page.waitForLoadState();
        await appsAdminPage.createAppButton.click();

        const createAppDialogComponent = new CreateAppDialogComponent(page);
        await createAppDialogComponent.continueButton.click();
        
        const createAppModalComponent = new CreateAppModalComponent(page);
        await createAppModalComponent.nameInput.click();

        const appName = FakeDataFactory.createFakeAppName();

        await createAppModalComponent.nameInput.type(appName);
        await createAppModalComponent.saveButton.click();

        const appAdminPage = new AppAdminPage(page);
        await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
        await expect(appAdminPage.appName).toHaveText(appName);
    });
});