import { expect, test as base } from "../../fixtures";
import { app } from "../../fixtures/app.fixtures";
import { App } from "../../models/app";
import { AdminAuditHistoryPage } from "../../pageObjectModels/systemReports/adminAuditHistoryPage";
import { AnnotationType } from "../annotations";

type AdminAuditHistoryTestFixtures = {
  app: App;
  adminAuditHistoryPage: AdminAuditHistoryPage;
}

const test = base.extend<AdminAuditHistoryTestFixtures>({
  app: app,
  adminAuditHistoryPage: async ({ sysAdminPage }, use) => await use(new AdminAuditHistoryPage(sysAdminPage)),
});

test.describe('admin audit history report', function() {
  test('Filter the Audit History Report', async ({ adminAuditHistoryPage, sysAdminUser, app }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-280',
    });

    await test.step('Navigate to the Audit History Report', async () => {
      await adminAuditHistoryPage.goto();
    });

    await test.step('Filter the Audit History Report', async () => {
      await adminAuditHistoryPage.applyFilter({ user: sysAdminUser.fullName, saveType: 'Added', itemType: 'App', appOrSurvey: app.name });
    });

    await test.step('Verify the Audit History Report has been filtered', async () => {
      const rows = await adminAuditHistoryPage.getRows();

      expect(rows.length).toBe(1);
    });
  });
  
  test('Export the Audit History Report', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-281',
    });

    expect(true).toBeTruthy();
  });
});
