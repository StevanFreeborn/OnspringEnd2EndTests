import {
  App,
  BarGaugeKeyMetric,
  BulbGaugeKeyMetric,
  Container,
  Dashboard,
  DialGaugeKeyMetric,
  DonutGaugeKeyMetric,
  FakeDataFactory,
  KeyMetric,
  SavedReportAsReportDataOnly,
  SingleValueKeyMetric,
  TextField,
  User,
} from '@stevanfreeborn/onspring-models';
import {
  AppTasks,
  ContentQuestions,
  ContentTasks,
  DashboardPageTargets,
  DashboardTasks,
  KeyMetricTasks,
  ReportTasks,
} from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import {
  ActorFixture,
  AppFixture,
  ContainerFixture,
  DashboardFixture,
  UserFixture,
  test as base,
  expect,
} from '../../fixtures';
import { AnnotationType } from '../annotations';
import { Tags } from '../tags';

type KeyMetricTestFixtures = {
  sourceApp: App;
  container: Container;
  dashboard: Dashboard;
  user: User;
  testUserActor: WebActor;
};

const test = base.extend<KeyMetricTestFixtures>({
  sourceApp: AppFixture.create().build(),
  container: ContainerFixture.create().build(),
  dashboard: DashboardFixture.create()
    .withContainers(({ container }) => [container.name])
    .build(),
  user: UserFixture.create().withStatus('Active').withSysAdmin(true).build(),
  testUserActor: ActorFixture.forUser().build(),
});

test.describe('key metrics', () => {
  let keyMetricsToDelete: KeyMetric[] = [];

  test.afterEach(async ({ testUserActor, dashboard }) => {
    if (keyMetricsToDelete.length === 0) {
      return;
    }

    const metrics = [...keyMetricsToDelete];
    keyMetricsToDelete = [];

    await testUserActor.attemptsTo(
      DashboardTasks.gotoAdminPage(),
      DashboardTasks.openDesignerFromAdminPage(dashboard.name)
    );

    for (const keyMetric of metrics) {
      await testUserActor.attemptsTo(KeyMetricTasks.deleteKeyMetric(keyMetric.objectName));
    }

    await testUserActor.attemptsTo(DashboardTasks.closeDesigner());
  });

  test('Add a new single value key metric with an app/survey field source', async ({
    sourceApp,
    dashboard,
    testUserActor,
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
    keyMetricsToDelete.push(keyMetric);

    await test.step('Navigate to the dashboards admin page', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await testUserActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add key metric to the dashboard', async () => {
      await testUserActor.attemptsTo(
        KeyMetricTasks.addKeyMetric(keyMetric),
        DashboardTasks.addItemToDashboard({ row: 0, column: 0, item: keyMetric }),
        DashboardTasks.saveAndCloseDesigner()
      );
    });

    await test.step('Navigate to the dashboard page', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the key metric was added successfully', async () => {
      await testUserActor.browse().check(DashboardPageTargets.dashboardItem(keyMetric.objectName)).isVisible();
    });
  });

  test('Add a new single value key metric with a content record field source', async ({
    sourceApp,
    dashboard,
    sysAdminActor,
    testUserActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-775',
    });

    let recordId = 0;

    await test.step('Create a content record in the source app', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(sourceApp.id), ContentTasks.saveRecord());
      recordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
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
    keyMetricsToDelete.push(keyMetric);

    await test.step('Navigate to the dashboards admin page', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await testUserActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add key metric to the dashboard', async () => {
      await testUserActor.attemptsTo(
        KeyMetricTasks.addKeyMetric(keyMetric),
        DashboardTasks.addItemToDashboard({ row: 0, column: 0, item: keyMetric }),
        DashboardTasks.saveAndCloseDesigner()
      );
    });

    await test.step('Navigate to the dashboard page', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the key metric was added successfully', async () => {
      await testUserActor.browse().check(DashboardPageTargets.dashboardItem(keyMetric.objectName)).isVisible();
    });
  });

  test('Add a new single value key metric with a report field source', async ({
    sourceApp,
    dashboard,
    sysAdminActor,
    testUserActor,
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
      await sysAdminActor.attemptsTo(ReportTasks.createSavedDataReport(sourceApp.id, report));
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
    keyMetricsToDelete.push(keyMetric);

    await test.step('Navigate to the dashboards admin page', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await testUserActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add key metric to the dashboard', async () => {
      await testUserActor.attemptsTo(
        KeyMetricTasks.addKeyMetric(keyMetric),
        DashboardTasks.addItemToDashboard({ row: 0, column: 0, item: keyMetric }),
        DashboardTasks.saveAndCloseDesigner()
      );
    });

    await test.step('Navigate to the dashboard page', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the key metric was added successfully', async () => {
      await testUserActor.browse().check(DashboardPageTargets.dashboardItem(keyMetric.objectName)).isVisible();
    });
  });

  test('Modify an existing key metric', async ({ sourceApp, dashboard, testUserActor }) => {
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
      await testUserActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Create a key metric to update', async () => {
      await testUserActor.attemptsTo(
        DashboardTasks.openDesignerFromAdminPage(dashboard.name),
        KeyMetricTasks.addKeyMetric(keyMetric),
        DashboardTasks.addItemToDashboard({ row: 0, column: 0, item: keyMetric }),
        DashboardTasks.saveAndCloseDesigner()
      );
    });

    await test.step('Update the key metric', async () => {
      const updatedKeyMetric = keyMetric.clone();
      updatedKeyMetric.objectName = updatedKeyMetricName;
      keyMetricsToDelete.push(updatedKeyMetric);

      await testUserActor.attemptsTo(
        DashboardTasks.openDesignerFromAdminPage(dashboard.name),
        KeyMetricTasks.updateKeyMetric(keyMetric.objectName, updatedKeyMetric),
        DashboardTasks.closeDesigner()
      );
    });

    await test.step('Navigate to the dashboard page', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the key metric was updated successfully', async () => {
      await testUserActor.browse().check(DashboardPageTargets.dashboardItem(updatedKeyMetricName)).isVisible();
    });
  });

  test('Delete a key metric', async ({ sourceApp, dashboard, testUserActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-778',
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
      await testUserActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Create a key metric to delete', async () => {
      await testUserActor.attemptsTo(
        DashboardTasks.openDesignerFromAdminPage(dashboard.name),
        KeyMetricTasks.addKeyMetric(keyMetric),
        DashboardTasks.addItemToDashboard({ row: 0, column: 0, item: keyMetric }),
        DashboardTasks.saveAndCloseDesigner()
      );
    });

    await test.step('Navigate to the dashboard page', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the key metric was created successfully', async () => {
      await testUserActor.browse().check(DashboardPageTargets.dashboardItem(keyMetric.objectName)).isVisible();
    });

    await test.step('Navigate back to the dashboards admin page', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Delete the key metric', async () => {
      await testUserActor.attemptsTo(
        DashboardTasks.openDesignerFromAdminPage(dashboard.name),
        KeyMetricTasks.deleteKeyMetric(keyMetric.objectName),
        DashboardTasks.closeDesigner()
      );
    });

    await test.step('Navigate to the dashboard page', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the key metric was deleted successfully', async () => {
      await testUserActor.browse().check(DashboardPageTargets.dashboardItem(keyMetric.objectName)).isHidden();
    });
  });

  test(
    'Verify an app/survey single value key metric displays and functions as expected',
    { tag: [Tags.Snapshot] },
    async ({ sourceApp, dashboard, testUserActor }) => {
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
      keyMetricsToDelete.push(keyMetric);

      await test.step('Navigate to the dashboards admin page', async () => {
        await testUserActor.attemptsTo(DashboardTasks.gotoAdminPage());
      });

      await test.step('Open the dashboard designer', async () => {
        await testUserActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
      });

      await test.step('Add key metric to the dashboard', async () => {
        await testUserActor.attemptsTo(
          KeyMetricTasks.addKeyMetric(keyMetric),
          DashboardTasks.addItemToDashboard({ row: 0, column: 0, item: keyMetric }),
          DashboardTasks.saveAndCloseDesigner()
        );
      });

      await test.step('Navigate to the dashboard page', async () => {
        await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
      });

      await test.step('Verify the key metric displays as expected', async () => {
        await testUserActor.attemptsTo(KeyMetricTasks.normalizeTitleForScreenshot(keyMetric.objectName));
        await testUserActor.browse().check(DashboardPageTargets.dashboardItem('Key Metric')).hasScreenshot();
      });
    }
  );

  test(
    'Verify a content record single value key metric displays and functions as expected',
    { tag: [Tags.Snapshot] },
    async ({ sourceApp, dashboard, sysAdminActor, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-780',
      });

      let recordId = 0;

      const tabName = 'Tab 2';
      const sectionName = 'Section 1';
      const textField = new TextField({
        name: FakeDataFactory.createFakeFieldName(),
      });

      await test.step('Add a text field to the source app', async () => {
        await sysAdminActor.attemptsTo(
          AppTasks.gotoApp(sourceApp.id),
          AppTasks.openLayoutDesigner(),
          AppTasks.addTextFieldInLayoutDesigner(textField.name),
          AppTasks.dragFieldOntoLayout({
            tabName,
            sectionName,
            row: 0,
            column: 0,
            fieldName: textField.name,
          }),
          AppTasks.saveAndCloseLayout()
        );
      });

      await test.step('Create a content record in the source app', async () => {
        await sysAdminActor.attemptsTo(
          ContentTasks.gotoAdd(sourceApp.id),
          ContentTasks.fillTextField({
            tabName,
            sectionName,
            fieldName: textField.name,
            value: 'Test Value',
          }),
          ContentTasks.saveRecord()
        );
        recordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
        expect(recordId).toBeGreaterThan(0);
      });

      const keyMetric = new SingleValueKeyMetric({
        objectName: FakeDataFactory.createFakeKeyMetricName(),
        appOrSurvey: sourceApp.name,
        fieldSource: {
          type: 'Content Record',
          record: recordId.toString(),
          field: textField.name,
        },
      });
      keyMetricsToDelete.push(keyMetric);

      await test.step('Navigate to the dashboards admin page', async () => {
        await testUserActor.attemptsTo(DashboardTasks.gotoAdminPage());
      });

      await test.step('Open the dashboard designer', async () => {
        await testUserActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
      });

      await test.step('Add key metric to the dashboard', async () => {
        await testUserActor.attemptsTo(
          KeyMetricTasks.addKeyMetric(keyMetric),
          DashboardTasks.addItemToDashboard({ row: 0, column: 0, item: keyMetric }),
          DashboardTasks.saveAndCloseDesigner()
        );
      });

      await test.step('Navigate to the dashboard page', async () => {
        await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
      });

      await test.step('Verify the key metric displays as expected', async () => {
        await testUserActor.attemptsTo(KeyMetricTasks.normalizeTitleForScreenshot(keyMetric.objectName));
        await testUserActor.browse().check(DashboardPageTargets.dashboardItem('Key Metric')).hasScreenshot();
      });
    }
  );

  test('Verify a report single value key metric displays and functions as expected', async ({
    sourceApp,
    dashboard,
    sysAdminActor,
    testUserActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-781',
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
      security: 'Public',
    });

    await test.step('Create a report in the source app', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.createSavedDataReport(sourceApp.id, report));
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
    keyMetricsToDelete.push(keyMetric);

    await test.step('Navigate to the dashboards admin page', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await testUserActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add key metric to the dashboard', async () => {
      await testUserActor.attemptsTo(
        KeyMetricTasks.addKeyMetric(keyMetric),
        DashboardTasks.addItemToDashboard({ row: 0, column: 0, item: keyMetric }),
        DashboardTasks.saveAndCloseDesigner()
      );
    });

    await test.step('Navigate to the dashboard page', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the key metric displays as expected', async () => {
      await testUserActor.attemptsTo(KeyMetricTasks.normalizeTitleForScreenshot(keyMetric.objectName));
      await testUserActor.browse().check(DashboardPageTargets.dashboardItem('Key Metric')).hasScreenshot();
    });
  });

  test('Add a new dial gauge key metric', async ({ sourceApp, dashboard, testUserActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-795',
    });

    const keyMetric = new DialGaugeKeyMetric({
      objectName: FakeDataFactory.createFakeKeyMetricName(),
      appOrSurvey: sourceApp.name,
      fieldSource: {
        type: 'App/Survey',
        aggregate: { fn: 'Count (of Records Returned)' },
      },
      valueRanges: [{ rangeStop: 50 }, { rangeStop: 100 }],
      totalSource: {
        type: 'Static',
        totalValue: 10,
      },
    });
    keyMetricsToDelete.push(keyMetric);

    await test.step('Navigate to the dashboards admin page', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await testUserActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add key metric to the dashboard', async () => {
      await testUserActor.attemptsTo(
        KeyMetricTasks.addKeyMetric(keyMetric),
        DashboardTasks.addItemToDashboard({ row: 0, column: 0, item: keyMetric }),
        DashboardTasks.saveAndCloseDesigner()
      );
    });

    await test.step('Navigate to the dashboard page', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the key metric was added successfully', async () => {
      await testUserActor.browse().check(DashboardPageTargets.dashboardItem(keyMetric.objectName)).isVisible();
    });
  });

  test('Add a new donut gauge key metric', async ({ sourceApp, dashboard, testUserActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-796',
    });

    const keyMetric = new DonutGaugeKeyMetric({
      objectName: FakeDataFactory.createFakeKeyMetricName(),
      appOrSurvey: sourceApp.name,
      fieldSource: {
        type: 'App/Survey',
        aggregate: { fn: 'Count (of Records Returned)' },
      },
      colorDisplay: {
        type: 'Selected Color',
        color: '#FF0000',
        label: 'Red',
      },
      totalSource: {
        type: 'Static',
        totalValue: 10,
      },
    });
    keyMetricsToDelete.push(keyMetric);

    await test.step('Navigate to the dashboards admin page', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await testUserActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add key metric to the dashboard', async () => {
      await testUserActor.attemptsTo(
        KeyMetricTasks.addKeyMetric(keyMetric),
        DashboardTasks.addItemToDashboard({ row: 0, column: 0, item: keyMetric }),
        DashboardTasks.saveAndCloseDesigner()
      );
    });

    await test.step('Navigate to the dashboard page', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the key metric was added successfully', async () => {
      await testUserActor.browse().check(DashboardPageTargets.dashboardItem(keyMetric.objectName)).isVisible();
    });
  });

  test('Add a new bar gauge key metric', async ({ sourceApp, dashboard, testUserActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-797',
    });

    const keyMetric = new BarGaugeKeyMetric({
      objectName: FakeDataFactory.createFakeKeyMetricName(),
      appOrSurvey: sourceApp.name,
      fieldSource: {
        type: 'App/Survey',
        aggregate: { fn: 'Count (of Records Returned)' },
      },
      valueRanges: [{ rangeStop: 50 }, { rangeStop: 100 }],
      totalSource: {
        type: 'Static',
        totalValue: 10,
      },
    });
    keyMetricsToDelete.push(keyMetric);

    await test.step('Navigate to the dashboards admin page', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await testUserActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add key metric to the dashboard', async () => {
      await testUserActor.attemptsTo(
        KeyMetricTasks.addKeyMetric(keyMetric),
        DashboardTasks.addItemToDashboard({ row: 0, column: 0, item: keyMetric }),
        DashboardTasks.saveAndCloseDesigner()
      );
    });

    await test.step('Navigate to the dashboard page', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the key metric was added successfully', async () => {
      await testUserActor.browse().check(DashboardPageTargets.dashboardItem(keyMetric.objectName)).isVisible();
    });
  });

  test('Add a new bulb gauge key metric', async ({ sourceApp, dashboard, testUserActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-798',
    });

    const keyMetric = new BulbGaugeKeyMetric({
      objectName: FakeDataFactory.createFakeKeyMetricName(),
      appOrSurvey: sourceApp.name,
      fieldSource: {
        type: 'App/Survey',
        aggregate: { fn: 'Count (of Records Returned)' },
      },
      colorDisplay: {
        type: 'Selected Color',
        color: '#00FF00',
        label: 'Green',
      },
    });
    keyMetricsToDelete.push(keyMetric);

    await test.step('Navigate to the dashboards admin page', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoAdminPage());
    });

    await test.step('Open the dashboard designer', async () => {
      await testUserActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
    });

    await test.step('Add key metric to the dashboard', async () => {
      await testUserActor.attemptsTo(
        KeyMetricTasks.addKeyMetric(keyMetric),
        DashboardTasks.addItemToDashboard({ row: 0, column: 0, item: keyMetric }),
        DashboardTasks.saveAndCloseDesigner()
      );
    });

    await test.step('Navigate to the dashboard page', async () => {
      await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
    });

    await test.step('Verify the key metric was added successfully', async () => {
      await testUserActor.browse().check(DashboardPageTargets.dashboardItem(keyMetric.objectName)).isVisible();
    });
  });

  test(
    'Verify a bulb gauge key metric displays and functions as expected',
    { tag: [Tags.Snapshot] },
    async ({ sourceApp, dashboard, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-799',
      });

      const keyMetric = new BulbGaugeKeyMetric({
        objectName: FakeDataFactory.createFakeKeyMetricName(),
        appOrSurvey: sourceApp.name,
        fieldSource: {
          type: 'App/Survey',
          aggregate: { fn: 'Count (of Records Returned)' },
        },
        colorDisplay: {
          type: 'Selected Color',
          color: '#00FF00',
          label: 'Green',
        },
      });
      keyMetricsToDelete.push(keyMetric);

      await test.step('Navigate to the dashboards admin page', async () => {
        await testUserActor.attemptsTo(DashboardTasks.gotoAdminPage());
      });

      await test.step('Open the dashboard designer', async () => {
        await testUserActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
      });

      await test.step('Add key metric to the dashboard', async () => {
        await testUserActor.attemptsTo(
          KeyMetricTasks.addKeyMetric(keyMetric),
          DashboardTasks.addItemToDashboard({ row: 0, column: 0, item: keyMetric }),
          DashboardTasks.saveAndCloseDesigner()
        );
      });

      await test.step('Navigate to the dashboard page', async () => {
        await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
      });

      await test.step('Verify the key metric displays as expected', async () => {
        await testUserActor.attemptsTo(KeyMetricTasks.normalizeTitleForScreenshot(keyMetric.objectName));
        await testUserActor.browse().check(DashboardPageTargets.dashboardItem('Key Metric')).hasScreenshot();
      });
    }
  );

  test(
    'Verify a bar gauge key metric displays and functions as expected',
    { tag: [Tags.Snapshot] },
    async ({ sourceApp, dashboard, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-800',
      });

      const keyMetric = new BarGaugeKeyMetric({
        objectName: FakeDataFactory.createFakeKeyMetricName(),
        appOrSurvey: sourceApp.name,
        fieldSource: {
          type: 'App/Survey',
          aggregate: { fn: 'Count (of Records Returned)' },
        },
        valueRanges: [{ rangeStop: 50 }, { rangeStop: 100 }],
        totalSource: {
          type: 'Static',
          totalValue: 10,
        },
      });
      keyMetricsToDelete.push(keyMetric);

      await test.step('Navigate to the dashboards admin page', async () => {
        await testUserActor.attemptsTo(DashboardTasks.gotoAdminPage());
      });

      await test.step('Open the dashboard designer', async () => {
        await testUserActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
      });

      await test.step('Add key metric to the dashboard', async () => {
        await testUserActor.attemptsTo(
          KeyMetricTasks.addKeyMetric(keyMetric),
          DashboardTasks.addItemToDashboard({ row: 0, column: 0, item: keyMetric }),
          DashboardTasks.saveAndCloseDesigner()
        );
      });

      await test.step('Navigate to the dashboard page', async () => {
        await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
      });

      await test.step('Verify the key metric displays as expected', async () => {
        await testUserActor.attemptsTo(KeyMetricTasks.normalizeTitleForScreenshot(keyMetric.objectName));
        await testUserActor.browse().check(DashboardPageTargets.dashboardItem('Key Metric')).hasScreenshot();
      });
    }
  );

  test(
    'Verify a donut gauge key metric displays and functions as expected',
    { tag: [Tags.Snapshot] },
    async ({ sourceApp, dashboard, sysAdminActor, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-801',
      });

      await test.step('Create a content record in the source app', async () => {
        await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(sourceApp.id), ContentTasks.saveRecord());
        const recordId = await sysAdminActor.asks(ContentQuestions.currentRecordId());
        expect(recordId).toBeGreaterThan(0);
      });

      const keyMetric = new DonutGaugeKeyMetric({
        objectName: FakeDataFactory.createFakeKeyMetricName(),
        appOrSurvey: sourceApp.name,
        fieldSource: {
          type: 'App/Survey',
          aggregate: { fn: 'Count (of Records Returned)' },
        },
        colorDisplay: {
          type: 'Selected Color',
          color: '#FF0000',
          label: 'Red',
        },
        totalSource: {
          type: 'Static',
          totalValue: 2,
        },
      });
      keyMetricsToDelete.push(keyMetric);

      await test.step('Navigate to the dashboards admin page', async () => {
        await testUserActor.attemptsTo(DashboardTasks.gotoAdminPage());
      });

      await test.step('Open the dashboard designer', async () => {
        await testUserActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
      });

      await test.step('Add key metric to the dashboard', async () => {
        await testUserActor.attemptsTo(
          KeyMetricTasks.addKeyMetric(keyMetric),
          DashboardTasks.addItemToDashboard({ row: 0, column: 0, item: keyMetric }),
          DashboardTasks.saveAndCloseDesigner()
        );
      });

      await test.step('Navigate to the dashboard page', async () => {
        await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
      });

      await test.step('Verify the key metric displays as expected', async () => {
        await testUserActor.attemptsTo(KeyMetricTasks.normalizeTitleForScreenshot(keyMetric.objectName));
        await testUserActor.browse().check(DashboardPageTargets.dashboardItem('Key Metric')).hasScreenshot();
      });
    }
  );

  test(
    'Verify a dial gauge key metric displays and functions as expected',
    { tag: [Tags.Snapshot] },
    async ({ sourceApp, dashboard, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-802',
      });

      const keyMetric = new DialGaugeKeyMetric({
        objectName: FakeDataFactory.createFakeKeyMetricName(),
        appOrSurvey: sourceApp.name,
        fieldSource: {
          type: 'App/Survey',
          aggregate: { fn: 'Count (of Records Returned)' },
        },
        valueRanges: [{ rangeStop: 50 }, { rangeStop: 100 }],
        totalSource: {
          type: 'Static',
          totalValue: 10,
        },
      });
      keyMetricsToDelete.push(keyMetric);

      await test.step('Navigate to the dashboards admin page', async () => {
        await testUserActor.attemptsTo(DashboardTasks.gotoAdminPage());
      });

      await test.step('Open the dashboard designer', async () => {
        await testUserActor.attemptsTo(DashboardTasks.openDesignerFromAdminPage(dashboard.name));
      });

      await test.step('Add key metric to the dashboard', async () => {
        await testUserActor.attemptsTo(
          KeyMetricTasks.addKeyMetric(keyMetric),
          DashboardTasks.addItemToDashboard({ row: 0, column: 0, item: keyMetric }),
          DashboardTasks.saveAndCloseDesigner()
        );
      });

      await test.step('Navigate to the dashboard page', async () => {
        await testUserActor.attemptsTo(DashboardTasks.gotoDashboard(dashboard.id));
      });

      await test.step('Verify the key metric displays as expected', async () => {
        await testUserActor.attemptsTo(KeyMetricTasks.normalizeTitleForScreenshot(keyMetric.objectName));
        await testUserActor.browse().check(DashboardPageTargets.dashboardItem('Key Metric')).hasScreenshot();
      });
    }
  );
});
