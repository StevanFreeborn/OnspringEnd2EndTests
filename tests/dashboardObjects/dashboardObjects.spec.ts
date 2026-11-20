import {
  App,
  AppSearch,
  Container,
  CreateContentLinks,
  Dashboard,
  DashboardFormattedTextBlock as FormattedTextBlock,
  DashboardObjectItem,
  FakeDataFactory,
  WebPage,
} from '@stevanfreeborn/onspring-models';
import {
  ContentQuestions,
  ContentRecordTargets,
  ContentTasks,
  DashboardObjectTasks,
  DashboardPageTargets,
  DashboardTasks,
} from '@stevanfreeborn/onspring-ui';
import { AppFixture, ContainerFixture, DashboardFixture, test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';

type DashboardObjectTestFixtures = {
  app: App;
  container: Container;
  dashboard: Dashboard;
};

const test = base.extend<DashboardObjectTestFixtures>({
  app: AppFixture.create().build(),
  container: ContainerFixture.create().build(),
  dashboard: DashboardFixture.create()
    .withContainers(({ container }) => [container.name])
    .build(),
});

test.describe('dashboard objects', () => {
  let dashboardObjectsToDelete: DashboardObjectItem[] = [];

  test.afterEach(async ({ dashboard, sysAdminActor }) => {
    if (dashboardObjectsToDelete.length === 0) {
      return;
    }

    await sysAdminActor.attemptsTo(
      DashboardTasks.gotoAdminPage(),
      DashboardTasks.openDesignerFromAdminPage(dashboard.name)
    );

    for (const dashboardObject of dashboardObjectsToDelete) {
      await sysAdminActor.attemptsTo(DashboardObjectTasks.deleteObject(dashboardObject.name));
    }

    await sysAdminActor.attemptsTo(DashboardTasks.closeDesigner());
    dashboardObjectsToDelete = [];
  });

  test('Add an App Search object', async ({ app, dashboard, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-758',
    });

    const appSearchObject = new AppSearch({
      name: FakeDataFactory.createFakeDashboardObjectName(),
      apps: [app.name],
    });

    dashboardObjectsToDelete.push(appSearchObject);

    await test.step('Navigate to the dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add an app search object', async () => {
      await sysAdminActor.attemptsTo(DashboardObjectTasks.addObject(appSearchObject));

      dashboard.items.push({ row: 0, column: 0, item: appSearchObject });

      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Navigate to the dashboard page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the app search object displays', async () => {
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardItem(appSearchObject.name)).isVisible();
    });
  });

  test('Add a Create Content Links object', async ({ app, dashboard, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-759',
    });

    const createContentLinksObject = new CreateContentLinks({
      name: FakeDataFactory.createFakeDashboardObjectName(),
      links: [{ app: app.name, imageSource: { src: 'App' }, linkText: 'Test Link' }],
    });

    dashboardObjectsToDelete.push(createContentLinksObject);

    await test.step('Navigate to the dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add a create content links object', async () => {
      await sysAdminActor.attemptsTo(DashboardObjectTasks.addObject(createContentLinksObject));

      dashboard.items.push({ row: 0, column: 1, item: createContentLinksObject });

      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Navigate to the dashboard page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the create content links object displays', async () => {
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardItem(createContentLinksObject.name)).isVisible();
    });
  });

  test('Add a Formatted Text Block object', async ({ dashboard, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-760',
    });

    const formattedTextBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeDashboardObjectName(),
    });

    dashboardObjectsToDelete.push(formattedTextBlock);

    await test.step('Navigate to the dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add a formatted text block object', async () => {
      await sysAdminActor.attemptsTo(DashboardObjectTasks.addObject(formattedTextBlock));

      dashboard.items.push({ row: 0, column: 0, item: formattedTextBlock });

      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Navigate to the dashboard page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the formatted text block object displays', async () => {
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardItem(formattedTextBlock.name)).isVisible();
    });
  });

  test('Add a Web Page object', async ({ dashboard, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-761',
    });

    const webPageObject = new WebPage({
      name: FakeDataFactory.createFakeDashboardObjectName(),
      url: 'https://stevanfreeborn.com',
    });

    dashboardObjectsToDelete.push(webPageObject);

    await test.step('Navigate to the dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add a web page object', async () => {
      await sysAdminActor.attemptsTo(DashboardObjectTasks.addObject(webPageObject));

      dashboard.items.push({ row: 0, column: 0, item: webPageObject });

      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Navigate to the dashboard page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the web page object displays', async () => {
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardItem(webPageObject.name)).isVisible();
    });
  });

  test('Modify an App Search object', async ({ app, dashboard, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-762',
    });

    const appSearchObject = new AppSearch({
      name: FakeDataFactory.createFakeDashboardObjectName(),
      apps: [app.name],
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add an app search object', async () => {
      await sysAdminActor.attemptsTo(DashboardObjectTasks.addObject(appSearchObject));

      dashboard.items.push({ row: 0, column: 0, item: appSearchObject });

      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Navigate to the dashboard page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the app search object displays', async () => {
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardItem(appSearchObject.name)).isVisible();
    });

    const updatedAppSearchObject = appSearchObject.clone();
    updatedAppSearchObject.name = FakeDataFactory.createFakeDashboardObjectName();

    dashboardObjectsToDelete.push(updatedAppSearchObject);

    await test.step('Modify the app search object', async () => {
      await sysAdminActor.attemptsTo(
        DashboardTasks.openDesignerFromDashboard(),
        DashboardObjectTasks.updateObject(appSearchObject.name, updatedAppSearchObject),
        DashboardTasks.closeDesigner()
      );
    });

    await test.step('Verify the app search object is modified', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardItem(updatedAppSearchObject.name)).isVisible();
    });
  });

  test('Modify a Create Content Links object', async ({ app, dashboard, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-763',
    });

    const createContentLinksObject = new CreateContentLinks({
      name: FakeDataFactory.createFakeDashboardObjectName(),
      links: [{ app: app.name, imageSource: { src: 'App' }, linkText: 'Test Link' }],
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add a create content links object', async () => {
      await sysAdminActor.attemptsTo(DashboardObjectTasks.addObject(createContentLinksObject));

      dashboard.items.push({ row: 0, column: 1, item: createContentLinksObject });

      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Navigate to the dashboard page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the create content links object displays', async () => {
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardItem(createContentLinksObject.name)).isVisible();
    });

    const updatedCreateContentLinksObject = createContentLinksObject.clone();
    updatedCreateContentLinksObject.name = FakeDataFactory.createFakeDashboardObjectName();

    dashboardObjectsToDelete.push(updatedCreateContentLinksObject);

    await test.step('Modify the create content links object', async () => {
      await sysAdminActor.attemptsTo(
        DashboardTasks.openDesignerFromDashboard(),
        DashboardObjectTasks.updateObject(createContentLinksObject.name, updatedCreateContentLinksObject),
        DashboardTasks.closeDesigner()
      );
    });

    await test.step('Verify the create content links object is modified', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
      await sysAdminActor
        .browse()
        .check(DashboardPageTargets.dashboardItem(updatedCreateContentLinksObject.name))
        .isVisible();
    });
  });

  test('Modify a Formatted Text Block object', async ({ dashboard, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-764',
    });

    const formattedTextBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeDashboardObjectName(),
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add a formatted text block object', async () => {
      await sysAdminActor.attemptsTo(DashboardObjectTasks.addObject(formattedTextBlock));

      dashboard.items.push({ row: 0, column: 0, item: formattedTextBlock });

      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Navigate to the dashboard page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the formatted text block object displays', async () => {
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardItem(formattedTextBlock.name)).isVisible();
    });

    const updatedFormattedTextBlock = formattedTextBlock.clone();
    updatedFormattedTextBlock.name = FakeDataFactory.createFakeDashboardObjectName();

    dashboardObjectsToDelete.push(updatedFormattedTextBlock);

    await test.step('Modify the formatted text block object', async () => {
      await sysAdminActor.attemptsTo(
        DashboardTasks.openDesignerFromDashboard(),
        DashboardObjectTasks.updateObject(formattedTextBlock.name, updatedFormattedTextBlock),
        DashboardTasks.closeDesigner()
      );
    });

    await test.step('Verify the formatted text block object is modified', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
      await sysAdminActor
        .browse()
        .check(DashboardPageTargets.dashboardItem(updatedFormattedTextBlock.name))
        .isVisible();
    });
  });

  test('Modify a Web Page object', async ({ dashboard, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-765',
    });

    const webPageObject = new WebPage({
      name: FakeDataFactory.createFakeDashboardObjectName(),
      url: 'https://stevanfreeborn.com',
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add a web page object', async () => {
      await sysAdminActor.attemptsTo(DashboardObjectTasks.addObject(webPageObject));

      dashboard.items.push({ row: 0, column: 0, item: webPageObject });

      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Navigate to the dashboard page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the web page object displays', async () => {
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardItem(webPageObject.name)).isVisible();
    });

    const updatedWebPageObject = webPageObject.clone();
    updatedWebPageObject.name = FakeDataFactory.createFakeDashboardObjectName();

    dashboardObjectsToDelete.push(updatedWebPageObject);

    await test.step('Modify the web page object', async () => {
      await sysAdminActor.attemptsTo(
        DashboardTasks.openDesignerFromDashboard(),
        DashboardObjectTasks.updateObject(webPageObject.name, updatedWebPageObject),
        DashboardTasks.closeDesigner()
      );
    });

    await test.step('Verify the web page object is modified', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardItem(updatedWebPageObject.name)).isVisible();
    });
  });

  test('Delete an App Search object', async ({ app, dashboard, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-766',
    });

    const appSearchObject = new AppSearch({
      name: FakeDataFactory.createFakeDashboardObjectName(),
      apps: [app.name],
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add an app search object to the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardObjectTasks.addObject(appSearchObject));

      dashboard.items.push({ row: 0, column: 0, item: appSearchObject });

      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Navigate to the dashboard page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the app search object displays', async () => {
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardItem(appSearchObject.name)).isVisible();
    });

    await test.step('Delete the app search object', async () => {
      await sysAdminActor.attemptsTo(
        DashboardTasks.openDesignerFromDashboard(),
        DashboardObjectTasks.deleteObject(appSearchObject.name),
        DashboardTasks.saveAndCloseDesigner()
      );
    });

    await test.step('Verify the app search object is deleted', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardItem(appSearchObject.name)).isHidden();
    });
  });

  test('Delete a Create Content Links object', async ({ app, dashboard, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-767',
    });

    const createContentLinksObject = new CreateContentLinks({
      name: FakeDataFactory.createFakeDashboardObjectName(),
      links: [{ app: app.name, imageSource: { src: 'App' }, linkText: 'Test Link' }],
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add a create content links object to the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardObjectTasks.addObject(createContentLinksObject));

      dashboard.items.push({ row: 0, column: 1, item: createContentLinksObject });

      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Navigate to the dashboard page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the create content links object displays', async () => {
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardItem(createContentLinksObject.name)).isVisible();
    });

    await test.step('Delete the create content links object', async () => {
      await sysAdminActor.attemptsTo(
        DashboardTasks.openDesignerFromDashboard(),
        DashboardObjectTasks.deleteObject(createContentLinksObject.name),
        DashboardTasks.saveAndCloseDesigner()
      );
    });

    await test.step('Verify the create content links object is deleted', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardItem(createContentLinksObject.name)).isHidden();
    });
  });

  test('Delete a Formatted Text Block object', async ({ dashboard, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-768',
    });

    const formattedTextBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeDashboardObjectName(),
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add a formatted text block object to the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardObjectTasks.addObject(formattedTextBlock));

      dashboard.items.push({ row: 0, column: 0, item: formattedTextBlock });

      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Navigate to the dashboard page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the formatted text block object displays', async () => {
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardItem(formattedTextBlock.name)).isVisible();
    });

    await test.step('Delete the formatted text block object', async () => {
      await sysAdminActor.attemptsTo(
        DashboardTasks.openDesignerFromDashboard(),
        DashboardObjectTasks.deleteObject(formattedTextBlock.name),
        DashboardTasks.saveAndCloseDesigner()
      );
    });

    await test.step('Verify the formatted text block object is deleted', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardItem(formattedTextBlock.name)).isHidden();
    });
  });

  test('Delete a Web Page object', async ({ dashboard, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-769',
    });

    const webPageObject = new WebPage({
      name: FakeDataFactory.createFakeDashboardObjectName(),
      url: 'https://stevanfreeborn.com',
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add a web page object to the dashboard', async () => {
      await sysAdminActor.attemptsTo(DashboardObjectTasks.addObject(webPageObject));

      dashboard.items.push({ row: 0, column: 0, item: webPageObject });

      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Navigate to the dashboard page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the web page object displays', async () => {
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardItem(webPageObject.name)).isVisible();
    });

    await test.step('Delete the web page object', async () => {
      await sysAdminActor.attemptsTo(
        DashboardTasks.openDesignerFromDashboard(),
        DashboardObjectTasks.deleteObject(webPageObject.name),
        DashboardTasks.saveAndCloseDesigner()
      );
    });

    await test.step('Verify the web page object is deleted', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardItem(webPageObject.name)).isHidden();
    });
  });

  test('Verify an App Search object displays and functions as expected', async ({ app, dashboard, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-770',
    });

    let createdRecordId: number;

    const appSearchObject = new AppSearch({
      name: FakeDataFactory.createFakeDashboardObjectName(),
      apps: [app.name],
    });

    dashboardObjectsToDelete.push(appSearchObject);

    await test.step('Create a content record in the source app', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id), ContentTasks.saveRecord());
      createdRecordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add an app search object', async () => {
      await sysAdminActor.attemptsTo(DashboardObjectTasks.addObject(appSearchObject));

      dashboard.items.push({ row: 0, column: 0, item: appSearchObject });

      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Navigate to dashboard, search for the created record, and verify it displays in results', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
      await sysAdminActor
        .browse()
        .fill(DashboardPageTargets.dashboardItemSearchBox(appSearchObject.name, app.name), createdRecordId.toString());
      await sysAdminActor.browse().click(DashboardPageTargets.dashboardItemSearchButton(appSearchObject.name));
      await sysAdminActor.browse().waitForUrl(ContentRecordTargets.appContentPathRegex);
      await sysAdminActor.browse().checkPage().hasUrl(ContentRecordTargets.appContentPathRegex);
    });
  });

  test('Verify a Create Content Links object displays and functions as expected', async ({
    app,
    dashboard,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-771',
    });

    const createContentLinksObject = new CreateContentLinks({
      name: FakeDataFactory.createFakeDashboardObjectName(),
      links: [{ app: app.name, imageSource: { src: 'App' }, linkText: 'Test Link' }],
    });

    dashboardObjectsToDelete.push(createContentLinksObject);

    await test.step('Navigate to the dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add a create content links object', async () => {
      await sysAdminActor.attemptsTo(DashboardObjectTasks.addObject(createContentLinksObject));

      dashboard.items.push({ row: 0, column: 1, item: createContentLinksObject });

      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Navigate to the dashboard page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify create content link takes you to add content page for the app', async () => {
      await sysAdminActor
        .browse()
        .click(DashboardPageTargets.dashboardItemLink(createContentLinksObject.name, 'Test Link'));
      await sysAdminActor.browse().waitForUrl(ContentRecordTargets.addPathRegex);

      const appId = await sysAdminActor.asks(ContentQuestions.currentAddAppId());
      expect(appId).toBe(app.id);
    });
  });

  test('Verify a Formatted Text Block object displays and functions as expected', async ({
    dashboard,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-772',
    });

    const formattedTextBlock = new FormattedTextBlock({
      name: FakeDataFactory.createFakeDashboardObjectName(),
      formattedText: 'Test formatted text block',
    });

    dashboardObjectsToDelete.push(formattedTextBlock);

    await test.step('Navigate to the dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add a formatted text block object', async () => {
      await sysAdminActor.attemptsTo(DashboardObjectTasks.addObject(formattedTextBlock));

      dashboard.items.push({ row: 0, column: 0, item: formattedTextBlock });

      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Navigate to the dashboard page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the formatted text block object displays as expected', async () => {
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardItem(formattedTextBlock.name)).isVisible();
      await sysAdminActor
        .browse()
        .check(DashboardPageTargets.dashboardItemHeading(formattedTextBlock.name, formattedTextBlock.name))
        .isVisible();
      await sysAdminActor
        .browse()
        .check(DashboardPageTargets.dashboardItemText(formattedTextBlock.name, formattedTextBlock.formattedText))
        .isVisible();
    });
  });

  test('Verify a Web Page object displays and functions as expected', async ({ dashboard, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-773',
    });

    const webPageObject = new WebPage({
      name: FakeDataFactory.createFakeDashboardObjectName(),
      url: 'https://stevanfreeborn.com',
    });

    dashboardObjectsToDelete.push(webPageObject);

    await test.step('Navigate to the dashboards admin page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add a web page object', async () => {
      await sysAdminActor.attemptsTo(DashboardObjectTasks.addObject(webPageObject));

      dashboard.items.push({ row: 0, column: 0, item: webPageObject });

      await sysAdminActor.attemptsTo(DashboardTasks.updateInDesigner(dashboard), DashboardTasks.saveAndCloseDesigner());
    });

    await test.step('Navigate to the dashboard page', async () => {
      await sysAdminActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the web page object displays as expected', async () => {
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardItem(webPageObject.name)).isVisible();
      await sysAdminActor.browse().check(DashboardPageTargets.dashboardItemIframe(webPageObject.name)).isVisible();
      await sysAdminActor
        .browse()
        .check(DashboardPageTargets.dashboardItemIframe(webPageObject.name))
        .hasAttribute('src', webPageObject.url);
    });
  });
});
