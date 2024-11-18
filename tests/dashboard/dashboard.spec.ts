import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { createContainerFixture } from '../../fixtures/container.fixtures';
import { createReportFixture } from '../../fixtures/report.fixtures';
import { App } from '../../models/app';
import { Container } from '../../models/container';
import { Dashboard } from '../../models/dashboard';
import { Report, SavedReportAsReportDataOnly } from '../../models/report';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { DashboardPage } from '../../pageObjectModels/dashboards/dashboardPage';
import { DashboardsAdminPage } from '../../pageObjectModels/dashboards/dashboardsAdminPage';
import { AnnotationType } from '../annotations';

type DashboardTestFixtures = {
  adminHomePage: AdminHomePage;
  dashboardsAdminPage: DashboardsAdminPage;
  sourceApp: App;
  report: Report;
  container: Container;
  dashboardPage: DashboardPage;
};

const test = base.extend<DashboardTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => await use(new AdminHomePage(sysAdminPage)),
  dashboardsAdminPage: async ({ sysAdminPage }, use) => await use(new DashboardsAdminPage(sysAdminPage)),
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
  dashboardPage: async ({ sysAdminPage }, use) => await use(new DashboardPage(sysAdminPage)),
});

test.describe('dashboard', () => {
  let dashboardsToDelete: string[] = [];

  test.beforeEach(async ({ adminHomePage }) => {
    await adminHomePage.goto();
  });

  test.afterEach(async ({ dashboardsAdminPage }) => {
    await dashboardsAdminPage.deleteDashboards(dashboardsToDelete);
    dashboardsToDelete = [];
  });

  test('Create a Dashboard via the create button in the header of the admin home page', async ({ adminHomePage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-316',
    });

    const dashboardName = FakeDataFactory.createFakeDashboardName();
    dashboardsToDelete.push(dashboardName);

    await test.step('Create the dashboard', async () => {
      await adminHomePage.createDashboardUsingHeaderCreateButton(dashboardName);
      await adminHomePage.dashboardDesigner.waitFor();
    });

    await test.step('Verify the dashboard was created correctly', async () => {
      await expect(adminHomePage.dashboardDesigner.title).toHaveText(dashboardName);
    });
  });

  test('Create a Dashboard via the create button on the Dashboards tile on the admin home page', async ({
    adminHomePage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-317',
    });

    const dashboardName = FakeDataFactory.createFakeDashboardName();
    dashboardsToDelete.push(dashboardName);

    await test.step('Create the dashboard', async () => {
      await adminHomePage.createDashboardUsingDashboardsTileButton(dashboardName);
      await adminHomePage.dashboardDesigner.waitFor();
    });

    await test.step('Verify the dashboard was created correctly', async () => {
      await expect(adminHomePage.dashboardDesigner.title).toHaveText(dashboardName);
    });
  });

  test('Create a Dashboard via the "Create Dashboard" button on the Dashboards home page', async ({
    dashboardsAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-318',
    });

    const dashboard = new Dashboard({ name: FakeDataFactory.createFakeDashboardName() });
    dashboardsToDelete.push(dashboard.name);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard', async () => {
      await dashboardsAdminPage.createDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.waitFor();
    });

    await test.step('Verify the dashboard was created correctly', async () => {
      await expect(dashboardsAdminPage.dashboardDesigner.title).toHaveText(dashboard.name);
    });
  });

  test('Create a copy of a Dashboard via the create button in the header of the admin home page', async ({
    adminHomePage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-319',
    });

    const dashboardToCopyName = FakeDataFactory.createFakeDashboardName();
    const dashboardCopyName = FakeDataFactory.createFakeDashboardName();
    dashboardsToDelete.push(dashboardToCopyName, dashboardCopyName);

    await test.step('Create the dashboard to copy', async () => {
      await adminHomePage.createDashboardUsingHeaderCreateButton(dashboardToCopyName);
      await adminHomePage.dashboardDesigner.close();
    });

    await test.step('Create the copy of the dashboard', async () => {
      await adminHomePage.createDashboardCopyUsingHeaderCreateButton(dashboardToCopyName, dashboardCopyName);
      await adminHomePage.dashboardDesigner.waitFor();
    });

    await test.step('Verify the dashboard was copied correctly', async () => {
      await expect(adminHomePage.dashboardDesigner.title).toHaveText(dashboardCopyName);
    });
  });

  test('Create a copy of a Dashboard via the create button on the Dashboards tile on the admin home page', async ({
    adminHomePage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-320',
    });

    const dashboardToCopyName = FakeDataFactory.createFakeDashboardName();
    const dashboardCopyName = FakeDataFactory.createFakeDashboardName();
    dashboardsToDelete.push(dashboardToCopyName, dashboardCopyName);

    await test.step('Create the dashboard to copy', async () => {
      await adminHomePage.createDashboardUsingDashboardsTileButton(dashboardToCopyName);
      await adminHomePage.dashboardDesigner.close();
    });

    await test.step('Create the copy of the dashboard', async () => {
      await adminHomePage.createDashboardCopyUsingDashboardsTileButton(dashboardToCopyName, dashboardCopyName);
      await adminHomePage.dashboardDesigner.waitFor();
    });

    await test.step('Verify the dashboard was copied correctly', async () => {
      await expect(adminHomePage.dashboardDesigner.title).toHaveText(dashboardCopyName);
    });
  });

  test('Create a copy of a Dashboard via the "Create Dashboard" button on the Dashboards home page', async ({
    dashboardsAdminPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-321',
    });

    const dashboardToCopy = new Dashboard({ name: FakeDataFactory.createFakeDashboardName() });
    const dashboardCopyName = FakeDataFactory.createFakeAppName();
    dashboardsToDelete.push(dashboardToCopy.name, dashboardCopyName);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard to copy', async () => {
      await dashboardsAdminPage.createDashboard(dashboardToCopy);
      await dashboardsAdminPage.dashboardDesigner.close();
    });

    await test.step('Create the copy of the dashboard', async () => {
      await dashboardsAdminPage.createDashboardCopy(dashboardToCopy.name, dashboardCopyName);
      await dashboardsAdminPage.dashboardDesigner.waitFor();
    });

    await test.step('Verify the dashboard was copied correctly', async () => {
      await expect(dashboardsAdminPage.dashboardDesigner.title).toHaveText(dashboardCopyName);
    });
  });

  test('Update a dashboard', async ({ dashboardsAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-322',
    });

    const dashboard = new Dashboard({ name: FakeDataFactory.createFakeDashboardName() });

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard', async () => {
      await dashboardsAdminPage.createDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.close();
    });

    await test.step('Update the dashboard', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);

      dashboard.name = FakeDataFactory.createFakeDashboardName();
      dashboardsToDelete.push(dashboard.name);

      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Verify the dashboard was updated correctly', async () => {
      const updatedDashboard = await dashboardsAdminPage.getDashboardRow(dashboard.name);
      await expect(updatedDashboard).toBeVisible();
    });
  });

  test('Delete a dashboard', async ({ dashboardsAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-323',
    });

    const dashboard = new Dashboard({ name: FakeDataFactory.createFakeDashboardName() });

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard', async () => {
      await dashboardsAdminPage.createDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.close();
    });

    await test.step('Delete the dashboard', async () => {
      await dashboardsAdminPage.deleteDashboards([dashboard.name]);
    });

    await test.step('Verify the dashboard was deleted', async () => {
      const dashboardRow = await dashboardsAdminPage.getDashboardRow(dashboard.name);
      await expect(dashboardRow).not.toBeAttached();
    });
  });

  test("Edit a dashboard's configurations from the dashboard", async ({
    report,
    container,
    dashboardsAdminPage,
    dashboardPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-324',
    });

    const dashboard = new Dashboard({
      name: FakeDataFactory.createFakeDashboardName(),
      containers: [container.name],
      items: [
        {
          object: report,
          row: 0,
          column: 0,
        },
      ],
    });

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard', async () => {
      await dashboardsAdminPage.createDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Navigate to the dashboard', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardPage.openDashboardDesigner();
    });

    await test.step('Update the dashboard', async () => {
      dashboard.name = FakeDataFactory.createFakeDashboardName();
      dashboardsToDelete.push(dashboard.name);

      await dashboardPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardPage.dashboardDesigner.saveAndClose();
      await dashboardPage.page.waitForLoadState('networkidle');
    });

    await test.step('Verify the dashboard was updated correctly', async () => {
      await expect(dashboardPage.dashboardTitle).toHaveText(dashboard.name);
    });
  });

  test('Print a dashboard', () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-325',
    });

    expect(true).toBeTruthy();
  });

  test('Export a dashboard', () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-326',
    });

    expect(true).toBeTruthy();
  });

  test('Schedule a dashboard for export', () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-327',
    });

    expect(true).toBeTruthy();
  });

  test("Get a dashboard's link", () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-328',
    });

    expect(true).toBeTruthy();
  });

  test('Set a dashboard as your default dashboard', () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-329',
    });

    expect(true).toBeTruthy();
  });

  test('Disable a dashboard', () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-330',
    });

    expect(true).toBeTruthy();
  });

  test('Enable a dashboard', () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-331',
    });

    expect(true).toBeTruthy();
  });

  test('Make a dashboard private', () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-332',
    });

    expect(true).toBeTruthy();
  });

  test('Make a dashboard public', () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-333',
    });

    expect(true).toBeTruthy();
  });

  test("Navigate to a dashboard via it's link", () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-334',
    });

    expect(true).toBeTruthy();
  });

  test('Add a dashboard title to a dashboard', () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-869',
    });

    expect(true).toBeTruthy();
  });
});
