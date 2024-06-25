import { APIRequestContext, expect, test } from '../../fixtures';
import { ApiSetupResult, createRequestContext, performApiTestsSetup } from '../../fixtures/api.fixtures';

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

  test.afterEach(async () => await request.dispose());

  test('performs setup', async () => {
    const res = await request.get('/apps');
    expect(res.status()).toBe(200);
  });
});
