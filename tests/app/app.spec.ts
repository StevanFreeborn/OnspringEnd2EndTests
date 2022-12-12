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
        const dashboardPage = new DashboardPage(page);

        await loginPage.login(user);
        await dashboardPage.page.waitForLoadState();
        await dashboardPage.sharedNavPage.adminGearIcon.click();
    });

    test('Create an app via the create button on the header of on the admin home page', async ({ page }) => {
        const adminHomePage = new AdminHomePage(page);
        const createAppDialogComponent = new CreateAppDialogComponent(page);
        const createAppModalComponent = new CreateAppModalComponent(page);
        const appName = FakeDataFactory.createFakeAppName();
        const appAdminPage = new AppAdminPage(page);
        
        await adminHomePage.page.waitForLoadState();
        await adminHomePage.sharedAdminNavPage.adminCreateButton.hover();
        await adminHomePage.sharedAdminNavPage.adminCreateMenu.waitFor();
        await adminHomePage.sharedAdminNavPage.appCreateMenuOption.click();
        await createAppDialogComponent.continueButton.click();
        await createAppModalComponent.nameInput.click();
        await createAppModalComponent.nameInput.type(appName);
        await createAppModalComponent.saveButton.click();

        await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
        await expect(appAdminPage.appName).toHaveText(appName);
    });

    test('Create an app via the create button on the Apps tile on the admin home page', async ({ page }) => {
        const adminHomePage = new AdminHomePage(page);
        const createAppDialogComponent = new CreateAppDialogComponent(page);
        const createAppModalComponent = new CreateAppModalComponent(page);
        const appName = FakeDataFactory.createFakeAppName();
        const appAdminPage = new AppAdminPage(page);

        await adminHomePage.page.waitForLoadState();
        await adminHomePage.appTileLink.hover();
        await adminHomePage.appTileCreateButton.waitFor();
        await adminHomePage.appTileCreateButton.click();
        await createAppDialogComponent.continueButton.click();
        await createAppModalComponent.nameInput.click();
        await createAppModalComponent.nameInput.type(appName);
        await createAppModalComponent.saveButton.click();

        await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
        await expect(appAdminPage.appName).toHaveText(appName);
    });

    test('Create an app via the "Create App" button on the Apps admin page', async ({ page }) => {
        const adminHomePage = new AdminHomePage(page);
        const appsAdminPage = new AppsAdminPage(page);
        const createAppDialogComponent = new CreateAppDialogComponent(page);
        const createAppModalComponent = new CreateAppModalComponent(page);
        const appAdminPage = new AppAdminPage(page);
        const appName = FakeDataFactory.createFakeAppName();

        await adminHomePage.appTileLink.click();
        await appsAdminPage.page.waitForLoadState();
        await appsAdminPage.createAppButton.click();
        await createAppDialogComponent.continueButton.click();
        await createAppModalComponent.nameInput.click();
        await createAppModalComponent.nameInput.type(appName);
        await createAppModalComponent.saveButton.click();

        await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
        await expect(appAdminPage.appName).toHaveText(appName);
    });

    test('Create a copy of an app via the create button on the header of the admin home page.', async ({ page }) => {
        const adminHomePage = new AdminHomePage(page);
        const createAppDialogComponent = new CreateAppDialogComponent(page);
        const createAppModalComponent = new CreateAppModalComponent(page);
        const appAdminPage = new AppAdminPage(page);
        const appName = FakeDataFactory.createFakeAppName();
        const expectedAppCopyName = `${appName} (1)`;

        await adminHomePage.page.waitForLoadState();
        await adminHomePage.sharedAdminNavPage.adminCreateButton.hover();
        await adminHomePage.sharedAdminNavPage.adminCreateMenu.waitFor();
        await adminHomePage.sharedAdminNavPage.appCreateMenuOption.click();
        await createAppDialogComponent.continueButton.click();
        await createAppModalComponent.nameInput.click();
        await createAppModalComponent.nameInput.type(appName);
        await createAppModalComponent.saveButton.click();
        await appAdminPage.sharedNavPage.adminGearIcon.click();
        await adminHomePage.page.waitForLoadState();
        await adminHomePage.sharedAdminNavPage.adminCreateButton.hover();
        await adminHomePage.sharedAdminNavPage.adminCreateMenu.waitFor();
        await adminHomePage.sharedAdminNavPage.appCreateMenuOption.click();
        await createAppDialogComponent.copyFromRadioButton.click();
        await createAppDialogComponent.selectAnAppDropdown.click();
        await createAppDialogComponent.appToCopy(appName).click();
        await createAppDialogComponent.continueButton.click();
        
        expect(await createAppModalComponent.nameInput.inputValue()).toBe(expectedAppCopyName);
        
        await createAppModalComponent.saveButton.click();

        await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
        await expect(appAdminPage.appName).toHaveText(expectedAppCopyName);
    })

    test('Create a copy of an app via the create button on the Apps tile on the admin home page.', async ({ page }) => {
        const adminHomePage = new AdminHomePage(page);
        const createAppDialogComponent = new CreateAppDialogComponent(page);
        const createAppModalComponent = new CreateAppModalComponent(page);
        const appAdminPage = new AppAdminPage(page);
        const appName = FakeDataFactory.createFakeAppName();
        const expectedAppCopyName = `${appName} (1)`;

        await adminHomePage.page.waitForLoadState();
        await adminHomePage.appTileLink.hover();
        await adminHomePage.appTileCreateButton.waitFor();
        await adminHomePage.appTileCreateButton.click();
        await createAppDialogComponent.continueButton.click();
        await createAppModalComponent.nameInput.click();
        await createAppModalComponent.nameInput.type(appName);
        await createAppModalComponent.saveButton.click();
        await appAdminPage.sharedNavPage.adminGearIcon.click();
        await adminHomePage.page.waitForLoadState();
        await adminHomePage.appTileLink.hover();
        await adminHomePage.appTileCreateButton.waitFor();
        await adminHomePage.appTileCreateButton.click();
        await createAppDialogComponent.copyFromRadioButton.click();
        await createAppDialogComponent.selectAnAppDropdown.click();
        await createAppDialogComponent.appToCopy(appName).click();
        await createAppDialogComponent.continueButton.click();

        expect(await createAppModalComponent.nameInput.inputValue()).toBe(expectedAppCopyName);
        
        await createAppModalComponent.saveButton.click();

        await expect(appAdminPage.page).toHaveURL(appAdminPage.pathRegex);
        await expect(appAdminPage.appName).toHaveText(expectedAppCopyName);
    })
});