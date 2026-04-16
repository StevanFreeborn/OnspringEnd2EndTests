import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { createContainerFixture } from '../../fixtures/container.fixtures';
import { createDashboardFixture } from '../../fixtures/dashboard.fixtures';
import { createReportFixture } from '../../fixtures/report.fixtures';
import { App } from '../../models/app';
import { Container } from '../../models/container';
import { Report, SavedReportAsReportDataOnly } from '../../models/report';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { DashboardPage } from '../../pageObjectModels/dashboards/dashboardPage';
import { DashboardsAdminPage } from '../../pageObjectModels/dashboards/dashboardsAdminPage';
import { AnnotationType } from '../annotations';
import { Dashboard } from './../../models/dashboard';

type DashboardFilterTestFixtures = {
  sourceApp: App;
  report: Report;
  container: Container;
  dashboard: Dashboard;
  adminHomePage: AdminHomePage;
  dashboardsAdminPage: DashboardsAdminPage;
  dashboardPage: DashboardPage;
};

const test = base.extend<DashboardFilterTestFixtures>({
  sourceApp: app,
  report: async ({ sysAdminPage, sourceApp }, use) =>
    await createReportFixture(
      {
        sysAdminPage,
        app: sourceApp,
        report: new SavedReportAsReportDataOnly({
          name: FakeDataFactory.createFakeReportName(),
          appName: sourceApp.name,
          security: 'Public',
        }),
      },
      use
    ),
  container: async ({ sysAdminPage }, use) => await createContainerFixture({ sysAdminPage }, use),
  dashboard: async ({ sysAdminPage, container, report }, use) =>
    await createDashboardFixture(
      {
        sysAdminPage,
        dashboard: new Dashboard({
          name: FakeDataFactory.createFakeDashboardName(),
          containers: [container.name],
          items: [
            {
              item: report,
              row: 0,
              column: 0,
            },
          ],
        }),
      },
      use
    ),
  adminHomePage: async ({ sysAdminPage }, use) => await use(new AdminHomePage(sysAdminPage)),
  dashboardsAdminPage: async ({ sysAdminPage }, use) => await use(new DashboardsAdminPage(sysAdminPage)),
  dashboardPage: async ({ sysAdminPage }, use) => await use(new DashboardPage(sysAdminPage)),
});

test.describe('dashboard filter', () => {
  test('Enable dashboard filters', async ({ dashboard, dashboardPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-751',
    });

    await test.step('Navigate to the dashboard', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Enable dashboard filters', async () => {
      await dashboardPage.toggleDashboardFilters();
    });

    await test.step('Verify filter bar is present', async () => {
      await expect(dashboardPage.dashboardFilterBar).toBeVisible();
    });
  });
});
