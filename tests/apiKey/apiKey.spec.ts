import {
  ApiKeyDetailTargets,
  ApiKeysPageTargets,
  ApiKeyTasks,
  DeleteDialogTargets,
  SidebarNavTargets,
} from '@stevanfreeborn/onspring-ui';
import '@stevanfreeborn/screenplay-playwright';
import { App, AppPermission, FakeDataFactory, Permission, Role } from '@stevanfreeborn/onspring-models';
import { AppFixture, RoleFixture, test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type ApiKeyTestFixtures = {
  app: App;
  role: Role;
};

const test = base.extend<ApiKeyTestFixtures>({
  app: AppFixture.create().build(),
  role: RoleFixture.create()
    .withStatus('Active')
    .withAppPermissions(({ app }) => [
      new AppPermission({
        appName: app!.name,
        contentRecords: new Permission({ read: true }),
      }),
    ])
    .build(),
});

test.describe('API Key', () => {
  let apiKeysToDelete: string[] = [];

  test.beforeEach(async ({ sysAdminActor }) => {
    await sysAdminActor.browse().goto('/Admin/Home');
  });

  test.afterEach(async ({ sysAdminActor }) => {
    await sysAdminActor.attemptsTo(ApiKeyTasks.deleteKeys(apiKeysToDelete));
    apiKeysToDelete = [];
  });

  test('Create an API Key via the create button in the header of the admin home page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-266',
    });

    const apiKeyName = FakeDataFactory.createFakeApiKeyName();
    apiKeysToDelete.push(apiKeyName);

    await test.step('Create the api key', async () => {
      await sysAdminActor.attemptsTo(ApiKeyTasks.createViaHeader(apiKeyName));
    });

    await test.step('Verify the api key was created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(ApiKeyDetailTargets.pathRegex);
      await sysAdminActor.browse().check(ApiKeyDetailTargets.generalTab.nameInput).hasValue(apiKeyName);
    });
  });

  test('Create an API Key via the create button on the Security tile on the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-806',
    });

    const apiKeyName = FakeDataFactory.createFakeApiKeyName();
    apiKeysToDelete.push(apiKeyName);

    await test.step('Create the api key', async () => {
      await sysAdminActor.attemptsTo(ApiKeyTasks.createViaSecurityTile(apiKeyName));
    });

    await test.step('Verify the api key was created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(ApiKeyDetailTargets.pathRegex);
      await sysAdminActor.browse().check(ApiKeyDetailTargets.generalTab.nameInput).hasValue(apiKeyName);
    });
  });

  test('Create an API Key via the Create API Key button on the API key home page', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-267',
    });

    const apiKeyName = FakeDataFactory.createFakeApiKeyName();
    apiKeysToDelete.push(apiKeyName);

    await test.step('Navigate to the api key admin page', async () => {
      await sysAdminActor.attemptsTo(ApiKeyTasks.gotoGrid());
    });

    await test.step('Create the api key', async () => {
      await sysAdminActor.attemptsTo(ApiKeyTasks.createFromGrid(apiKeyName));
    });

    await test.step('Verify the api key was created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(ApiKeyDetailTargets.pathRegex);
      await sysAdminActor.browse().check(ApiKeyDetailTargets.generalTab.nameInput).hasValue(apiKeyName);
    });
  });

  test('Create a copy of an API Key via the create button in the header of the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-268',
    });

    const appName = FakeDataFactory.createFakeAppName();
    const apiKeyCopyName = FakeDataFactory.createFakeAppName();
    apiKeysToDelete.push(appName, apiKeyCopyName);

    await test.step('Create the api key to be copied', async () => {
      await sysAdminActor.attemptsTo(ApiKeyTasks.createViaHeader(appName));
      await sysAdminActor.browse().checkPage().hasUrl(ApiKeyDetailTargets.pathRegex);
    });

    await test.step('Navigate back to admin home page', async () => {
      await sysAdminActor.browse().click(SidebarNavTargets.adminGearIcon);
    });

    await test.step('Create the copy of the api key', async () => {
      await sysAdminActor.attemptsTo(ApiKeyTasks.copyViaHeader(appName, apiKeyCopyName));
    });

    await test.step('Verify the api key was created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(ApiKeyDetailTargets.pathRegex);
      await sysAdminActor.browse().check(ApiKeyDetailTargets.generalTab.nameInput).hasValue(apiKeyCopyName);
    });
  });

  test('Create a copy of an API Key via the create button on the Security tile on the admin home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-805',
    });

    const apiKeyName = FakeDataFactory.createFakeAppName();
    const apiKeyCopyName = FakeDataFactory.createFakeAppName();
    apiKeysToDelete.push(apiKeyName, apiKeyCopyName);

    await test.step('Create the api key to be copied', async () => {
      await sysAdminActor.attemptsTo(ApiKeyTasks.createViaSecurityTile(apiKeyName));
      await sysAdminActor.browse().checkPage().hasUrl(ApiKeyDetailTargets.pathRegex);
    });

    await test.step('Navigate back to admin home page', async () => {
      await sysAdminActor.browse().click(SidebarNavTargets.adminGearIcon);
    });

    await test.step('Create the copy of the api key', async () => {
      await sysAdminActor.attemptsTo(ApiKeyTasks.copyViaSecurityTile(apiKeyName, apiKeyCopyName));
    });

    await test.step('Verify the app was created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(ApiKeyDetailTargets.pathRegex);
      await sysAdminActor.browse().check(ApiKeyDetailTargets.generalTab.nameInput).hasValue(apiKeyCopyName);
    });
  });

  test('Create a copy of an API Key via the Create API Key button on the Api Key home page', async ({
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-269',
    });

    const apiKeyName = FakeDataFactory.createFakeAppName();
    const apiKeyCopyName = FakeDataFactory.createFakeAppName();
    apiKeysToDelete.push(apiKeyName, apiKeyCopyName);

    await test.step('Navigate to the api key admin page', async () => {
      await sysAdminActor.attemptsTo(ApiKeyTasks.gotoGrid());
    });

    await test.step('Create the api key to be copied', async () => {
      await sysAdminActor.attemptsTo(ApiKeyTasks.createFromGrid(apiKeyName));
      await sysAdminActor.browse().checkPage().hasUrl(ApiKeyDetailTargets.pathRegex);
    });

    await test.step('Navigate back to api keys admin page', async () => {
      await sysAdminActor.attemptsTo(ApiKeyTasks.gotoGrid());
    });

    await test.step('Create the copy of the api key', async () => {
      await sysAdminActor.attemptsTo(ApiKeyTasks.copyFromGrid(apiKeyName, apiKeyCopyName));
    });

    await test.step('Verify the api key was created correctly', async () => {
      await sysAdminActor.browse().checkPage().hasUrl(ApiKeyDetailTargets.pathRegex);
      await sysAdminActor.browse().check(ApiKeyDetailTargets.generalTab.nameInput).hasValue(apiKeyCopyName);
    });
  });

  test('Update an API Key', async ({ role, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-270',
    });

    const apiKeyName = FakeDataFactory.createFakeApiKeyName();
    const updatedName = `${apiKeyName} updated`;
    const updatedDescription = 'This is a description for the api key updated';
    apiKeysToDelete.push(apiKeyName);

    await test.step('Create the api key to be updated', async () => {
      await sysAdminActor.attemptsTo(ApiKeyTasks.createViaHeader(apiKeyName));
      await sysAdminActor.browse().checkPage().hasUrl(ApiKeyDetailTargets.pathRegex);
    });

    await test.step('Update the api key', async () => {
      await sysAdminActor.browse().type(ApiKeyDetailTargets.generalTab.nameInput, updatedName);
      await sysAdminActor.browse().type(ApiKeyDetailTargets.generalTab.descriptionEditor, updatedDescription);
      await sysAdminActor.attemptsTo(ApiKeyTasks.assignRole(role.name), ApiKeyTasks.save());
    });

    await test.step('Verify the api key was updated correctly', async () => {
      await sysAdminActor.browse().reload();
      await sysAdminActor.browse().check(ApiKeyDetailTargets.generalTab.nameInput).hasValue(updatedName);
      await sysAdminActor.browse().check(ApiKeyDetailTargets.generalTab.descriptionEditor).hasText(updatedDescription);
      await sysAdminActor.browse().check(ApiKeyDetailTargets.generalTab.roleSelect).hasText(role.name);
    });
  });

  test('Enable an API Key', async ({ app, role, sysAdminActor, request }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-272',
    });

    let apiKey = '';
    let baseUrl = '';
    const apiKeyName = FakeDataFactory.createFakeApiKeyName();
    apiKeysToDelete.push(apiKeyName);

    await test.step('Create the api key to be enabled', async () => {
      await sysAdminActor.attemptsTo(ApiKeyTasks.createViaHeader(apiKeyName));
      await sysAdminActor.browse().checkPage().hasUrl(ApiKeyDetailTargets.pathRegex);
    });

    await test.step('Collect the base url and api key', async () => {
      await sysAdminActor.browse().click(ApiKeyDetailTargets.devInfoTabButton);
      baseUrl = await sysAdminActor.browse().getText(ApiKeyDetailTargets.devInfoTab.apiUrl);
      apiKey = await sysAdminActor.browse().getText(ApiKeyDetailTargets.devInfoTab.apiKey);
    });

    await test.step('Assign the api key a role', async () => {
      await sysAdminActor.attemptsTo(ApiKeyTasks.assignRole(role.name));
    });

    await test.step('Disable the api key', async () => {
      await sysAdminActor
        .browse()
        .check(ApiKeyDetailTargets.generalTab.statusSwitch)
        .hasAttribute('aria-checked', 'true');
      await sysAdminActor.attemptsTo(ApiKeyTasks.toggleStatus(), ApiKeyTasks.save());
      await sysAdminActor
        .browse()
        .check(ApiKeyDetailTargets.generalTab.statusSwitch)
        .hasAttribute('aria-checked', 'false');
    });

    await test.step('Verify the api key is disabled', async () => {
      const getAppResponse = await request.get(`${baseUrl}/apps/id/${app.id}`, { headers: { 'x-apikey': apiKey } });
      expect(getAppResponse.status()).toBe(401);
    });

    await test.step('Enable the api key', async () => {
      await sysAdminActor
        .browse()
        .check(ApiKeyDetailTargets.generalTab.statusSwitch)
        .hasAttribute('aria-checked', 'false');
      await sysAdminActor.attemptsTo(ApiKeyTasks.toggleStatus(), ApiKeyTasks.save());
      await sysAdminActor
        .browse()
        .check(ApiKeyDetailTargets.generalTab.statusSwitch)
        .hasAttribute('aria-checked', 'true');
    });

    await test.step('Verify the api key was enabled', async () => {
      await sysAdminActor.browse().reload();
      const getAppResponse = await request.get(`${baseUrl}/apps/id/${app.id}`, { headers: { 'x-apikey': apiKey } });

      await sysAdminActor
        .browse()
        .check(ApiKeyDetailTargets.generalTab.statusSwitch)
        .hasAttribute('aria-checked', 'true');
      expect(getAppResponse.status()).toBe(200);
    });
  });

  test('Disable an API Key', async ({ app, role, sysAdminActor, request }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-271',
    });

    let apiKey = '';
    let baseUrl = '';
    const apiKeyName = FakeDataFactory.createFakeApiKeyName();
    apiKeysToDelete.push(apiKeyName);

    await test.step('Create the api key to be disabled', async () => {
      await sysAdminActor.attemptsTo(ApiKeyTasks.createViaHeader(apiKeyName));
      await sysAdminActor.browse().checkPage().hasUrl(ApiKeyDetailTargets.pathRegex);
    });

    await test.step('Collect the base url and api key', async () => {
      await sysAdminActor.browse().click(ApiKeyDetailTargets.devInfoTabButton);
      baseUrl = await sysAdminActor.browse().getText(ApiKeyDetailTargets.devInfoTab.apiUrl);
      apiKey = await sysAdminActor.browse().getText(ApiKeyDetailTargets.devInfoTab.apiKey);
    });

    await test.step('Assign the api key a role', async () => {
      await sysAdminActor.attemptsTo(ApiKeyTasks.assignRole(role.name), ApiKeyTasks.save());
    });

    await test.step('Verify the api key is enabled', async () => {
      await sysAdminActor.browse().reload();
      const getAppResponse = await request.get(`${baseUrl}/apps/id/${app.id}`, { headers: { 'x-apikey': apiKey } });

      await sysAdminActor
        .browse()
        .check(ApiKeyDetailTargets.generalTab.statusSwitch)
        .hasAttribute('aria-checked', 'true');
      expect(getAppResponse.status()).toBe(200);
    });

    await test.step('Disable the api key', async () => {
      await sysAdminActor
        .browse()
        .check(ApiKeyDetailTargets.generalTab.statusSwitch)
        .hasAttribute('aria-checked', 'true');
      await sysAdminActor.attemptsTo(ApiKeyTasks.toggleStatus(), ApiKeyTasks.save());
      await sysAdminActor
        .browse()
        .check(ApiKeyDetailTargets.generalTab.statusSwitch)
        .hasAttribute('aria-checked', 'false');
    });

    await test.step('Verify the api key was disabled', async () => {
      await sysAdminActor.browse().reload();
      const getAppResponse = await request.get(`${baseUrl}/apps/id/${app.id}`, { headers: { 'x-apikey': apiKey } });

      await sysAdminActor
        .browse()
        .check(ApiKeyDetailTargets.generalTab.statusSwitch)
        .hasAttribute('aria-checked', 'false');
      expect(getAppResponse.status()).toBe(401);
    });
  });

  test('Delete an API Key', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-273',
    });

    const apiKeyName = FakeDataFactory.createFakeApiKeyName();

    await test.step('Create the api key to be deleted', async () => {
      await sysAdminActor.attemptsTo(ApiKeyTasks.createViaHeader(apiKeyName));
      await sysAdminActor.browse().checkPage().hasUrl(ApiKeyDetailTargets.pathRegex);
    });

    await test.step('Navigate to the api keys admin page', async () => {
      await sysAdminActor.attemptsTo(ApiKeyTasks.gotoGrid());
      await sysAdminActor.browse().check(ApiKeysPageTargets.rowByName(apiKeyName)).isVisible();
    });

    await test.step('Delete the api key', async () => {
      const apiKeyRow = ApiKeysPageTargets.rowByName(apiKeyName);
      await sysAdminActor.browse().hover(apiKeyRow);
      await sysAdminActor.browse().click(ApiKeysPageTargets.deleteButtonInRow(apiKeyName));
      await sysAdminActor.browse().check(DeleteDialogTargets.deleteButton).isVisible();

      const deleteResponse = sysAdminActor.page.waitForResponse(ApiKeysPageTargets.deleteApiKeyPathRegex);
      await sysAdminActor.browse().click(DeleteDialogTargets.deleteButton);
      await deleteResponse;
      await sysAdminActor.browse().waitForDetached(DeleteDialogTargets.dialog, DeleteDialogTargets.overlay);
    });

    await test.step('Verify the api key was deleted correctly', async () => {
      await sysAdminActor.browse().check(ApiKeysPageTargets.rowByName(apiKeyName)).isNotAttached();
    });
  });
});
