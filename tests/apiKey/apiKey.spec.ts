import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { createRoleFixture } from '../../fixtures/role.fixures';
import { App } from '../../models/app';
import { AppPermission, Permission, Role } from '../../models/role';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { ApiKeyAdminPage } from '../../pageObjectModels/apiKeys/apiKeyAdminPage';
import { ApiKeysAdminPage } from '../../pageObjectModels/apiKeys/apiKeysAdminPage';
import { AnnotationType } from '../annotations';

type ApiKeyTestFixtures = {
  adminHomePage: AdminHomePage;
  apiKeysAdminPage: ApiKeysAdminPage;
  apiKeyAdminPage: ApiKeyAdminPage;
  app: App;
  role: Role;
};

const test = base.extend<ApiKeyTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    await use(adminHomePage);
  },
  apiKeysAdminPage: async ({ sysAdminPage }, use) => {
    const apiKeysAdminPage = new ApiKeysAdminPage(sysAdminPage);
    await use(apiKeysAdminPage);
  },
  apiKeyAdminPage: async ({ sysAdminPage }, use) => {
    const apiKeyAdminPage = new ApiKeyAdminPage(sysAdminPage);
    await use(apiKeyAdminPage);
  },
  app: app,
  role: async ({ sysAdminPage, app }, use) => {
    await createRoleFixture(
      {
        sysAdminPage,
        roleStatus: 'Active',
        appPermissions: [
          new AppPermission({
            appName: app.name,
            contentRecords: new Permission({ read: true }),
          }),
        ],
      },
      use
    );
  },
});

test.describe('API Key', () => {
  let apiKeysToDelete: string[] = [];

  test.beforeEach(async ({ adminHomePage }) => {
    await adminHomePage.goto();
  });

  test.afterEach(async ({ apiKeysAdminPage }) => {
    await apiKeysAdminPage.deleteApiKeys(apiKeysToDelete);
    apiKeysToDelete = [];
  });

  test('Create an API Key via the create button in the header of the admin home page', async ({
    adminHomePage,
    apiKeyAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-266',
    });

    const apiKeyName = FakeDataFactory.createFakeApiKeyName();
    apiKeysToDelete.push(apiKeyName);

    await test.step('Create the api key', async () => {
      await adminHomePage.createApiKeyUsingHeaderCreateButton(apiKeyName);
    });

    await test.step('Verify the api key was created correctly', async () => {
      await expect(apiKeyAdminPage.page).toHaveURL(apiKeyAdminPage.pathRegex);
      await expect(apiKeyAdminPage.generalTab.nameInput).toHaveValue(apiKeyName);
    });
  });

  test('Create an API Key via the create button on the Security tile on the admin home page', async ({
    adminHomePage,
    apiKeyAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-806',
    });

    const apiKeyName = FakeDataFactory.createFakeApiKeyName();
    apiKeysToDelete.push(apiKeyName);

    await test.step('Create the api key', async () => {
      await adminHomePage.createApiKeyUsingSecurityTileButton(apiKeyName);
    });

    await test.step('Verify the api key was created correctly', async () => {
      await expect(apiKeyAdminPage.page).toHaveURL(apiKeyAdminPage.pathRegex);
      await expect(apiKeyAdminPage.generalTab.nameInput).toHaveValue(apiKeyName);
    });
  });

  test('Create an API Key via the Create API Key button on the API key home page', async ({
    apiKeysAdminPage,
    apiKeyAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-267',
    });

    const apiKeyName = FakeDataFactory.createFakeApiKeyName();
    apiKeysToDelete.push(apiKeyName);

    await test.step('Navigate to the api key admin page', async () => {
      await apiKeysAdminPage.goto();
    });

    await test.step('Create the api key', async () => {
      await apiKeysAdminPage.createApiKey(apiKeyName);
    });

    await test.step('Verify the api key was created correctly', async () => {
      await expect(apiKeyAdminPage.page).toHaveURL(apiKeyAdminPage.pathRegex);
      await expect(apiKeyAdminPage.generalTab.nameInput).toHaveValue(apiKeyName);
    });
  });

  test('Create a copy of an API Key via the create button in the header of the admin home page', async ({
    adminHomePage,
    apiKeyAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-268',
    });

    const appName = FakeDataFactory.createFakeAppName();
    const apiKeyCopyName = FakeDataFactory.createFakeAppName();
    apiKeysToDelete.push(appName, apiKeyCopyName);

    await test.step('Create the api key to be copied', async () => {
      await adminHomePage.createApiKey(appName);
    });

    await test.step('Navigate back to admin home page', async () => {
      await apiKeyAdminPage.sidebar.adminGearIcon.click();
    });

    await test.step('Create the copy of the api key', async () => {
      await adminHomePage.page.waitForLoadState();
      await adminHomePage.adminNav.adminCreateButton.hover();

      await expect(adminHomePage.adminNav.adminCreateMenu).toBeVisible();

      await adminHomePage.adminNav.apiKeyCreateMenuOption.click();

      await expect(adminHomePage.createApiKeyDialog.copyFromRadioButton).toBeVisible();

      await adminHomePage.createApiKeyDialog.copyFromRadioButton.click();
      await adminHomePage.createApiKeyDialog.copyFromDropdown.click();
      await adminHomePage.createApiKeyDialog.getApiKeyToCopy(appName).click();
      await adminHomePage.createApiKeyDialog.nameInput.fill(apiKeyCopyName);
      await adminHomePage.createApiKeyDialog.saveButton.click();
    });

    await test.step('Verify the api key was created correctly', async () => {
      await expect(apiKeyAdminPage.page).toHaveURL(apiKeyAdminPage.pathRegex);
      await expect(apiKeyAdminPage.generalTab.nameInput).toHaveValue(apiKeyCopyName);
    });
  });

  test('Create a copy of an API Key via the create button on the Security tile on the admin home page', async ({
    adminHomePage,
    apiKeyAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-805',
    });

    const apiKeyName = FakeDataFactory.createFakeAppName();
    const apiKeyCopyName = FakeDataFactory.createFakeAppName();
    apiKeysToDelete.push(apiKeyName, apiKeyCopyName);

    await test.step('Create the api key to be copied', async () => {
      await adminHomePage.createApiKeyUsingSecurityTileButton(apiKeyName);
    });

    await test.step('Navigate back to admin home page', async () => {
      await apiKeyAdminPage.sidebar.adminGearIcon.click();
    });

    await test.step('Create the copy of the api key', async () => {
      await adminHomePage.page.waitForLoadState();
      await adminHomePage.securityTileLink.hover();

      await expect(adminHomePage.securityTileCreateButton).toBeVisible();

      await adminHomePage.securityTileCreateButton.click();

      await expect(adminHomePage.securityCreateMenu).toBeVisible();

      await adminHomePage.securityCreateMenu.getByText('API Key').click();
      await adminHomePage.createApiKeyDialog.copyFromRadioButton.click();
      await adminHomePage.createApiKeyDialog.copyFromDropdown.click();
      await adminHomePage.createApiKeyDialog.getApiKeyToCopy(apiKeyName).click();
      await adminHomePage.createApiKeyDialog.nameInput.fill(apiKeyCopyName);
      await adminHomePage.createApiKeyDialog.saveButton.click();
    });

    await test.step('Verify the app was created correctly', async () => {
      await expect(apiKeyAdminPage.page).toHaveURL(apiKeyAdminPage.pathRegex);
      await expect(apiKeyAdminPage.generalTab.nameInput).toHaveValue(apiKeyCopyName);
    });
  });

  test('Create a copy of an API Key via the Create API Key button on the Api Key home page', async ({
    apiKeysAdminPage,
    apiKeyAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-269',
    });

    const apiKeyName = FakeDataFactory.createFakeAppName();
    const apiKeyCopyName = FakeDataFactory.createFakeAppName();
    apiKeysToDelete.push(apiKeyName, apiKeyCopyName);

    await test.step('Navigate to the api key admin page', async () => {
      await apiKeysAdminPage.goto();
    });

    await test.step('Create the api key to be copied', async () => {
      await apiKeysAdminPage.createApiKey(apiKeyName);
      await apiKeysAdminPage.page.waitForURL(apiKeyAdminPage.pathRegex);
    });

    await test.step('Navigate back to api keys admin page', async () => {
      await apiKeysAdminPage.goto();
    });

    await test.step('Create the copy of the api key', async () => {
      await apiKeysAdminPage.createApiKeyButton.click();

      await expect(apiKeysAdminPage.createApiKeyDialog.copyFromRadioButton).toBeVisible();

      await apiKeysAdminPage.createApiKeyDialog.copyFromRadioButton.click();
      await apiKeysAdminPage.createApiKeyDialog.copyFromDropdown.click();
      await apiKeysAdminPage.createApiKeyDialog.getApiKeyToCopy(apiKeyName).click();
      await apiKeysAdminPage.createApiKeyDialog.nameInput.fill(apiKeyCopyName);
      await apiKeysAdminPage.createApiKeyDialog.saveButton.click();
    });

    await test.step('Verify the api key was created correctly', async () => {
      await expect(apiKeyAdminPage.page).toHaveURL(apiKeyAdminPage.pathRegex);
      await expect(apiKeyAdminPage.generalTab.nameInput).toHaveValue(apiKeyCopyName);
    });
  });

  test('Update an API Key', async ({ role, adminHomePage, apiKeyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-270',
    });

    const apiKeyName = FakeDataFactory.createFakeApiKeyName();
    const updatedName = `${apiKeyName} updated`;
    const updatedDescription = 'This is a description for the api key updated';
    apiKeysToDelete.push(apiKeyName);

    await test.step('Create the api key to be updated', async () => {
      await adminHomePage.createApiKey(apiKeyName);
    });

    await test.step('Update the api key', async () => {
      await apiKeyAdminPage.generalTab.nameInput.fill(updatedName);
      await apiKeyAdminPage.generalTab.descriptionEditor.fill(updatedDescription);
      await apiKeyAdminPage.generalTab.selectRole(role.name);
      await apiKeyAdminPage.save();
    });

    await test.step('Verify the api key was updated correctly', async () => {
      await apiKeyAdminPage.page.reload();
      await expect(apiKeyAdminPage.generalTab.nameInput).toHaveValue(updatedName);
      await expect(apiKeyAdminPage.generalTab.descriptionEditor).toHaveText(updatedDescription);
      await expect(apiKeyAdminPage.generalTab.roleSelect).toHaveText(role.name);
    });
  });

  test('Enable an API Key', async ({ app, role, adminHomePage, apiKeyAdminPage, request }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-272',
    });

    let apiKey = '';
    let baseUrl = '';
    const apiKeyName = FakeDataFactory.createFakeApiKeyName();
    apiKeysToDelete.push(apiKeyName);

    await test.step('Create the api key to be enabled', async () => {
      await adminHomePage.createApiKey(apiKeyName);
    });

    await test.step('Collect the base url and api key', async () => {
      await apiKeyAdminPage.devInfoTabButton.click();
      baseUrl = (await apiKeyAdminPage.devInfoTab.apiUrl.innerText()).trim();
      apiKey = (await apiKeyAdminPage.devInfoTab.apiKey.innerText()).trim();
    });

    await test.step('Assign the api key a role', async () => {
      await apiKeyAdminPage.generalTabButton.click();
      await apiKeyAdminPage.generalTab.selectRole(role.name);
    });

    await test.step('Disable the api key', async () => {
      await expect(apiKeyAdminPage.generalTab.statusSwitch).toHaveAttribute('aria-checked', 'true');
      await apiKeyAdminPage.generalTab.statusToggle.click();
      await expect(apiKeyAdminPage.generalTab.statusSwitch).toHaveAttribute('aria-checked', 'false');
      await apiKeyAdminPage.save();
    });

    await test.step('Verify the api key is disabled', async () => {
      const getAppResponse = await request.get(`${baseUrl}/apps/id/${app.id}`, { headers: { 'x-apikey': apiKey } });
      expect(getAppResponse.status()).toBe(401);
    });

    await test.step('Enable the api key', async () => {
      await expect(apiKeyAdminPage.generalTab.statusSwitch).toHaveAttribute('aria-checked', 'false');
      await apiKeyAdminPage.generalTab.statusToggle.click();
      await expect(apiKeyAdminPage.generalTab.statusSwitch).toHaveAttribute('aria-checked', 'true');
      await apiKeyAdminPage.save();
    });

    await test.step('Verify the api key was enabled', async () => {
      await apiKeyAdminPage.page.reload();
      const getAppResponse = await request.get(`${baseUrl}/apps/id/${app.id}`, { headers: { 'x-apikey': apiKey } });

      await expect(apiKeyAdminPage.generalTab.statusSwitch).toHaveAttribute('aria-checked', 'true');
      expect(getAppResponse.status()).toBe(200);
    });
  });

  test('Disable an API Key', async ({ app, role, adminHomePage, apiKeyAdminPage, request }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-271',
    });

    let apiKey = '';
    let baseUrl = '';
    const apiKeyName = FakeDataFactory.createFakeApiKeyName();
    apiKeysToDelete.push(apiKeyName);

    await test.step('Create the api key to be disabled', async () => {
      await adminHomePage.createApiKey(apiKeyName);
    });

    await test.step('Collect the base url and api key', async () => {
      await apiKeyAdminPage.devInfoTabButton.click();
      baseUrl = (await apiKeyAdminPage.devInfoTab.apiUrl.innerText()).trim();
      apiKey = (await apiKeyAdminPage.devInfoTab.apiKey.innerText()).trim();
    });

    await test.step('Assign the api key a role', async () => {
      await apiKeyAdminPage.generalTabButton.click();
      await apiKeyAdminPage.generalTab.selectRole(role.name);
      await apiKeyAdminPage.save();
    });

    await test.step('Verify the api key is enabled', async () => {
      await apiKeyAdminPage.page.reload();
      const getAppResponse = await request.get(`${baseUrl}/apps/id/${app.id}`, { headers: { 'x-apikey': apiKey } });

      await expect(apiKeyAdminPage.generalTab.statusSwitch).toHaveAttribute('aria-checked', 'true');
      expect(getAppResponse.status()).toBe(200);
    });

    await test.step('Disable the api key', async () => {
      await expect(apiKeyAdminPage.generalTab.statusSwitch).toHaveAttribute('aria-checked', 'true');
      await apiKeyAdminPage.generalTab.statusToggle.click();
      await expect(apiKeyAdminPage.generalTab.statusSwitch).toHaveAttribute('aria-checked', 'false');
      await apiKeyAdminPage.save();
    });

    await test.step('Verify the api key was disabled', async () => {
      await apiKeyAdminPage.page.reload();
      const getAppResponse = await request.get(`${baseUrl}/apps/id/${app.id}`, { headers: { 'x-apikey': apiKey } });

      await expect(apiKeyAdminPage.generalTab.statusSwitch).toHaveAttribute('aria-checked', 'false');
      expect(getAppResponse.status()).toBe(401);
    });
  });

  test('Delete an API Key', async ({ adminHomePage, apiKeysAdminPage, apiKeyAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-273',
    });

    const apiKeyName = FakeDataFactory.createFakeApiKeyName();
    const apiKeyRow = apiKeysAdminPage.apiKeyGrid.getByRole('row', { name: apiKeyName });
    const apiKeyDeleteButton = apiKeyRow.getByTitle('Delete API Key');

    await test.step('Create the api key to be deleted', async () => {
      await adminHomePage.createApiKey(apiKeyName);
      await adminHomePage.page.waitForURL(apiKeyAdminPage.pathRegex);
    });

    await test.step('Navigate to the api keys admin page', async () => {
      await apiKeysAdminPage.goto();
      await expect(apiKeyRow).toBeVisible();
    });

    await test.step('Delete the api key', async () => {
      await apiKeyRow.hover();
      await apiKeyDeleteButton.click();

      await expect(apiKeysAdminPage.deleteApiKeyDialog.deleteButton).toBeVisible();

      const deleteResponse = apiKeysAdminPage.page.waitForResponse(apiKeysAdminPage.deleteApiKeyPathRegex);
      await apiKeysAdminPage.deleteApiKeyDialog.deleteButton.click();
      await deleteResponse;
      await apiKeysAdminPage.deleteApiKeyDialog.waitForDialogToBeDismissed();
    });
    await test.step('Verify the api key was deleted correctly', async () => {
      await expect(apiKeyRow).not.toBeAttached();
    });
  });
});
