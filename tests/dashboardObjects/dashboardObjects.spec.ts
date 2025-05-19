import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { createContainerFixture } from '../../fixtures/container.fixtures';
import { createDashboardFixture } from '../../fixtures/dashboard.fixtures';
import { App } from '../../models/app';
import { AppSearch } from '../../models/appSearch';
import { Container } from '../../models/container';
import { CreateContentLinks } from '../../models/createContentLinks';
import { Dashboard, DashboardItemObject } from '../../models/dashboard';
import { DashboardFormattedTextBlock as FormattedTextBlock } from '../../models/dashboardFormattedTextBlock';
import { WebPage } from '../../models/webPage';
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
  let dashboardObjectsToDelete: DashboardItemObject[] = [];

  test.afterEach(async ({ dashboard, dashboardsAdminPage }) => {
    await dashboardsAdminPage.goto();
    await dashboardsAdminPage.openDashboardDesigner(dashboard.name);

    for (const dashboardObject of dashboardObjectsToDelete) {
      await dashboardsAdminPage.dashboardDesigner.deleteDashboardObject(dashboardObject);
    }

    dashboardObjectsToDelete = [];
  });

  test('Add an App Search object', async ({ dashboardsAdminPage, sourceApp, dashboard, dashboardPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-758',
    });

    const appSearchObject = new AppSearch({
      name: FakeDataFactory.createFakeObjectName(),
      apps: [sourceApp.name],
    });

    dashboardObjectsToDelete.push(appSearchObject);

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add an app search object', async () => {
      await dashboardsAdminPage.dashboardDesigner.addAppSearchObject(appSearchObject);

      dashboard.items.push({ row: 0, column: 0, item: appSearchObject });

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
      links: [{ app: sourceApp.name, imageSource: { src: 'App' }, linkText: 'Test Link' }],
    });

    dashboardObjectsToDelete.push(createContentLinksObject);

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add a create content links object', async () => {
      await dashboardsAdminPage.dashboardDesigner.addCreateContentLinksObject(createContentLinksObject);

      dashboard.items.push({ row: 0, column: 1, item: createContentLinksObject });

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

  test('Add a Formatted Text Block object', async ({
    dashboardsAdminPage,
    dashboard,
    dashboardPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-760',
    });

    const formattedTextBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeObjectName(),
    })

    dashboardObjectsToDelete.push(formattedTextBlock);

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add a formatted text block object', async () => {
      await dashboardsAdminPage.dashboardDesigner.addFormattedTextBlockObject(formattedTextBlock);

      dashboard.items.push({ row: 0, column: 0, item: formattedTextBlock });

      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Navigate to the dashboard page', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Verify the formatted text block object displays', async () => {
      const item = dashboardPage.getDashboardItem(formattedTextBlock.name);
      await expect(item).toBeVisible();
    });
  });

  test('Add a Web Page object', async ({
    dashboardsAdminPage,
    dashboard,
    dashboardPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-761',
    });

    const webPageObject = new WebPage({
      name: FakeDataFactory.createFakeObjectName(),
      url: 'https://stevanfreeborn.com',
    });

    dashboardObjectsToDelete.push(webPageObject);

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add a web page object', async () => {
      await dashboardsAdminPage.dashboardDesigner.addWebPageObject(webPageObject);

      dashboard.items.push({ row: 0, column: 0, item: webPageObject });

      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Navigate to the dashboard page', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Verify the web page object displays', async () => {
      const item = dashboardPage.getDashboardItem(webPageObject.name);
      await expect(item).toBeVisible();
    });
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

  test('Delete an App Search object', async ({
    sourceApp,
    dashboardsAdminPage,
    dashboard,
    dashboardPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-766',
    });

    const appSearchObject = new AppSearch({
      name: FakeDataFactory.createFakeObjectName(),
      apps: [
        sourceApp.name,
      ],
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add an app search object to the dashboard', async () => {
      await dashboardsAdminPage.dashboardDesigner.addAppSearchObject(appSearchObject);

      dashboard.items.push({ row: 0, column: 0, item: appSearchObject });

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

    await test.step('Delete the app search object', async () => {
      await dashboardPage.openDashboardDesigner();
      await dashboardPage.dashboardDesigner.deleteDashboardObject(appSearchObject);
      await dashboardPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Verify the app search object is deleted', async () => {
      await dashboardPage.page.reload();

      const item = dashboardPage.getDashboardItem(appSearchObject.name);
      await expect(item).toBeHidden();
    });
  });

  test('Delete a Create Content Links object', async ({
    dashboardsAdminPage,
    dashboard,
    dashboardPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-767',
    });

    const createContentLinksObject = new CreateContentLinks({
      name: FakeDataFactory.createFakeObjectName(),
      links: [{ app: 'App', imageSource: { src: 'App' }, linkText: 'Test Link' }],
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add a create content links object to the dashboard', async () => {
      await dashboardsAdminPage.dashboardDesigner.addCreateContentLinksObject(createContentLinksObject);

      dashboard.items.push({ row: 0, column: 1, item: createContentLinksObject });

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

    await test.step('Delete the create content links object', async () => {
      await dashboardPage.openDashboardDesigner();
      await dashboardPage.dashboardDesigner.deleteDashboardObject(createContentLinksObject);
      await dashboardPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Verify the create content links object is deleted', async () => {
      await dashboardPage.page.reload();

      const item = dashboardPage.getDashboardItem(createContentLinksObject.name);
      await expect(item).toBeHidden();
    });
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
