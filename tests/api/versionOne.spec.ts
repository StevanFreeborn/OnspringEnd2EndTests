import { APIRequestContext, expect, test } from '../../fixtures';
import { ApiSetupResult, createRequestContext, performApiTestsSetup } from '../../fixtures/api.fixtures';
import { ApiKeysAdminPage } from '../../pageObjectModels/apiKeys/apiKeysAdminPage';
import { AppsAdminPage } from '../../pageObjectModels/apps/appsAdminPage';
import { RolesSecurityAdminPage } from '../../pageObjectModels/roles/rolesSecurityAdminPage';

test.describe('API v1', () => {
  test.describe.configure({
    mode: 'default',
  });

  let setup: ApiSetupResult;
  let request: APIRequestContext;

  test.beforeAll(async ({ sysAdminPage }) => {
    setup = await performApiTestsSetup({ sysAdminPage });
  });

  test.beforeEach(async ({ apiURL }) => {
    request = await createRequestContext(apiURL, setup.apiKey.key);
  });

  test.afterEach(async () => {
    await request.dispose();
  });

  test.afterAll(async ({ sysAdminPage }) => {
    await new ApiKeysAdminPage(sysAdminPage).deleteApiKeys([setup.apiKey.name]);
    await new AppsAdminPage(sysAdminPage).deleteApps([setup.app.name]);
    await new RolesSecurityAdminPage(sysAdminPage).deleteRoles([setup.role.name]);
  });

  test.describe('Ping', () => {
    test('it should return 204 status code', async () => {
      const response = await request.get('/v1/ping');
      expect(response.status()).toBe(204);
    });
  });

  test.describe('Get Apps', () => {
    test('it should return 200 status code', async () => {
      const response = await request.get('/v1/apps');
      expect(response.status()).toBe(200);
    });

    test('it should return expected data structure', async () => {
      const response = await request.get('/v1/apps');
      const body = await response.json();

      expect(Array.isArray(body)).toBe(true);

      for (const app of body) {
        const expectedProperties = [
          {
            name: 'Id',
            value: expect.any(Number),
          },
          {
            name: 'Name',
            value: expect.any(String),
          },
        ];

        for (const prop of expectedProperties) {
          expect(app).toHaveProperty(prop.name, prop.value);
        }
      }
    });
  });

  test.describe('Get Fields By AppId', () => {
    test('it should return 200 status code', async () => {
      const response = await request.get(`/v1/fields?appId=${setup.app.id}`);
      expect(response.status()).toBe(200);
    });

    test('it should return expected data structure', async () => {
      const response = await request.get(`/v1/fields?appId=${setup.app.id}`);
      const body = await response.json();

      expect(Array.isArray(body)).toBe(true);

      for (const field of body) {
        const expectedProperties = [
          {
            name: 'Id',
            value: expect.any(Number),
          },
          {
            name: 'AppId',
            value: expect.any(Number),
          },
          {
            name: 'IsRequired',
            value: expect.any(Boolean),
          },
          {
            name: 'IsUnique',
            value: expect.any(Boolean),
          },
          {
            name: 'Name',
            value: expect.any(String),
          },
          {
            name: 'Status',
            value: expect.any(Number),
          },
          {
            name: 'Type',
            value: expect.any(Number),
          },
        ];

        for (const prop of expectedProperties) {
          expect(field).toHaveProperty(prop.name, prop.value);
        }
      }
    });
  });

  test.describe('Get Field By Field Id', () => {});
});
