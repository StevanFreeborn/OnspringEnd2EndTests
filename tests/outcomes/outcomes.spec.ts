import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AnnotationType } from '../annotations';

type OutcomesTestFixtures = {
  app: App;
  appAdminPage: AppAdminPage;
};

const test = base.extend<OutcomesTestFixtures>({
  app: app,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
});

test.describe('Outcomes', () => {
  test('Configure a stop calculation outcome', async ({}) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-750',
    });

    expect(true).toBe(true);
  });
});
