import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { createContainerFixture } from '../../fixtures/container.fixtures';
import { createDashboardFixture } from '../../fixtures/dashboard.fixtures';
import { App } from '../../models/app';
import { AppSearch } from '../../models/appSearch';
import { Container } from '../../models/container';
import { CreateContentLinks } from '../../models/createContentLinks';
import { Dashboard } from '../../models/dashboard';
import { DashboardFormattedTextBlock as FormattedTextBlock } from '../../models/dashboardFormattedTextBlock';
import { WebPage } from '../../models/webPage';
import { DashboardPage } from '../../pageObjectModels/dashboards/dashboardPage';
import { DashboardsAdminPage } from '../../pageObjectModels/dashboards/dashboardsAdminPage';
import { AnnotationType } from '../annotations';
import { DashboardObjectItem } from '../../models/dashboardObjectItem';
import { ContentHomePage } from '../../pageObjectModels/content/contentHomePage';
import { EditContentPage } from '../../pageObjectModels/content/editContentPage';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { AppContentPage } from '../../pageObjectModels/content/appContentPage';

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
  let dashboardObjectsToDelete: DashboardObjectItem[] = [];

  test.afterEach(async ({ dashboard, dashboardsAdminPage }) => {
    if (dashboardObjectsToDelete.length === 0) {
      return;
    }

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
      await dashboardsAdminPage.dashboardDesigner.addDashboardObject(appSearchObject);

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
      await dashboardsAdminPage.dashboardDesigner.addDashboardObject(createContentLinksObject);

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

  test('Add a Formatted Text Block object', async ({ dashboardsAdminPage, dashboard, dashboardPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-760',
    });

    const formattedTextBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeObjectName(),
    });

    dashboardObjectsToDelete.push(formattedTextBlock);

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add a formatted text block object', async () => {
      await dashboardsAdminPage.dashboardDesigner.addDashboardObject(formattedTextBlock);

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

  test('Add a Web Page object', async ({ dashboardsAdminPage, dashboard, dashboardPage }) => {
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
      await dashboardsAdminPage.dashboardDesigner.addDashboardObject(webPageObject);

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

  test('Modify an App Search object', async ({ sourceApp, dashboardsAdminPage, dashboard, dashboardPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-762',
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
      await dashboardsAdminPage.dashboardDesigner.addDashboardObject(appSearchObject);

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

    const updatedAppSearchObject = structuredClone(appSearchObject);
    updatedAppSearchObject.name = FakeDataFactory.createFakeObjectName();

    dashboardObjectsToDelete.push(updatedAppSearchObject);

    await test.step('Modify the app search object', async () => {
      await dashboardPage.openDashboardDesigner();
      await dashboardPage.dashboardDesigner.updateDashboardObject(appSearchObject, updatedAppSearchObject);
      await dashboardPage.dashboardDesigner.close();
    });

    await test.step('Verify the app search object is modified', async () => {
      await dashboardPage.page.reload();

      const item = dashboardPage.getDashboardItem(updatedAppSearchObject.name);
      await expect(item).toBeVisible();
    });
  });

  test('Modify a Create Content Links object', async ({ sourceApp, dashboardsAdminPage, dashboard, dashboardPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-763',
    });

    const createContentLinksObject = new CreateContentLinks({
      name: FakeDataFactory.createFakeObjectName(),
      links: [{ app: sourceApp.name, imageSource: { src: 'App' }, linkText: 'Test Link' }],
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add a create content links object', async () => {
      await dashboardsAdminPage.dashboardDesigner.addDashboardObject(createContentLinksObject);

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

    const updatedCreateContentLinksObject = structuredClone(createContentLinksObject);
    updatedCreateContentLinksObject.name = FakeDataFactory.createFakeObjectName();

    dashboardObjectsToDelete.push(updatedCreateContentLinksObject);

    await test.step('Modify the create content links object', async () => {
      await dashboardPage.openDashboardDesigner();
      await dashboardPage.dashboardDesigner.updateDashboardObject(
        createContentLinksObject,
        updatedCreateContentLinksObject
      );
      await dashboardPage.dashboardDesigner.close();
    });

    await test.step('Verify the create content links object is modified', async () => {
      await dashboardPage.page.reload();

      const item = dashboardPage.getDashboardItem(updatedCreateContentLinksObject.name);
      await expect(item).toBeVisible();
    });
  });

  test('Modify a Formatted Text Block object', async ({ dashboardsAdminPage, dashboard, dashboardPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-764',
    });

    const formattedTextBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeObjectName(),
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add a formatted text block object', async () => {
      await dashboardsAdminPage.dashboardDesigner.addDashboardObject(formattedTextBlock);

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

    const updatedFormattedTextBlock = structuredClone(formattedTextBlock);
    updatedFormattedTextBlock.name = FakeDataFactory.createFakeObjectName();

    dashboardObjectsToDelete.push(updatedFormattedTextBlock);

    await test.step('Modify the formatted text block object', async () => {
      await dashboardPage.openDashboardDesigner();
      await dashboardPage.dashboardDesigner.updateDashboardObject(formattedTextBlock, updatedFormattedTextBlock);
      await dashboardPage.dashboardDesigner.close();
    });

    await test.step('Verify the formatted text block object is modified', async () => {
      await dashboardPage.page.reload();

      const item = dashboardPage.getDashboardItem(updatedFormattedTextBlock.name);
      await expect(item).toBeVisible();
    });
  });

  test('Modify a Web Page object', async ({ dashboardsAdminPage, dashboard, dashboardPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-765',
    });

    const webPageObject = new WebPage({
      name: FakeDataFactory.createFakeObjectName(),
      url: 'https://stevanfreeborn.com',
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add a web page object', async () => {
      await dashboardsAdminPage.dashboardDesigner.addDashboardObject(webPageObject);

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

    const updatedWebPageObject = structuredClone(webPageObject);
    updatedWebPageObject.name = FakeDataFactory.createFakeObjectName();

    dashboardObjectsToDelete.push(updatedWebPageObject);

    await test.step('Modify the web page object', async () => {
      await dashboardPage.openDashboardDesigner();
      await dashboardPage.dashboardDesigner.updateDashboardObject(webPageObject, updatedWebPageObject);
      await dashboardPage.dashboardDesigner.close();
    });

    await test.step('Verify the web page object is modified', async () => {
      await dashboardPage.page.reload();

      const item = dashboardPage.getDashboardItem(updatedWebPageObject.name);
      await expect(item).toBeVisible();
    });
  });

  test('Delete an App Search object', async ({ sourceApp, dashboardsAdminPage, dashboard, dashboardPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-766',
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

    await test.step('Add an app search object to the dashboard', async () => {
      await dashboardsAdminPage.dashboardDesigner.addDashboardObject(appSearchObject);

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

  test('Delete a Create Content Links object', async ({ sourceApp, dashboardsAdminPage, dashboard, dashboardPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-767',
    });

    const createContentLinksObject = new CreateContentLinks({
      name: FakeDataFactory.createFakeObjectName(),
      links: [{ app: sourceApp.name, imageSource: { src: 'App' }, linkText: 'Test Link' }],
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add a create content links object to the dashboard', async () => {
      await dashboardsAdminPage.dashboardDesigner.addDashboardObject(createContentLinksObject);

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

  test('Delete a Formatted Text Block object', async ({ dashboardsAdminPage, dashboard, dashboardPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-768',
    });

    const formattedTextBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeObjectName(),
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add a formatted text block object to the dashboard', async () => {
      await dashboardsAdminPage.dashboardDesigner.addDashboardObject(formattedTextBlock);

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

    await test.step('Delete the formatted text block object', async () => {
      await dashboardPage.openDashboardDesigner();
      await dashboardPage.dashboardDesigner.deleteDashboardObject(formattedTextBlock);
      await dashboardPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Verify the formatted text block object is deleted', async () => {
      await dashboardPage.page.reload();

      const item = dashboardPage.getDashboardItem(formattedTextBlock.name);
      await expect(item).toBeHidden();
    });
  });

  test('Delete a Web Page object', async ({ dashboardsAdminPage, dashboard, dashboardPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-769',
    });

    const webPageObject = new WebPage({
      name: FakeDataFactory.createFakeObjectName(),
      url: 'https://stevanfreeborn.com',
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add a web page object to the dashboard', async () => {
      await dashboardsAdminPage.dashboardDesigner.addDashboardObject(webPageObject);

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

    await test.step('Delete the web page object', async () => {
      await dashboardPage.openDashboardDesigner();
      await dashboardPage.dashboardDesigner.deleteDashboardObject(webPageObject);
      await dashboardPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Verify the web page object is deleted', async () => {
      await dashboardPage.page.reload();

      const item = dashboardPage.getDashboardItem(webPageObject.name);
      await expect(item).toBeHidden();
    });
  });

  test('Verify an App Search object displays and functions as expected', async ({
    sysAdminPage,
    sourceApp,
    dashboardsAdminPage,
    dashboard,
    dashboardPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-770',
    });

    let createdRecordId: number;

    const appSearchObject = new AppSearch({
      name: FakeDataFactory.createFakeObjectName(),
      apps: [sourceApp.name],
    });

    dashboardObjectsToDelete.push(appSearchObject);

    await test.step('Create a content record in the source app', async () => {
      const contentHomePage = new ContentHomePage(sysAdminPage);
      const addContentPage = new AddContentPage(sysAdminPage);
      const editContentPage = new EditContentPage(sysAdminPage);

      await contentHomePage.goto();
      await contentHomePage.toolbar.createRecord(sourceApp.name);
      await contentHomePage.page.waitForURL(addContentPage.pathRegex);

      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
      createdRecordId = editContentPage.getRecordIdFromUrl();
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add an app search object', async () => {
      await dashboardsAdminPage.dashboardDesigner.addDashboardObject(appSearchObject);

      dashboard.items.push({ row: 0, column: 0, item: appSearchObject });

      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Navigate to the dashboard page', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    const appContentPage = new AppContentPage(sysAdminPage);

    await test.step('Search for the created record', async () => {
      const item = dashboardPage.getDashboardItem(appSearchObject.name);
      const searchBox = item.getByPlaceholder(`Search ${sourceApp.name}`);
      const searchButton = item.getByRole('button');

      await searchBox.fill(createdRecordId.toString());
      await searchButton.click();
      await dashboardPage.page.waitForURL(appContentPage.pathRegex);
    });

    await test.step('Verify the created record is displayed in search results', async () => {
      const searchResult = appContentPage.getSearchResultByRecordId(createdRecordId);

      await expect(searchResult).toBeVisible();
    });
  });

  test('Verify a Create Content Links object displays and functions as expected', async ({
    sysAdminPage,
    sourceApp,
    dashboardsAdminPage,
    dashboard,
    dashboardPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-771',
    });

    const createContentLinksObject = new CreateContentLinks({
      name: FakeDataFactory.createFakeObjectName(),
      links: [{ app: sourceApp.name, imageSource: { src: 'App' }, linkText: 'Test Link' }],
    });
    
    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add a create content links object', async () => {
      await dashboardsAdminPage.dashboardDesigner.addDashboardObject(createContentLinksObject);

      dashboard.items.push({ row: 0, column: 1, item: createContentLinksObject });

      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Navigate to the dashboard page', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Verify create content link takes you to add content page for the app', async () => {
      const addContentPage = new AddContentPage(sysAdminPage);
      const item = dashboardPage.getDashboardItem(createContentLinksObject.name);
      const link = item.getByRole('link', { name: 'Test Link' });

      await link.click();

      await dashboardPage.page.waitForURL(addContentPage.pathRegex);

      const appId = addContentPage.getAppIdFromUrl();
      expect(appId).toBe(sourceApp.id);
    });
  });

  test('Verify a Formatted Text Block object displays and functions as expected', async ({
    dashboardsAdminPage,
    dashboard,
    dashboardPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-772',
    });

    const formattedTextBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeObjectName(),
      formattedText: 'Test formatted text block',
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add a formatted text block object', async () => {
      await dashboardsAdminPage.dashboardDesigner.addDashboardObject(formattedTextBlock);

      dashboard.items.push({ row: 0, column: 0, item: formattedTextBlock });

      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Navigate to the dashboard page', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Verify the formatted text block object displays as expected', async () => {
      const item = dashboardPage.getDashboardItem(formattedTextBlock.name);
      const heading = item.getByRole('heading', { name: formattedTextBlock.name });
      const textBlock = item.getByText(formattedTextBlock.formattedText);

      await expect(item).toBeVisible();
      await expect(heading).toBeVisible();
      await expect(textBlock).toBeVisible();
    });
  });

  test('Verify a Web Page object displays and functions as expected', async ({
    dashboardsAdminPage,
    dashboard,
    dashboardPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-773',
    });

    const webPageObject = new WebPage({
      name: FakeDataFactory.createFakeObjectName(),
      url: 'https://stevanfreeborn.com',
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add a web page object', async () => {
      await dashboardsAdminPage.dashboardDesigner.addDashboardObject(webPageObject);

      dashboard.items.push({ row: 0, column: 0, item: webPageObject });

      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Navigate to the dashboard page', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Verify the web page object displays as expected', async () => {
      const item = dashboardPage.getDashboardItem(webPageObject.name);
      const iframe = item.locator('iframe');

      await expect(item).toBeVisible();
      await expect(iframe).toBeVisible();
      await expect(iframe).toHaveAttribute('src', webPageObject.url);
    });

    expect(true).toBeTruthy();
  });
});
