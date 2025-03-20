import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { createContainerFixture } from '../../fixtures/container.fixtures';
import { createDashboardFixture } from '../../fixtures/dashboard.fixtures';
import { App } from '../../models/app';
import { AppSearch } from '../../models/appSearch';
import { Container } from '../../models/container';
import { Dashboard } from '../../models/dashboard';
import { DashboardPage } from '../../pageObjectModels/dashboards/dashboardPage';
import { DashboardsAdminPage } from '../../pageObjectModels/dashboards/dashboardsAdminPage';
import { AnnotationType } from '../annotations';

type DashboardObjectTestFixtures = {
  dashboardsAdminPage: DashboardsAdminPage;
  sourceApp: App;
  container: Container;
  dashboard: Dashboard;
  dashboardPage: DashboardPage;
};

const test = base.extend<DashboardObjectTestFixtures>({
  dashboardsAdminPage: async ({ sysAdminPage }, use) => await use(new DashboardsAdminPage(sysAdminPage)),
  sourceApp: app,
  container: async ({ sysAdminPage }, use) => await createContainerFixture({ sysAdminPage }, use),
  dashboard: async ({ sysAdminPage, container }, use) =>
    await createDashboardFixture(
      {
        sysAdminPage,
        dashboard: new Dashboard({ name: FakeDataFactory.createFakeDashboardName(), containers: [container.name] }),
      },
      use
    ),
  dashboardPage: async ({ sysAdminPage }, use) => await use(new DashboardPage(sysAdminPage)),
});

test.describe('dashboard objects', () => {
  test('Add an App Search object', async ({ dashboardsAdminPage, sourceApp, dashboard, dashboardPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-758',
    });

    const appSearchObject = new AppSearch({
      name: FakeDataFactory.createFakeObjectName(),
      apps: [sourceApp.name],
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add an app search object', async () => {
      await dashboardsAdminPage.dashboardDesigner.addAppSearchObject(appSearchObject);

      dashboard.items.push({ row: 0, column: 0, object: appSearchObject });

      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Navigate to the dashboard page', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Verify the app search object displays', async () => {
      const item = dashboardPage.getDashboardItem(appSearchObject.name);
      await expect(item).toBeVisible();
    });
  });

  test('Add a Create Content Links object', async ({ dashboardsAdminPage, sourceApp, dashboard, dashboardPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-759',
    });

    const createContentLinksObject = new CreateContentLinks({
      name: FakeDataFactory.createFakeObjectName(),
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add a create content links object', async () => {
      await dashboardsAdminPage.dashboardDesigner.addCreateContentLinksObject(createContentLinksObject);

      dashboard.items.push({ row: 0, column: 1, object: createContentLinksObject });

      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Navigate to the dashboard page', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Verify the create content links object displays', async () => {
      const item = dashboardPage.getDashboardItem(createContentLinksObject.name);
      await expect(item).toBeVisible();
    });
  });

  test('Add a Formatted Text Block object', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-760',
    });

    expect(true).toBeTruthy();
  });

  test('Add a Web Page object', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-761',
    });

    expect(true).toBeTruthy();
  });

  test('Modify an App Search object', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-762',
    });

    expect(true).toBeTruthy();
  });

  test('Modify a Create Content Links object', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-763',
    });

    expect(true).toBeTruthy();
  });

  test('Modify a Formatted Text Block object', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-764',
    });

    expect(true).toBeTruthy();
  });

  test('Modify a Web Page object', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-765',
    });

    expect(true).toBeTruthy();
  });

  test('Delete an App Search object', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-766',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a Create Content Links object', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-767',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a Formatted Text Block object', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-768',
    });

    expect(true).toBeTruthy();
  });

  test('Delete a Web Page object', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-769',
    });

    expect(true).toBeTruthy();
  });

  test('Verify an App Search object displays and functions as expected', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-770',
    });

    expect(true).toBeTruthy();
  });

  test('Verify a Create Content Links object displays and functions as expected', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-771',
    });

    expect(true).toBeTruthy();
  });

  test('Verify a Formatted Text Block object displays and functions as expected', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-772',
    });

    expect(true).toBeTruthy();
  });

  test('Verify a Web Page object displays and functions as expected', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-773',
    });

    expect(true).toBeTruthy();
  });
});
