import { APIRequestContext, test as base, expect } from '../../fixtures';
import { ApiSetupResult, createApiSetupFixture, createRequestContextFixture } from '../../fixtures/api.fixtures';

type VersionOneTestFixtures = {
  request: APIRequestContext;
};

type VersionOneWorkerFixtures = {
  setup: ApiSetupResult;
};

const test = base.extend<VersionOneTestFixtures, VersionOneWorkerFixtures>({
  setup: [async ({}, use) => await createApiSetupFixture(use), { scope: 'worker' }],
  request: async ({ apiURL, setup }, use) => await createRequestContextFixture({ apiUrl: apiURL, setup }, use),
});

test.describe('API v2', () => {
  test.describe('Ping', () => {
    test('it should return 200 status code', async ({ request }) => {
      const response = await request.get('ping');
      expect(response.status()).toBe(200);
    });
  });

  test.describe('Get Apps', () => {
    test('it should return expected status code and data structure', async ({ request }) => {
      const response = await request.get('apps');

      expect(response.status()).toBe(200);

      const body = await response.json();

      for (const property of expectedPaginationProperties) {
        expect(body).toHaveProperty(property.name, property.value);
      }

      for (const item of body.items) {
        for (const property of expectedAppProperties) {
          expect(item).toHaveProperty(property.name, property.value);
        }
      }
    });
  });
});

const expectedAppProperties = [
  {
    name: 'id',
    value: expect.any(Number),
  },
  {
    name: 'href',
    value: expect.any(String),
  },
  {
    name: 'name',
    value: expect.any(String),
  },
];

const expectedPaginationProperties = [
  {
    name: 'pageNumber',
    value: expect.any(Number),
  },
  {
    name: 'pageSize',
    value: expect.any(Number),
  },
  {
    name: 'totalPages',
    value: expect.any(Number),
  },
  {
    name: 'totalRecords',
    value: expect.any(Number),
  },
  {
    name: 'items',
    value: expect.any(Array),
  },
];
