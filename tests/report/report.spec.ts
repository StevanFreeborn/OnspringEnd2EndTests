import {
  App,
  BarChart,
  BubbleChart,
  ColumnChart,
  ColumnPlusLineChart,
  DateField,
  DisplayField,
  DonutChart,
  FakeDataFactory,
  FieldType,
  FunnelChart,
  HeatMapChart,
  LayoutItem,
  LineChart,
  ListField,
  ListValue,
  PieChart,
  PyramidChart,
  RadarChart,
  ReferenceField,
  Report,
  ReportSchedule,
  SavedReportAsCalendar,
  SavedReportAsChart,
  SavedReportAsGanttChart,
  SavedReportAsPointMap,
  SavedReportAsReportDataOnly,
  SplineChart,
  StackedBarChart,
  StackedColumnChart,
  StackedColumnPlusLineChart,
  TextField,
  User,
} from '@stevanfreeborn/onspring-models';
import {
  AppDetailTargets,
  AppLayoutTabTargets,
  AppTasks,
  ContentQuestions,
  ContentTasks,
  ReportAppPageTargets,
  ReportPageTargets,
  ReportQuestions,
  ReportTasks,
} from '@stevanfreeborn/onspring-ui';
import { Task } from '@stevanfreeborn/screenplay';
import { Retry, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ActorFixture, AppFixture, UserFixture, test as base, expect } from '../../fixtures';
import { AnnotationType } from '../annotations';
import { Tags } from '../tags';

type ReportTestFixtures = {
  referencedApp: App;
  sourceApp: App;
  user: User;
  testUserActor: WebActor;
};

const test = base.extend<ReportTestFixtures>({
  referencedApp: AppFixture.create().build(),
  sourceApp: AppFixture.create().build(),
  user: UserFixture.create().withStatus('Active').withSysAdmin(true).build(),
  testUserActor: ActorFixture.forUser().withName('TestUser').build(),
});

test.describe('report', () => {
  test.slow();

  test('Create a report via the "Create Report" button on the report home page', async ({
    sourceApp,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-594',
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
    });

    await test.step('Navigate to the report home page', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.gotoReportHome());
    });

    await test.step('Create the report', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.createFromReportHome(report));
    });

    await test.step('Verify the report was created', async () => {
      await sysAdminActor
        .browse()
        .check(ReportPageTargets.breadcrumb)
        .hasText(new RegExp(`Reports[\\s\\S]*${report.appName}[\\s\\S]*${report.name}`, 'i'));

      await sysAdminActor
        .browse()
        .check(ReportPageTargets.columnHeader(/record id/i))
        .isVisible();
    });
  });

  test('Create a report via the "Create Report" button on an app\'s or survey\'s reports home page.', async ({
    sourceApp,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-595',
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
    });

    await test.step("Navigate to the app's or survey's reports home page", async () => {
      await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
    });

    await test.step('Create the report', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));
    });

    await test.step('Verify the report was created', async () => {
      await sysAdminActor
        .browse()
        .check(ReportPageTargets.breadcrumb)
        .hasText(new RegExp(`Reports[\\s\\S]*${report.appName}[\\s\\S]*${report.name}`, 'i'));

      await sysAdminActor
        .browse()
        .check(ReportPageTargets.columnHeader(/record id/i))
        .isVisible();
    });
  });

  test('Create a copy of a report', async ({ sourceApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-596',
    });

    const reportToCopy = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
    });

    const copy = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
    });

    await test.step('Navigate to the report home page', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.gotoReportHome());
    });

    await test.step('Create the report to copy', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.createFromReportHome(reportToCopy));
    });

    await test.step('Navigate back to the report home page', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.gotoReportHome());
    });

    await test.step('Create a copy of the report', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.createCopyFromReportHome(reportToCopy.name, copy));
    });

    await test.step('Verify the report was created', async () => {
      await sysAdminActor
        .browse()
        .check(ReportPageTargets.breadcrumb)
        .hasText(new RegExp(`Reports[\\s\\S]*${copy.appName}[\\s\\S]*${copy.name}`, 'i'));

      await sysAdminActor
        .browse()
        .check(ReportPageTargets.columnHeader(/record id/i))
        .isVisible();
    });
  });

  test('Update a report', async ({ sourceApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-597',
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
    });

    await test.step('Create the report to update', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));
    });

    await test.step('Update the report', async () => {
      report.name = FakeDataFactory.createFakeReportName();
      await sysAdminActor.attemptsTo(ReportTasks.update(report));
    });

    await test.step('Verify the report was updated', async () => {
      await sysAdminActor
        .browse()
        .check(ReportPageTargets.breadcrumb)
        .hasText(new RegExp(`Reports[\\s\\S]*${report.appName}[\\s\\S]*${report.name}`, 'i'));

      await sysAdminActor
        .browse()
        .check(ReportPageTargets.columnHeader(/record id/i))
        .isVisible();
    });
  });

  test('Delete a report', async ({ sourceApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-598',
    });

    const report = new SavedReportAsReportDataOnly({
      appName: 'Test App',
      name: 'Test Report',
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
    });

    await test.step('Create the report to delete', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));
    });

    await test.step('Delete the report', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.delete());
    });

    await test.step('Verify the report was deleted', async () => {
      await sysAdminActor.browse().check(ReportAppPageTargets.reportRowByName(report.name)).isHidden();
    });
  });

  test('Bulk edit records in a report', async ({ sourceApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-599',
    });

    const fields = getFieldsForApp();
    let records = buildRecords(fields.groupField, fields.seriesField);

    await test.step('Setup source app with fields and records', async () => {
      await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
      records = await addRecordsToApp(sysAdminActor, sourceApp, records);
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
      displayFields: Object.values(fields).map(field => new DisplayField({ name: field.name })),
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
    });

    await test.step('Create the report', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));
    });

    await test.step('Bulk edit records in the report', async () => {
      await sysAdminActor.attemptsTo(
        ReportTasks.selectAllRecords(),
        ReportTasks.bulkEdit([
          {
            field: fields.groupField,
            value: fields.groupField.values[0].value,
          },
        ])
      );
    });

    await test.step('Verify the records were updated', async () => {
      const cellTexts = await sysAdminActor.asks(ReportQuestions.columnCellTexts(fields.groupField.name));
      expect(cellTexts).toHaveLength(records.length);

      for (const cellText of cellTexts) {
        expect(cellText.trim()).toBe(fields.groupField.values[0].value);
      }
    });
  });

  test('Bulk delete records in a report', async ({ sourceApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-600',
    });

    const fields = getFieldsForApp();
    let records = buildRecords(fields.groupField, fields.seriesField);

    await test.step('Setup source app with fields and records', async () => {
      await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
      records = await addRecordsToApp(sysAdminActor, sourceApp, records);
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
    });

    await test.step('Create the report', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));
    });

    await test.step('Bulk delete records in the report', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.selectAllRecords(), ReportTasks.bulkDelete());
    });

    await test.step('Verify the records were deleted', async () => {
      await sysAdminActor.browse().check(ReportPageTargets.gridRows).hasCount(0);
    });
  });

  test('Apply liver filters to a report', async ({ sourceApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-601',
    });

    const fields = getFieldsForApp();
    let records = buildRecords(fields.groupField, fields.seriesField);

    await test.step('Setup source app with fields and records', async () => {
      await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
      records = await addRecordsToApp(sysAdminActor, sourceApp, records);
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
      displayFields: Object.values(fields).map(field => new DisplayField({ name: field.name })),
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
    });

    await test.step('Create the report', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));
    });

    await test.step('Apply live filter to the report', async () => {
      await sysAdminActor.attemptsTo(
        ReportTasks.applyLiveFilter({
          fieldName: fields.groupField.name,
          fieldType: fields.groupField.type as FieldType,
          operator: 'Contains Any',
          value: fields.groupField.values[0].value,
        })
      );
    });

    await test.step('Verify the report has been filtered', async () => {
      await sysAdminActor.browse().check(ReportPageTargets.gridRows).hasCount(3);
    });
  });

  test('Sort a report', async ({ sourceApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-602',
    });

    const fields = getFieldsForApp();
    let records = buildRecords(fields.groupField, fields.seriesField);

    await test.step('Setup source app with fields and records', async () => {
      await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
      records = await addRecordsToApp(sysAdminActor, sourceApp, records);
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
    });

    await test.step('Create the report', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));
    });

    await test.step('Sort the report', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.sortByField({ fieldName: 'Record Id', sortOrder: 'desc' }));
    });

    await test.step('Verify the report has been sorted', async () => {
      const expectedRecordIds = records.map(record => record.id).sort((a, b) => b - a);
      const recordIdTexts = await sysAdminActor.asks(ReportQuestions.columnCellTexts('Record Id'));
      const actualRecordIds = recordIdTexts.filter(id => id !== '').map(id => parseInt(id, 10));

      expect(actualRecordIds).toEqual(expectedRecordIds);
    });
  });

  test('Filter a report', async ({ sourceApp, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-603',
    });

    const fields = getFieldsForApp();
    let records = buildRecords(fields.groupField, fields.seriesField);

    await test.step('Setup source app with fields and records', async () => {
      await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
      records = await addRecordsToApp(sysAdminActor, sourceApp, records);
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
    });

    await test.step('Create the report', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));
    });

    await test.step('Filter the report', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.filterByText('1'));
    });

    await test.step('Verify the report has been filtered', async () => {
      await sysAdminActor.browse().check(ReportPageTargets.gridRows).hasCount(1);
      await sysAdminActor.browse().check(ReportPageTargets.gridRows).hasText(new RegExp('1', 'i'));
    });
  });

  test('Export a report', async ({
    sourceApp,
    sysAdminActor,
    sysAdminUser,
    sysAdminEmail,
    downloadService,
    sheetParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-604',
    });

    const fields = getFieldsForApp();
    let records = buildRecords(fields.groupField, fields.seriesField);

    await test.step('Setup source app with fields and records', async () => {
      await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
      records = await addRecordsToApp(sysAdminActor, sourceApp, records);
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
    });

    await test.step('Create the report', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));
    });

    await test.step('Export the report', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.exportReport());
    });

    let exportEmailContent: string;

    await test.step('Verify the report has been exported', async () => {
      await expect(async () => {
        const searchCriteria = [['TO', sysAdminUser.email], ['TEXT', report.name], ['UNSEEN']];
        const result = await sysAdminEmail.getEmailByQuery(searchCriteria);

        expect(result.isOk()).toBe(true);

        const email = result.unwrap();
        exportEmailContent = email.html as string;
      }).toPass({
        intervals: [30_000],
        timeout: 300_000,
      });
    });

    let reportPath: string;

    await test.step('Download the exported report', async () => {
      const download = await sysAdminActor.asks(ReportQuestions.downloadedExportFromEmailHtml(exportEmailContent));
      reportPath = await downloadService.saveDownload(download);
    });

    await test.step('Verify the exported report contains expected data', async () => {
      const reportData = sheetParser.parseFile(reportPath);
      expect(reportData).toHaveLength(1);

      const sheet = reportData[0];
      expect(sheet.name).toEqual('Report Data');

      const expectedData = records.map(record => ({ 'Record Id': record.id.toString() }));
      expect(sheet.data).toEqual(expectedData);
    });
  });

  test('Print a report', async ({ sourceApp, sysAdminActor, downloadService, pdfParser }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-605',
    });

    const fields = getFieldsForApp();
    let records = buildRecords(fields.groupField, fields.seriesField);

    await test.step('Setup source app with fields and records', async () => {
      await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
      records = await addRecordsToApp(sysAdminActor, sourceApp, records);
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: 'Printed Report',
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
    });

    await test.step('Create the report', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));
    });

    let pdfPath: string;

    await test.step('Print the report to PDF', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.printReport());

      const reportId = await sysAdminActor.asks(ReportQuestions.currentId());
      const { fileName, body } = await sysAdminActor.asks(ReportQuestions.printedPdf(reportId));

      expect(fileName).toBe(`${report.name}.pdf`);

      pdfPath = await downloadService.saveBuffer(Buffer.from(body), fileName);
    });

    await test.step('Verify the printed report contains expected text', async () => {
      const expectedText = [report.name, 'Record Id'].concat(records.map(record => record.id.toString()));
      const foundExpectedText = await pdfParser.findTextInPDF(pdfPath, expectedText);

      expect(foundExpectedText).toBe(true);
    });
  });

  test('Add related data to a report', async ({ sysAdminActor, sourceApp, referencedApp }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-606',
    });

    const initialFields = getFieldsForApp();
    const fields = {
      ...initialFields,
      referenceField: new ReferenceField({
        name: FakeDataFactory.createFakeFieldName(),
        reference: referencedApp.name,
      }),
    };

    let relatedRecordId = '';

    await test.step('Create record in referenced app', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(referencedApp.id), ContentTasks.saveRecord());
      relatedRecordId = (await sysAdminActor.asks(ContentQuestions.currentRecordId())).toString();
    });

    let records = buildRecords(fields.groupField, fields.seriesField, {
      referenceField: fields.referenceField,
      relatedRecordId,
    });

    await test.step('Setup source app with fields and records', async () => {
      await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
      records = await addRecordsToApp(sysAdminActor, sourceApp, records);
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
      relatedData: [
        {
          referenceField: fields.referenceField.name,
          displayFields: [new DisplayField({ name: 'Record Id' })],
        },
      ],
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
    });

    await test.step('Create the report', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));
    });

    await test.step('Verify the report was created', async () => {
      await sysAdminActor.browse().check(ReportPageTargets.masterRows).hasCount(records.length);

      const numOfMasterRows = await sysAdminActor.browse().count(ReportPageTargets.masterRows);

      for (let i = 0; i < numOfMasterRows; i++) {
        await sysAdminActor.attemptsTo(ReportTasks.expandMasterRow(i));

        await sysAdminActor
          .browse()
          .check(ReportPageTargets.detailRowToolbar(i, fields.referenceField.name))
          .isVisible();
        await sysAdminActor.browse().check(ReportPageTargets.detailRowHeader(i, 'Record Id')).isVisible();
        await sysAdminActor.browse().check(ReportPageTargets.detailRowRecord(i, relatedRecordId)).isVisible();
      }
    });
  });

  test('Schedule a report for export', async ({ sourceApp, sysAdminActor, sysAdminEmail }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-607',
    });

    await test.step('Create record in source app', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(sourceApp.id), ContentTasks.saveRecord());
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
    });

    const reportName = FakeDataFactory.createFakeReportName();

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: reportName,
      scheduling: 'Enabled',
      schedule: new ReportSchedule({
        sendFrequency: 'Every Day',
        startingOn: new Date(Date.now() + 2 * 60_000),
        fromName: 'Automation Test',
        fromAddress: FakeDataFactory.createFakeEmailFromAddress(),
        subject: `Scheduled Report ${reportName}`,
        body: 'This is the body of the scheduled report.',
      }),
    });

    await test.step('Create the report', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));
    });

    await test.step('Verify the report is exported', async () => {
      await expect(async () => {
        const searchCriteria = [['TEXT', report.schedule!.subject]];
        const result = await sysAdminEmail.getEmailByQuery(searchCriteria);

        expect(result.isOk()).toBe(true);
      }).toPass({
        intervals: [180_000, 30_000],
        timeout: 420_000,
      });
    });
  });

  test(
    'Configure a bar chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ sourceApp, sysAdminActor, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-608',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
        records = await addRecordsToApp(sysAdminActor, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new BarChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
        }),
        security: 'Public',
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
      });

      await test.step('Create the report', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));

        report.id = await sysAdminActor.asks(ReportQuestions.currentId());
        expect(report.id).not.toBe(0);
      });

      await test.step('Verify the bar chart displays as expected', async () => {
        await prepareReportForScreenshot({ actor: testUserActor, report });
        await testUserActor.browse().check(ReportPageTargets.reportContents).hasScreenshot();
      });
    }
  );

  test(
    'Configure a column chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ sourceApp, sysAdminActor, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-609',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
        records = await addRecordsToApp(sysAdminActor, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new ColumnChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
        }),
        security: 'Public',
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
      });

      await test.step('Create the report', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));

        report.id = await sysAdminActor.asks(ReportQuestions.currentId());
        expect(report.id).not.toBe(0);
      });

      await test.step('Verify the column chart displays as expected', async () => {
        await prepareReportForScreenshot({ actor: testUserActor, report });
        await testUserActor.browse().check(ReportPageTargets.reportContents).hasScreenshot();
      });
    }
  );

  test(
    'Configure a pie chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ sourceApp, sysAdminActor, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-610',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
        records = await addRecordsToApp(sysAdminActor, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new PieChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
        }),
        security: 'Public',
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
      });

      await test.step('Create the report', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));

        report.id = await sysAdminActor.asks(ReportQuestions.currentId());
        expect(report.id).not.toBe(0);
      });

      await test.step('Verify the pie chart displays as expected', async () => {
        await prepareReportForScreenshot({ actor: testUserActor, report });
        await testUserActor.browse().check(ReportPageTargets.reportContents).hasScreenshot();
      });
    }
  );

  test(
    'Configure a donut chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ sourceApp, sysAdminActor, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-611',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
        records = await addRecordsToApp(sysAdminActor, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new DonutChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
        }),
        security: 'Public',
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
      });

      await test.step('Create the report', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));

        report.id = await sysAdminActor.asks(ReportQuestions.currentId());
        expect(report.id).not.toBe(0);
      });

      await test.step('Verify the donut chart displays as expected', async () => {
        await prepareReportForScreenshot({ actor: testUserActor, report });
        await testUserActor.browse().check(ReportPageTargets.reportContents).hasScreenshot();
      });
    }
  );

  test(
    'Configure a line chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ sourceApp, sysAdminActor, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-612',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
        records = await addRecordsToApp(sysAdminActor, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new LineChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
        }),
        security: 'Public',
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
      });

      await test.step('Create the report', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));

        report.id = await sysAdminActor.asks(ReportQuestions.currentId());
        expect(report.id).not.toBe(0);
      });

      await test.step('Verify the line chart displays as expected', async () => {
        await prepareReportForScreenshot({ actor: testUserActor, report });
        await testUserActor.browse().check(ReportPageTargets.reportContents).hasScreenshot();
      });
    }
  );

  test(
    'Configure a spline chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ sourceApp, sysAdminActor, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-613',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
        records = await addRecordsToApp(sysAdminActor, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new SplineChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
        }),
        security: 'Public',
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
      });

      await test.step('Create the report', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));

        report.id = await sysAdminActor.asks(ReportQuestions.currentId());
        expect(report.id).not.toBe(0);
      });

      await test.step('Verify the spline chart displays as expected', async () => {
        await prepareReportForScreenshot({ actor: testUserActor, report });
        await testUserActor.browse().check(ReportPageTargets.reportContents).hasScreenshot();
      });
    }
  );

  test(
    'Configure a funnel chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ sourceApp, sysAdminActor, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-614',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
        records = await addRecordsToApp(sysAdminActor, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new FunnelChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
        }),
        security: 'Public',
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
      });

      await test.step('Create the report', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));

        report.id = await sysAdminActor.asks(ReportQuestions.currentId());
        expect(report.id).not.toBe(0);
      });

      await test.step('Verify the funnel chart displays as expected', async () => {
        await prepareReportForScreenshot({ actor: testUserActor, report });
        await testUserActor.browse().check(ReportPageTargets.reportContents).hasScreenshot();
      });
    }
  );

  test(
    'Configure a pyramid chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ sourceApp, sysAdminActor, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-615',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
        records = await addRecordsToApp(sysAdminActor, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new PyramidChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
        }),
        security: 'Public',
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
      });

      await test.step('Create the report', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));

        report.id = await sysAdminActor.asks(ReportQuestions.currentId());
        expect(report.id).not.toBe(0);
      });

      await test.step('Verify the pyramid chart displays as expected', async () => {
        await prepareReportForScreenshot({ actor: testUserActor, report });
        await testUserActor.browse().check(ReportPageTargets.reportContents).hasScreenshot();
      });
    }
  );

  test(
    'Configure a stacked bar chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ sourceApp, sysAdminActor, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-616',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
        records = await addRecordsToApp(sysAdminActor, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new StackedBarChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
          seriesData: fields.seriesField.name,
        }),
        security: 'Public',
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
      });

      await test.step('Create the report', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));

        report.id = await sysAdminActor.asks(ReportQuestions.currentId());
        expect(report.id).not.toBe(0);
      });

      await test.step('Verify the stacked bar chart displays as expected', async () => {
        await prepareReportForScreenshot({ actor: testUserActor, report });
        await testUserActor.browse().check(ReportPageTargets.reportContents).hasScreenshot();
      });
    }
  );

  test(
    'Configure a column plus line chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ sourceApp, sysAdminActor, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-617',
      });

      // The name of the source app needs to be unique to avoid conflicts...but
      // it also needs to be consistent across test runs so that snapshots can be compared.
      const projectName = test.info().project.name;
      const mockAppName = `configure_a_column_plus_line_chart_${projectName}`;

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
        records = await addRecordsToApp(sysAdminActor, sourceApp, records);
      });

      const lineReport = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new LineChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
        }),
        security: 'Public',
      });

      const columnReport = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new ColumnPlusLineChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
          seriesData: fields.seriesField.name,
          lineChart: lineReport,
        }),
        security: 'Public',
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
      });

      await test.step('Create the line report', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(lineReport));
      });

      await test.step('Navigate back to the app reports home page', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
      });

      await test.step('Create the column report', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(columnReport));

        columnReport.id = await sysAdminActor.asks(ReportQuestions.currentId());
        expect(columnReport.id).not.toBe(0);
      });

      await test.step('Verify the column plus line chart displays as expected', async () => {
        await prepareReportForScreenshot({
          actor: testUserActor,
          report: columnReport,
          beforeNavigation: ReportTasks.mockLineChartSeriesName(sourceApp.name, mockAppName),
        });
        await testUserActor.browse().check(ReportPageTargets.reportContents).hasScreenshot();
      });
    }
  );

  test(
    'Configure a stacked column chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ sourceApp, sysAdminActor, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-618',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
        records = await addRecordsToApp(sysAdminActor, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new StackedColumnChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
          seriesData: fields.seriesField.name,
        }),
        security: 'Public',
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
      });

      await test.step('Create the report', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));

        report.id = await sysAdminActor.asks(ReportQuestions.currentId());
        expect(report.id).not.toBe(0);
      });

      await test.step('Verify the stacked column chart displays as expected', async () => {
        await prepareReportForScreenshot({ actor: testUserActor, report });
        await testUserActor.browse().check(ReportPageTargets.reportContents).hasScreenshot();
      });
    }
  );

  test(
    'Configure a stacked column plus line chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ sourceApp, sysAdminActor, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-619',
      });

      // The name of the source app needs to be unique to avoid conflicts...but
      // it also needs to be consistent across test runs so that snapshots can be compared.
      const projectName = test.info().project.name;
      const mockAppName = `configure_a_column_plus_line_chart_${projectName}`;

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
        records = await addRecordsToApp(sysAdminActor, sourceApp, records);
      });

      const lineReport = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new LineChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
        }),
        security: 'Public',
      });

      const stackedColumnReport = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new StackedColumnPlusLineChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
          seriesData: fields.seriesField.name,
          lineChart: lineReport,
        }),
        security: 'Public',
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
      });

      await test.step('Create the line report', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(lineReport));
      });

      await test.step("Navigate back to the app's reports home page", async () => {
        await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
      });

      await test.step('Create the stacked column plus line report', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(stackedColumnReport));

        stackedColumnReport.id = await sysAdminActor.asks(ReportQuestions.currentId());
        expect(stackedColumnReport.id).not.toBe(0);
      });

      await test.step('Verify the stacked column plus line chart displays as expected', async () => {
        await prepareReportForScreenshot({
          actor: testUserActor,
          report: stackedColumnReport,
          beforeNavigation: ReportTasks.mockLineChartSeriesName(sourceApp.name, mockAppName),
        });
        await testUserActor.browse().check(ReportPageTargets.reportContents).hasScreenshot();
      });
    }
  );

  test(
    'Configure a bubble chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ sourceApp, sysAdminActor, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-620',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField, undefined, fields.additionalGroupField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
        records = await addRecordsToApp(sysAdminActor, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new BubbleChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
          seriesData: fields.seriesField.name,
          additionalGroupData: fields.additionalGroupField.name,
        }),
        security: 'Public',
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
      });

      await test.step('Create the report', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));

        report.id = await sysAdminActor.asks(ReportQuestions.currentId());
        expect(report.id).not.toBe(0);
      });

      await test.step('Verify the bubble chart displays as expected', async () => {
        await prepareReportForScreenshot({ actor: testUserActor, report });
        await testUserActor.browse().check(ReportPageTargets.reportContents).hasScreenshot();
      });
    }
  );

  test(
    'Configure a heat map chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ sourceApp, sysAdminActor, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-621',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
        records = await addRecordsToApp(sysAdminActor, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new HeatMapChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
          seriesData: fields.seriesField.name,
          colorStops: [
            { value: 3, color: '#0000FF' },
            { value: 6, color: '#800080' },
          ],
        }),
        security: 'Public',
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
      });

      await test.step('Create the report', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));

        report.id = await sysAdminActor.asks(ReportQuestions.currentId());
        expect(report.id).not.toBe(0);
      });

      await test.step('Verify the heat map chart displays as expected', async () => {
        await prepareReportForScreenshot({ actor: testUserActor, report });
        await testUserActor.browse().check(ReportPageTargets.reportContents).hasScreenshot();
      });
    }
  );

  test(
    'Configure a calendar',
    {
      tag: [Tags.Snapshot],
    },
    async ({ sourceApp, sysAdminActor, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-622',
      });

      const millisecondsInHour = 60 * 60 * 1000;
      const testDate = new Date('2024-09-12T05:00:00Z');

      const startDate = new DateField({
        name: 'Start Date',
        display: 'Date and Time',
      });

      const endDate = new DateField({
        name: 'End Date',
        display: 'Date and Time',
      });

      let records: Record[] = [
        {
          id: 0,
          fieldValues: [
            {
              field: startDate.name,
              value: new Date(testDate.getTime() + 8 * millisecondsInHour).toISOString(),
              tabName: 'Tab 2',
              sectionName: 'Section 1',
              type: startDate.type as FieldType,
            },
            {
              field: endDate.name,
              value: new Date(testDate.getTime() + 9 * millisecondsInHour).toISOString(),
              tabName: 'Tab 2',
              sectionName: 'Section 1',
              type: endDate.type as FieldType,
            },
          ],
        },
        {
          id: 0,
          fieldValues: [
            {
              field: startDate.name,
              value: new Date(testDate.getTime() + 16 * millisecondsInHour).toISOString(),
              tabName: 'Tab 2',
              sectionName: 'Section 1',
              type: startDate.type as FieldType,
            },
            {
              field: endDate.name,
              value: new Date(testDate.getTime() + 17 * millisecondsInHour).toISOString(),
              tabName: 'Tab 2',
              sectionName: 'Section 1',
              type: endDate.type as FieldType,
            },
          ],
        },
      ];

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(sysAdminActor, sourceApp, [startDate, endDate]);
        records = await addRecordsToApp(sysAdminActor, sourceApp, records);
      });

      await test.step('Navigate to the app reports home page', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
      });

      const report = new SavedReportAsCalendar({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        calendarValues: [
          {
            startDateField: startDate.name,
            endDateField: endDate.name,
            color: '#FF0000',
          },
        ],
        defaultView: 'Day',
        security: 'Public',
      });

      await test.step('Create the report', async () => {
        await sysAdminActor.attemptsTo(
          ReportTasks.createFromAppReports(report),
          ReportTasks.selectCalendarDate(testDate),
          ReportTasks.waitUntilLoaded()
        );

        report.id = await sysAdminActor.asks(ReportQuestions.currentId());
        expect(report.id).not.toBe(0);
      });

      await test.step('Verify the calendar displays as expected', async () => {
        await prepareReportForScreenshot({
          actor: testUserActor,
          report,
          afterNavigation: ReportTasks.selectCalendarDate(testDate),
        });
        await testUserActor.browse().check(ReportPageTargets.reportContents).hasScreenshot();
      });
    }
  );

  test(
    'Configure a gantt chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ sourceApp, sysAdminActor, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-623',
      });

      const startDate = new DateField({
        name: FakeDataFactory.createFakeFieldName(),
      });

      const endDate = new DateField({
        name: FakeDataFactory.createFakeFieldName(),
      });

      let records: Record[] = [
        {
          id: 0,
          fieldValues: [
            {
              field: startDate.name,
              value: '2024-09-16T00:00:00Z',
              tabName: 'Tab 2',
              sectionName: 'Section 1',
              type: startDate.type as FieldType,
            },
            {
              field: endDate.name,
              value: '2024-09-18T00:00:00Z',
              tabName: 'Tab 2',
              sectionName: 'Section 1',
              type: endDate.type as FieldType,
            },
          ],
        },
        {
          id: 0,
          fieldValues: [
            {
              field: startDate.name,
              value: '2024-09-18T00:00:00Z',
              tabName: 'Tab 2',
              sectionName: 'Section 1',
              type: startDate.type as FieldType,
            },
            {
              field: endDate.name,
              value: '2024-09-20T00:00:00Z',
              tabName: 'Tab 2',
              sectionName: 'Section 1',
              type: endDate.type as FieldType,
            },
          ],
        },
      ];

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(sysAdminActor, sourceApp, [startDate, endDate]);
        records = await addRecordsToApp(sysAdminActor, sourceApp, records);
      });

      await test.step('Navigate to the app reports home page', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
      });

      const report = new SavedReportAsGanttChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        timeIncrements: ['Days'],
        ganttValues: [
          {
            startDateField: startDate.name,
            endDateField: endDate.name,
            color: '#FF0000',
          },
        ],
        security: 'Public',
      });

      await test.step('Create the report', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));

        report.id = await sysAdminActor.asks(ReportQuestions.currentId());
        expect(report.id).not.toBe(0);
      });

      await test.step('Verify the gantt chart displays as expected', async () => {
        await prepareReportForScreenshot({ actor: testUserActor, report });
        await testUserActor.browse().check(ReportPageTargets.reportContents).hasScreenshot();
      });
    }
  );

  test(
    'Configure a point map',
    {
      tag: [Tags.Snapshot],
    },
    async ({ sourceApp, sysAdminActor, testUserActor }) => {
      test.info().annotations.push({
        type: AnnotationType.TestId,
        description: 'Test-624',
      });

      const addressField = new TextField({ name: FakeDataFactory.createFakeFieldName() });
      const cityField = new TextField({ name: FakeDataFactory.createFakeFieldName() });
      const stateField = new TextField({ name: FakeDataFactory.createFakeFieldName() });
      const zipField = new TextField({ name: FakeDataFactory.createFakeFieldName() });
      const geocodePrecisionFieldName = 'Geocode Precision';
      const latitudeFieldName = 'Latitude';
      const longitudeFieldName = 'Longitude';

      await test.step('Navigate to the source app admin page', async () => {
        await sysAdminActor.attemptsTo(AppTasks.gotoApp(sourceApp.id));
      });

      await test.step('Enable geocoding for the source app', async () => {
        await sysAdminActor.attemptsTo(
          AppTasks.enableGeocoding({
            address: addressField.name,
            city: cityField.name,
            state: stateField.name,
            zip: zipField.name,
          })
        );
      });

      await test.step('Wait for geocode fields to be created', async () => {
        await sysAdminActor.browse().click(AppDetailTargets.layoutTabButton);

        await sysAdminActor.attemptsTo(
          Retry.until(
            async actor => {
              await actor.browse().reload();
              await actor
                .browse()
                .check(AppLayoutTabTargets.fieldOrObjectRowByName(geocodePrecisionFieldName))
                .isVisible({ timeout: 1_000 });
              await actor
                .browse()
                .check(AppLayoutTabTargets.fieldOrObjectRowByName(latitudeFieldName))
                .isVisible({ timeout: 1_000 });
              await actor
                .browse()
                .check(AppLayoutTabTargets.fieldOrObjectRowByName(longitudeFieldName))
                .isVisible({ timeout: 1_000 });
            },
            { intervals: [5_000], timeout: 120_000 }
          )
        );
      });

      await test.step('Place geocode fields on layout', async () => {
        await sysAdminActor.attemptsTo(AppTasks.openLayoutDesigner());

        const fields = [
          addressField.name,
          cityField.name,
          stateField.name,
          zipField.name,
          geocodePrecisionFieldName,
          latitudeFieldName,
          longitudeFieldName,
        ];

        for (const field of fields) {
          await sysAdminActor.attemptsTo(
            AppTasks.dragFieldOntoLayout({
              tabName: 'Tab 2',
              sectionName: 'Section 1',
              column: 0,
              row: 0,
              fieldName: field,
            })
          );
        }

        await sysAdminActor.attemptsTo(AppTasks.saveAndCloseLayout());
      });

      let records: Record[] = [
        {
          id: 0,
          fieldValues: [
            {
              field: addressField.name,
              value: '10801 Mastin St #400',
              tabName: 'Tab 2',
              sectionName: 'Section 1',
              type: addressField.type as FieldType,
            },
            {
              field: cityField.name,
              value: 'Overland Park',
              tabName: 'Tab 2',
              sectionName: 'Section 1',
              type: cityField.type as FieldType,
            },
            {
              field: stateField.name,
              value: 'Kansas',
              tabName: 'Tab 2',
              sectionName: 'Section 1',
              type: stateField.type as FieldType,
            },
            {
              field: zipField.name,
              value: '66210',
              tabName: 'Tab 2',
              sectionName: 'Section 1',
              type: zipField.type as FieldType,
            },
          ],
        },
      ];

      await test.step('Add record to the source app', async () => {
        records = await addRecordsToApp(sysAdminActor, sourceApp, records);
      });

      await test.step('Wait for record to be geocoded', async () => {
        await sysAdminActor.attemptsTo(ContentTasks.gotoView(sourceApp.id, records[0].id));

        await sysAdminActor.attemptsTo(
          Retry.until(
            async actor => {
              await actor.browse().reload();
              await actor.attemptsTo(
                ContentTasks.checkReadOnlyFieldText({
                  tabName: 'Tab 2',
                  sectionName: 'Section 1',
                  fieldName: geocodePrecisionFieldName,
                  expectedText: 'High',
                  timeout: 1_000,
                })
              );
            },
            { intervals: [5_000], timeout: 120_000 }
          )
        );
      });

      await test.step('Navigate to the source app reports home page', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
      });

      const report = new SavedReportAsPointMap({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        visibility: 'Display Map Only',
        markerNameField: 'Record Id',
        selectedColor: '#FF0000',
        security: 'Public',
      });

      await test.step('Create the report', async () => {
        await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));

        report.id = await sysAdminActor.asks(ReportQuestions.currentId());
        expect(report.id).not.toBe(0);
      });

      await test.step('Verify the point map displays as expected', async () => {
        await prepareReportForScreenshot({ actor: testUserActor, report });
        await testUserActor.browse().check(ReportPageTargets.reportContents).hasScreenshot({ maxDiffPixels: 400 });
      });
    }
  );

  test('Add a Report Alias to a display field and verify it displays correctly when viewing the report', async ({
    sourceApp,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-870',
    });

    const aliasValue = 'Alias';

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
      displayFields: [new DisplayField({ name: 'Record Id', alias: aliasValue })],
    });

    await test.step('Navigate to the report home page', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.gotoReportHome());
    });

    await test.step('Create the report', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.createFromReportHome(report));
    });

    await test.step('Verify the report was created', async () => {
      await sysAdminActor
        .browse()
        .check(ReportPageTargets.breadcrumb)
        .hasText(new RegExp(`Reports[\\s\\S]*${report.appName}[\\s\\S]*${report.name}`, 'i'));

      await sysAdminActor
        .browse()
        .check(ReportPageTargets.columnHeader(new RegExp(aliasValue, 'i')))
        .isVisible();
    });
  });

  test('Update a report alias on a display field and verify it updates correctly when viewing the report', async ({
    sourceApp,
    sysAdminActor,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-871',
    });

    const aliasValue = 'Alias';
    const updatedAliasValue = 'Updated Alias';

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
      displayFields: [new DisplayField({ name: 'Record Id', alias: aliasValue })],
    });

    await test.step('Navigate to the report home page', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.gotoReportHome());
    });

    await test.step('Create the report', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.createFromReportHome(report));
    });

    await test.step('Verify the report was created', async () => {
      await sysAdminActor
        .browse()
        .check(ReportPageTargets.breadcrumb)
        .hasText(new RegExp(`Reports[\\s\\S]*${report.appName}[\\s\\S]*${report.name}`, 'i'));

      await sysAdminActor
        .browse()
        .check(ReportPageTargets.columnHeader(new RegExp(aliasValue, 'i')))
        .isVisible();
    });

    await test.step('Update the report alias', async () => {
      const updatedReport = new SavedReportAsReportDataOnly({
        appName: sourceApp.name,
        name: report.name,
        displayFields: [new DisplayField({ name: 'Record Id', alias: updatedAliasValue })],
      });

      await sysAdminActor.attemptsTo(ReportTasks.update(updatedReport));
    });

    await test.step('Verify the report alias was updated', async () => {
      await sysAdminActor
        .browse()
        .check(ReportPageTargets.columnHeader(new RegExp(updatedAliasValue, 'i')))
        .isVisible();
    });
  });

  test('Configure a radar chart', async ({ sourceApp, sysAdminActor, testUserActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-906',
    });

    const fields = getFieldsForApp();
    let records = buildRecords(fields.groupField, fields.seriesField);

    await test.step('Setup source app with fields and records', async () => {
      await addFieldsToApp(sysAdminActor, sourceApp, Object.values(fields));
      records = await addRecordsToApp(sysAdminActor, sourceApp, records);
    });

    const report = new SavedReportAsChart({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
      chart: new RadarChart({
        visibility: 'Display Chart Only',
        groupData: fields.groupField.name,
        seriesData: fields.seriesField.name,
      }),
      security: 'Public',
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await sysAdminActor.attemptsTo(ReportTasks.gotoAppReports(sourceApp.id));
    });

    await test.step('Create the report', async () => {
      await sysAdminActor.attemptsTo(ReportTasks.createFromAppReports(report));

      report.id = await sysAdminActor.asks(ReportQuestions.currentId());
      expect(report.id).not.toBe(0);
    });

    await test.step('Verify the heat map chart displays as expected', async () => {
      await prepareReportForScreenshot({ actor: testUserActor, report });
      await testUserActor.browse().check(ReportPageTargets.reportContents).hasScreenshot({ maxDiffPixels: 400 });
    });
  });
});

function getFieldsForApp() {
  const groupField = new ListField({
    name: 'Group',
    values: [
      new ListValue({ value: 'Group A', color: '#FF0000' }),
      new ListValue({ value: 'Group B', color: '#0000FF' }),
      new ListValue({ value: 'Group C', color: '#FFFF00' }),
    ],
  });

  const seriesField = new ListField({
    name: 'Series',
    values: [
      new ListValue({ value: 'Series 1', color: '#00FF00' }),
      new ListValue({ value: 'Series 2', color: '#FFA500' }),
      new ListValue({ value: 'Series 3', color: '#800080' }),
    ],
  });

  const additionalGroupField = new ListField({
    name: 'Additional',
    values: [
      new ListValue({ value: 'Group X', color: '#FF0000' }),
      new ListValue({ value: 'Group Y', color: '#0000FF' }),
      new ListValue({ value: 'Group Z', color: '#FFFF00' }),
    ],
  });

  return { groupField, seriesField, additionalGroupField };
}

async function addFieldsToApp(actor: WebActor, app: App, fields: LayoutItem[]) {
  await actor.attemptsTo(AppTasks.gotoApp(app.id), AppTasks.openLayoutDesigner());

  for (const [index, field] of fields.entries()) {
    await actor.attemptsTo(
      AppTasks.addLayoutItemInLayoutDesigner(field),
      AppTasks.dragFieldOntoLayout({
        fieldName: field.name,
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        column: 0,
        row: index,
      })
    );
  }

  await actor.attemptsTo(AppTasks.saveAndCloseLayout());
}

type Record = {
  id: number;
  fieldValues: { field: string; value: string; tabName: string; sectionName: string; type: FieldType }[];
};

function buildRecords(
  groupField: ListField,
  seriesField: ListField,
  relationship?: { referenceField: ReferenceField; relatedRecordId: string },
  additionalField?: ListField
) {
  const records = [];

  for (const group of groupField.values) {
    for (const series of seriesField.values) {
      const fieldValues = [
        {
          field: groupField.name,
          value: group.value,
          tabName: 'Tab 2',
          sectionName: 'Section 1',
          type: groupField.type as FieldType,
        },
        {
          field: seriesField.name,
          value: series.value,
          tabName: 'Tab 2',
          sectionName: 'Section 1',
          type: seriesField.type as FieldType,
        },
      ];

      if (relationship) {
        fieldValues.push({
          field: relationship.referenceField.name,
          value: relationship.relatedRecordId,
          tabName: 'Tab 2',
          sectionName: 'Section 1',
          type: relationship.referenceField.type as FieldType,
        });
      }

      records.push({
        id: 0,
        fieldValues,
      });
    }
  }

  if (additionalField) {
    for (const [index, record] of records.entries()) {
      const value = additionalField.values[index % additionalField.values.length].value;

      record.fieldValues.push({
        field: additionalField.name,
        value,
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        type: additionalField.type as FieldType,
      });
    }
  }

  return records;
}

async function addRecordsToApp(actor: WebActor, app: App, records: Record[]) {
  const createdRecords = [];

  for (const record of records) {
    await actor.attemptsTo(ContentTasks.gotoAdd(app.id));

    for (const fieldValue of record.fieldValues) {
      switch (fieldValue.type) {
        case 'List': {
          await actor.attemptsTo(
            ContentTasks.selectListField({
              tabName: fieldValue.tabName,
              sectionName: fieldValue.sectionName,
              fieldName: fieldValue.field,
              value: fieldValue.value,
            })
          );
          break;
        }
        case 'Reference': {
          await actor.attemptsTo(
            ContentTasks.selectReferenceField({
              tabName: fieldValue.tabName,
              sectionName: fieldValue.sectionName,
              fieldName: fieldValue.field,
              searchTerm: fieldValue.value,
            })
          );
          break;
        }
        case 'Date/Time': {
          await actor.attemptsTo(
            ContentTasks.enterDateField({
              tabName: fieldValue.tabName,
              sectionName: fieldValue.sectionName,
              fieldName: fieldValue.field,
              date: new Date(fieldValue.value),
            })
          );
          break;
        }
        case 'Text': {
          await actor.attemptsTo(
            ContentTasks.fillTextField({
              tabName: fieldValue.tabName,
              sectionName: fieldValue.sectionName,
              fieldName: fieldValue.field,
              value: fieldValue.value,
            })
          );
          break;
        }
        default:
          throw new Error(`Field type ${fieldValue.type} is not supported.`);
      }
    }

    await actor.attemptsTo(ContentTasks.saveRecord());

    const createdRecord = { ...record };
    createdRecord.id = await actor.asks(ContentQuestions.currentRecordId());
    createdRecords.push(createdRecord);
  }

  return createdRecords;
}

async function prepareReportForScreenshot({
  actor,
  report,
  beforeNavigation,
  afterNavigation,
}: {
  actor: WebActor;
  report: Report;
  beforeNavigation?: Task<WebActor>;
  afterNavigation?: Task<WebActor>;
}) {
  if (beforeNavigation) {
    await actor.attemptsTo(beforeNavigation);
  }

  await actor.attemptsTo(ReportTasks.gotoReport(report.id));

  if (afterNavigation) {
    await actor.attemptsTo(afterNavigation);
  }

  await actor.browse().moveMouse(0, 0);
}
