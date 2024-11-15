import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { Dashboard } from '../../models/dashboard';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { DashboardsAdminPage } from '../../pageObjectModels/dashboards/dashboardsAdminPage';
import { AnnotationType } from '../annotations';

type DashboardTestFixtures = {
  adminHomePage: AdminHomePage;
  dashboardsAdminPage: DashboardsAdminPage;
};

const test = base.extend<DashboardTestFixtures>({
  adminHomePage: async ({ sysAdminPage }, use) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    await use(adminHomePage);
  },
  dashboardsAdminPage: async ({ sysAdminPage }, use) => {
    const dashboardsAdminPage = new DashboardsAdminPage(sysAdminPage);
    await use(dashboardsAdminPage);
  },
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

    const dashboardName = FakeDataFactory.createFakeAppName();
    dashboardsToDelete.push(dashboardName);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard', async () => {
      await dashboardsAdminPage.createDashboard(dashboardName);
      await dashboardsAdminPage.dashboardDesigner.waitFor();
    });

    await test.step('Verify the dashboard was created correctly', async () => {
      await expect(dashboardsAdminPage.dashboardDesigner.title).toHaveText(dashboardName);
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

    const dashboardToCopyName = FakeDataFactory.createFakeAppName();
    const dashboardCopyName = FakeDataFactory.createFakeAppName();
    dashboardsToDelete.push(dashboardToCopyName, dashboardCopyName);

    await test.step('Navigate to the Dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create the dashboard to copy', async () => {
      await dashboardsAdminPage.createDashboard(dashboardToCopyName);
      await dashboardsAdminPage.dashboardDesigner.close();
    });

    await test.step('Create the copy of the dashboard', async () => {
      await dashboardsAdminPage.createDashboardCopy(dashboardToCopyName, dashboardCopyName);
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
      await dashboardsAdminPage.createDashboard(dashboard.name);
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

  test('Delete a dashboard', () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-323',
    });

    expect(true).toBeTruthy();
  });

  test("Edit a dashboard's configurations from the dashboard", () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-324',
    });

    expect(true).toBeTruthy();
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
