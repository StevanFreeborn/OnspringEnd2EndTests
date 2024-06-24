import { test as base, expect } from '../../fixtures';
import { performApiTestsSetup } from '../../fixtures/api.fixtures';
import { App } from '../../models/app';
import { LayoutItem } from '../../models/layoutItem';

type APIv1TestFixtures = {
  setupResult: { app: App; fields: LayoutItem[] };
};

const test = base.extend<APIv1TestFixtures>({
  setupResult: async ({ sysAdminPage }, use) => performApiTestsSetup({ sysAdminPage }, use),
});

test.describe('API v1', () => {
  test('performs setup', ({ setupResult }) => {
    expect(setupResult.fields).toBeDefined();
  });
});
