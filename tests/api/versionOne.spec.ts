/* eslint-disable playwright/no-conditional-expect */
/* eslint-disable playwright/no-conditional-in-test */
import { APIRequestContext, expect, test } from '../../fixtures';
import {
  ApiSetupResult,
  createRequestContext,
  performApiTestCleanup,
  performApiTestsSetup,
} from '../../fixtures/api.fixtures';

test.describe('API v1', () => {
  test.describe.configure({
    mode: 'default',
  });

  let setup: ApiSetupResult;
  let request: APIRequestContext;

  test.beforeAll(async ({ sysAdminPage, useCachedApiSetup }) => {
    setup = await performApiTestsSetup({ sysAdminPage, useCache: useCachedApiSetup });
  });

  test.beforeEach(async ({ apiURL }) => {
    request = await createRequestContext(apiURL, setup.apiKey.key);
  });

  test.afterEach(async () => {
    await request.dispose();
  });

  test.afterAll(async ({ sysAdminPage, useCachedApiSetup }) => {
    await performApiTestCleanup({ sysAdminPage, setup, useCache: useCachedApiSetup });
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
        for (const prop of expectedFieldProperties) {
          expect(field).toHaveProperty(prop.name, prop.value);
        }

        // list field
        if (field.Type === 400) {
          expect(field).toHaveProperty('Multiplicity', expect.any(Number));

          const values = field.Values;

          expect(Array.isArray(values)).toBe(true);

          for (const value of values) {
            for (const prop of expectedListValueProperties) {
              if (value[prop.name] === null) {
                continue;
              }

              expect(value).toHaveProperty(prop.name, prop.value);
            }
          }
        }

        // reference field
        if (field.Type === 500) {
          expect(field).toHaveProperty('Multiplicity', expect.any(Number));
        }

        // formula field
        if (field.Type === 900) {
          expect(field).toHaveProperty('OutputType', expect.any(Number));

          const values = field.Values;

          expect(Array.isArray(values)).toBe(true);

          for (const value of values) {
            for (const prop of expectedListValueProperties) {
              if (value[prop.name] === null) {
                continue;
              }

              expect(value).toHaveProperty(prop.name, prop.value);
            }
          }
        }
      }
    });
  });

  test.describe('Get Field By Field Id', () => {
    test('it should return 200 status code', async () => {
      const response = await request.get(`/v1/fields/${setup.fields.statusField.id}`);
      expect(response.status()).toBe(200);
    });

    test('it should return expected data structure', async () => {
      const response = await request.get(`/v1/fields/${setup.fields.statusField.id}`);
      const body = await response.json();

      for (const prop of expectedFieldProperties) {
        expect(body).toHaveProperty(prop.name, prop.value);
      }

      const values = body.Values;

      expect(Array.isArray(values)).toBe(true);

      for (const value of values) {
        for (const prop of expectedListValueProperties) {
          if (value[prop.name] === null) {
            continue;
          }

          expect(value).toHaveProperty(prop.name, prop.value);
        }
      }
    });
  });
});

const expectedFieldProperties = [
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

const expectedListValueProperties = [
  {
    name: 'Id',
    value: expect.any(String),
  },
  {
    name: 'Name',
    value: expect.any(String),
  },
  {
    name: 'SortOrder',
    value: expect.any(Number),
  },
  {
    name: 'NumericValue',
    value: expect.any(Number),
  },
  {
    name: 'Color',
    value: expect.any(String),
  },
];
