import { Page } from '@playwright/test';
import { Dashboard as ScreenplayDashboard, FakeDataFactory } from '@stevanfreeborn/onspring-models';
import { DashboardQuestions, DashboardTasks } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DashboardsAdminPage } from '../pageObjectModels/dashboards/dashboardsAdminPage';
import { Dashboard } from '../models/dashboard';

export class DashboardFixtureBuilder {
  private name?: string;
  private configure?: (dashboard: ScreenplayDashboard) => void;

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withConfiguration(configure: (dashboard: ScreenplayDashboard) => void): this {
    this.configure = configure;
    return this;
  }

  build() {
    return async (
      { sysAdminActor }: { sysAdminActor: WebActor },
      use: (dashboard: ScreenplayDashboard) => Promise<void>
    ) => {
      const dashboard = new ScreenplayDashboard({
        name: this.name ?? FakeDataFactory.createFakeDashboardName(),
      });

      if (this.configure) {
        this.configure(dashboard);
      }

      await sysAdminActor.attemptsTo(
        DashboardTasks.gotoAdminPage(),
        DashboardTasks.createFromAdminPage(dashboard.name)
      );
      dashboard.id = await sysAdminActor.asks(DashboardQuestions.designerDashboardId());
      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());

      try {
        await use(dashboard);
      } finally {
        await sysAdminActor.attemptsTo(DashboardTasks.deleteDashboards([dashboard.name]));
      }
    };
  }
}

export class DashboardFixture {
  static create(): DashboardFixtureBuilder {
    return new DashboardFixtureBuilder();
  }
}

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
