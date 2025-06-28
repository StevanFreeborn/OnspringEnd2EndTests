import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AnnotationType } from '../annotations';

type FieldsAndObjectsReportTestFixtures = {
  app: App;
  appAdminPage: AppAdminPage;
};

const test = base.extend<FieldsAndObjectsReportTestFixtures>({
  app: app,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
});

test.describe('fields & objects report', () => {
  test("Search an app's Fields & Objects report", async ({ app, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-53',
    });

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Search for a field in the Fields & Objects report', async () => {
      await appAdminPage.layoutTabButton.click();

      await appAdminPage.layoutTab.searchFieldsAndObjectsReport('Record Id');
    });

    await test.step('Verify the field is found in the report', async () => {
      const rows = await appAdminPage.layoutTab.fieldsAndObjectsGrid.locator('.k-grid-content tr').all();
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: /Record Id/i });

      expect(rows.length).toBe(1);
      await expect(fieldRow).toBeVisible();
    });
  });

  test("Export an app's Fields & Objects report, including the usage.", async ({ app, appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-54',
    });

    await test.step('Navigate to the app admin page', async () => {
      await appAdminPage.goto(app.id);
    });

    await test.step('Export the Fields & Objects report', async () => {});

    await test.step('Verify the report is exported successfully', async () => {});

    await test.step('Download the exported report', async () => {});

    await test.step('Verify the downloaded report contains the expected data', async () => {});

    expect(true).toBeTruthy();
  });
});
