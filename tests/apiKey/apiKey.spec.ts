import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { ApiKeyAdminPage } from '../../pageObjectModels/apiKeys/apiKeyAdminPage';
import { ApiKeysAdminPage } from '../../pageObjectModels/apiKeys/apiKeysAdminPage';
import { AnnotationType } from '../annotations';

type ApiKeyTestFixtures = {
  adminHomePage: AdminHomePage;
  apiKeysAdminPage: ApiKeysAdminPage;
  apiKeyAdminPage: ApiKeyAdminPage;
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

  test('Create an API Key via the create button on the Security tile on the admin home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-806',
    });

    // TODO: Implement this test
    expect(true).toBeFalsy();
  });

  test('Create an API Key via the Create API Key button on the Api Key home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-267',
    });

    // TODO: Implement this test
    expect(true).toBeFalsy();
  });

  test('Create a copy of an API Key via the create button in the header of the admin home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-268',
    });

    // TODO: Implement this test
    expect(true).toBeFalsy();
  });

  test('Create a copy of an API Key via the create button on the Security tile on the admin home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-805',
    });

    // TODO: Implement this test
    expect(true).toBeFalsy();
  });

  test('Create a copy of an API Key via the Create API Key button on the Api Key home page', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-269',
    });

    // TODO: Implement this test
    expect(true).toBeFalsy();
  });

  test('Update an API Key', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-270',
    });

    // TODO: Implement this test
    expect(true).toBeFalsy();
  });

  test('Enable an API Key', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-272',
    });

    // TODO: Implement this test
    expect(true).toBeFalsy();
  });

  test('Disable an API Key', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-271',
    });

    // TODO: Implement this test
    expect(true).toBeFalsy();
  });

  test('Delete an API Key', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-273',
    });

    // TODO: Implement this test
    expect(true).toBeFalsy();
  });
});
