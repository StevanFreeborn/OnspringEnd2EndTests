import { Page } from '@playwright/test';
import { DashboardsAdminPage } from '../pageObjectModels/dashboards/dashboardsAdminPage';
import { Dashboard } from '../models/dashboard';

export async function createDashboardFixture(
  { sysAdminPage, dashboard }: { sysAdminPage: Page; dashboard: Dashboard },
  use: (r: Dashboard) => Promise<void>
) {
  const { dashboard: newDashboard, cleanup } = await createDashboard(sysAdminPage, dashboard);
  await use(newDashboard);
  await cleanup();
}

async function createDashboard(sysAdminPage: Page, dashboard: Dashboard) {
  const dashboardsAdminPage = new DashboardsAdminPage(sysAdminPage);

  await dashboardsAdminPage.goto();
  await dashboardsAdminPage.createDashboard(dashboard);
  await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
  await dashboardsAdminPage.dashboardDesigner.saveAndClose();

  async function cleanup() {
    await dashboardsAdminPage.goto();
    await dashboardsAdminPage.deleteDashboards([dashboard.name]);
  }

  return { dashboard, cleanup };
}
