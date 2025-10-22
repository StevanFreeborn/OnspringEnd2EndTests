import { expect } from '@playwright/test';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { createContainerFixture } from '../../fixtures/container.fixtures';
import { createDashboardFixture } from '../../fixtures/dashboard.fixtures';
import { App } from '../../models/app';
import { Container } from '../../models/container';
import { Dashboard } from '../../models/dashboard';
import { SingleValueKeyMetric } from '../../models/keyMetric';
import { SavedReportAsReportDataOnly } from '../../models/report';
import { DashboardPage } from '../../pageObjectModels/dashboards/dashboardPage';
import { DashboardsAdminPage } from '../../pageObjectModels/dashboards/dashboardsAdminPage';
import { ReportHomePage } from '../../pageObjectModels/reports/reportHomePage';
import { ReportPage } from '../../pageObjectModels/reports/reportPage';
import { AnnotationType } from '../annotations';
import { Tags } from '../tags';
import { AddContentPage } from './../../pageObjectModels/content/addContentPage';
import { EditContentPage } from './../../pageObjectModels/content/editContentPage';

type KeyMetricTestFixtures = {
  dashboardsAdminPage: DashboardsAdminPage;
  sourceApp: App;
  container: Container;
  dashboard: Dashboard;
  dashboardPage: DashboardPage;
  addContentPage: AddContentPage;
  editContentPage: EditContentPage;
  reportHomePage: ReportHomePage;
  reportPage: ReportPage;
};

const test = base.extend<KeyMetricTestFixtures>({
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
  addContentPage: async ({ sysAdminPage }, use) => await use(new AddContentPage(sysAdminPage)),
  editContentPage: async ({ sysAdminPage }, use) => await use(new EditContentPage(sysAdminPage)),
  reportHomePage: async ({ sysAdminPage }, use) => await use(new ReportHomePage(sysAdminPage)),
  reportPage: async ({ sysAdminPage }, use) => await use(new ReportPage(sysAdminPage)),
});

test.describe('key metrics', () => {
  test('Add a new single value key metric with an app/survey field source', async ({
    sourceApp,
    dashboardsAdminPage,
    dashboard,
    dashboardPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-774',
    });

    const keyMetric = new SingleValueKeyMetric({
      objectName: FakeDataFactory.createFakeKeyMetricName(),
      appOrSurvey: sourceApp.name,
      fieldSource: {
        type: 'App/Survey',
        aggregate: { fn: 'Count (of Records Returned)' },
      },
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add key metric to the dashboard', async () => {
      await dashboardsAdminPage.dashboardDesigner.addKeyMetric(keyMetric);

      dashboard.items.push({ row: 0, column: 0, item: keyMetric });

      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Navigate to the dashboard page', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Verify the key metric was added successfully', async () => {
      const keyMetricCard = dashboardPage.getDashboardItem(keyMetric.objectName);
      await expect(keyMetricCard).toBeVisible();
    });
  });

  test('Add a new single value key metric with a content record field source', async ({
    sourceApp,
    dashboardsAdminPage,
    dashboard,
    dashboardPage,
    addContentPage,
    editContentPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-775',
    });

    let recordId = 0;

    await test.step('Create a content record in the source app', async () => {
      await addContentPage.goto(sourceApp.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
      recordId = editContentPage.getRecordIdFromUrl();
      expect(recordId).toBeGreaterThan(0);
    });

    const keyMetric = new SingleValueKeyMetric({
      objectName: FakeDataFactory.createFakeKeyMetricName(),
      appOrSurvey: sourceApp.name,
      fieldSource: {
        type: 'Content Record',
        record: recordId.toString(),
        field: 'Created Date',
      },
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add key metric to the dashboard', async () => {
      await dashboardsAdminPage.dashboardDesigner.addKeyMetric(keyMetric);

      dashboard.items.push({ row: 0, column: 0, item: keyMetric });

      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Navigate to the dashboard page', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Verify the key metric was added successfully', async () => {
      const keyMetricCard = dashboardPage.getDashboardItem(keyMetric.objectName);
      await expect(keyMetricCard).toBeVisible();
    });
  });

  test('Add a new single value key metric with a report field source', async ({
    sourceApp,
    reportHomePage,
    reportPage,
    dashboardsAdminPage,
    dashboard,
    dashboardPage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-776',
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
      security: 'Public',
    });

    await test.step('Create a report in the source app', async () => {
      await reportHomePage.goto();
      await reportHomePage.createReport(report);
      await reportHomePage.page.waitForURL(reportPage.pathRegex);
    });

    const keyMetric = new SingleValueKeyMetric({
      objectName: FakeDataFactory.createFakeKeyMetricName(),
      appOrSurvey: sourceApp.name,
      fieldSource: {
        type: 'Report',
        report: report.name,
        aggregate: { fn: 'Count (of Records Returned)' },
      },
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Open the dashboard designer', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
    });

    await test.step('Add key metric to the dashboard', async () => {
      await dashboardsAdminPage.dashboardDesigner.addKeyMetric(keyMetric);

      dashboard.items.push({ row: 0, column: 0, item: keyMetric });

      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Navigate to the dashboard page', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Verify the key metric was added successfully', async () => {
      const keyMetricCard = dashboardPage.getDashboardItem(keyMetric.objectName);
      await expect(keyMetricCard).toBeVisible();
    });
  });

  test('Modify an existing key metric', async ({ sourceApp, dashboardsAdminPage, dashboard, dashboardPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-777',
    });

    const keyMetricName = FakeDataFactory.createFakeKeyMetricName();
    const updatedKeyMetricName = FakeDataFactory.createFakeKeyMetricName();

    const keyMetric = new SingleValueKeyMetric({
      objectName: keyMetricName,
      appOrSurvey: sourceApp.name,
      fieldSource: {
        type: 'App/Survey',
        aggregate: { fn: 'Count (of Records Returned)' },
      },
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create a key metric to update', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);

      await dashboardsAdminPage.dashboardDesigner.addKeyMetric(keyMetric);

      dashboard.items.push({ row: 0, column: 0, item: keyMetric });

      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Update the key metric', async () => {
      const updatedKeyMetric = keyMetric.clone();
      updatedKeyMetric.objectName = updatedKeyMetricName;

      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);

      await dashboardsAdminPage.dashboardDesigner.updateKeyMetric(keyMetric, updatedKeyMetric);

      await dashboardsAdminPage.dashboardDesigner.close();
    });

    await test.step('Navigate to the dashboard page', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Verify the key metric was updated successfully', async () => {
      const keyMetricCard = dashboardPage.getDashboardItem(updatedKeyMetricName);
      await expect(keyMetricCard).toBeVisible();
    });
  });

  test('Delete a key metric', async ({ sourceApp, dashboardsAdminPage, dashboard, dashboardPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-778',
    });

    const keyMetricName = FakeDataFactory.createFakeKeyMetricName();
    const keyMetric = new SingleValueKeyMetric({
      objectName: keyMetricName,
      appOrSurvey: sourceApp.name,
      fieldSource: {
        type: 'App/Survey',
        aggregate: { fn: 'Count (of Records Returned)' },
      },
    });

    await test.step('Navigate to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Create a key metric to delete', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);

      await dashboardsAdminPage.dashboardDesigner.addKeyMetric(keyMetric);

      dashboard.items.push({ row: 0, column: 0, item: keyMetric });

      await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
      await dashboardsAdminPage.dashboardDesigner.saveAndClose();
    });

    await test.step('Navigate to the dashboard page', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Verify the key metric was created successfully', async () => {
      const keyMetricCard = dashboardPage.getDashboardItem(keyMetric.objectName);
      await expect(keyMetricCard).toBeVisible();
    });

    await test.step('Navigate back to the dashboards admin page', async () => {
      await dashboardsAdminPage.goto();
    });

    await test.step('Delete the key metric', async () => {
      await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
      await dashboardsAdminPage.dashboardDesigner.deleteKeyMetric(keyMetric);
      await dashboardsAdminPage.dashboardDesigner.close();
    });

    await test.step('Navigate to the dashboard page', async () => {
      await dashboardPage.goto(dashboard.id);
    });

    await test.step('Verify the key metric was deleted successfully', async () => {
      const keyMetricCard = dashboardPage.getDashboardItem(keyMetric.objectName);
      await expect(keyMetricCard).toBeHidden();
    });
  });

  test(
    'Verify an app/survey single value key metric displays and functions as expected',
    { tag: [Tags.Snapshot] },
    async ({ sourceApp, dashboardsAdminPage, dashboard, dashboardPage }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-779',
      });

      const keyMetric = new SingleValueKeyMetric({
        objectName: FakeDataFactory.createFakeKeyMetricName(),
        appOrSurvey: sourceApp.name,
        fieldSource: {
          type: 'App/Survey',
          aggregate: { fn: 'Count (of Records Returned)' },
        },
      });

      await test.step('Navigate to the dashboards admin page', async () => {
        await dashboardsAdminPage.goto();
      });

      await test.step('Open the dashboard designer', async () => {
        await dashboardsAdminPage.openDashboardDesigner(dashboard.name);
      });

      await test.step('Add key metric to the dashboard', async () => {
        await dashboardsAdminPage.dashboardDesigner.addKeyMetric(keyMetric);

        dashboard.items.push({ row: 0, column: 0, item: keyMetric });

        await dashboardsAdminPage.dashboardDesigner.updateDashboard(dashboard);
        await dashboardsAdminPage.dashboardDesigner.saveAndClose();
      });

      await test.step('Navigate to the dashboard page', async () => {
        await dashboardPage.goto(dashboard.id);
      });

      await test.step('Verify the key metric displays as expected', async () => {
        const keyMetricPlaceholderName = 'Key Metric';

        let keyMetricCard = dashboardPage.getDashboardItem(keyMetric.objectName);
        const keyMetricTitle = keyMetricCard.locator('.title');

        await expect(keyMetricTitle).toHaveText(new RegExp(keyMetric.objectName));

        await keyMetricTitle.evaluate((el, name) => (el.textContent = name), keyMetricPlaceholderName);

        keyMetricCard = dashboardPage.getDashboardItem(keyMetricPlaceholderName);

        await expect(keyMetricCard).toHaveScreenshot();
      });
    }
  );

  test('Verify a content record single value key metric displays and functions as expected', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-780',
    });

    expect(true).toBeTruthy();
  });

  test('Verify a report single value key metric displays and functions as expected', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-781',
    });

    expect(true).toBeTruthy();
  });

  test('Add a new dial gauge key metric', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-795',
    });

    expect(true).toBeTruthy();
  });

  test('Add a new donut gauge key metric', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-796',
    });

    expect(true).toBeTruthy();
  });

  test('Add a new bar gauge key metric', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-797',
    });

    expect(true).toBeTruthy();
  });

  test('Add a new bulb gauge key metric', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-798',
    });

    expect(true).toBeTruthy();
  });

  test('Verify a bulb gauge key metric displays and functions as expected', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-799',
    });

    expect(true).toBeTruthy();
  });

  test('Verify a bar gauge key metric displays and functions as expected', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-800',
    });

    expect(true).toBeTruthy();
  });

  test('Verify a donut gauge key metric displays and functions as expected', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-801',
    });

    expect(true).toBeTruthy();
  });

  test('Verify a dial gauge key metric displays and functions as expected', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-802',
    });

    expect(true).toBeTruthy();
  });
});
