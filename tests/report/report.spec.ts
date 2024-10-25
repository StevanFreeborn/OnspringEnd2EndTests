import { FieldType } from '../../componentObjectModels/menus/addFieldTypeMenu';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app, createApp } from '../../fixtures/app.fixtures';
import { App } from '../../models/app';
import {
  BarChart,
  BubbleChart,
  ColumnChart,
  ColumnPlusLineChart,
  DonutChart,
  FunnelChart,
  HeatMapChart,
  LineChart,
  PieChart,
  PyramidChart,
  SplineChart,
  StackedBarChart,
  StackedColumnChart,
  StackedColumnPlusLineChart,
} from '../../models/chart';
import { DateField } from '../../models/dateField';
import { LayoutItem } from '../../models/layoutItem';
import { ListField } from '../../models/listField';
import { ListValue } from '../../models/listValue';
import { ReferenceField } from '../../models/referenceField';
import {
  DisplayField,
  ReportSchedule,
  SavedReportAsCalendar,
  SavedReportAsChart,
  SavedReportAsGanttChart,
  SavedReportAsPointMap,
  SavedReportAsReportDataOnly,
} from '../../models/report';
import { TextField } from '../../models/textField';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AppsAdminPage } from '../../pageObjectModels/apps/appsAdminPage';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { EditContentPage } from '../../pageObjectModels/content/editContentPage';
import { ViewContentPage } from '../../pageObjectModels/content/viewContentPage';
import { ReportAppPage } from '../../pageObjectModels/reports/reportAppPage';
import { ReportHomePage } from '../../pageObjectModels/reports/reportHomePage';
import { ReportPage } from '../../pageObjectModels/reports/reportPage';
import { AnnotationType } from '../annotations';
import { Tags } from '../tags';

type ReportTestFixtures = {
  referencedApp: App;
  sourceApp: App;
  reportHomePage: ReportHomePage;
  reportAppPage: ReportAppPage;
  reportPage: ReportPage;
  appAdminPage: AppAdminPage;
  addContentPage: AddContentPage;
  editContentPage: EditContentPage;
  viewContentPage: ViewContentPage;
};

const test = base.extend<ReportTestFixtures>({
  referencedApp: app,
  sourceApp: app,
  reportHomePage: async ({ sysAdminPage }, use) => await use(new ReportHomePage(sysAdminPage)),
  reportAppPage: async ({ sysAdminPage }, use) => await use(new ReportAppPage(sysAdminPage)),
  reportPage: async ({ sysAdminPage }, use) => await use(new ReportPage(sysAdminPage)),
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
  addContentPage: async ({ sysAdminPage }, use) => await use(new AddContentPage(sysAdminPage)),
  editContentPage: async ({ sysAdminPage }, use) => await use(new EditContentPage(sysAdminPage)),
  viewContentPage: async ({ sysAdminPage }, use) => await use(new ViewContentPage(sysAdminPage)),
});

test.describe('report', () => {
  let appsToDelete: string[] = [];

  test.afterEach(async ({ sysAdminPage }) => {
    if (appsToDelete.length === 0) {
      return;
    }

    await new AppsAdminPage(sysAdminPage).deleteApps(appsToDelete);
    appsToDelete = [];
  });

  test('Create a report via the "Create Report" button on the report home page', async ({
    sourceApp,
    reportHomePage,
    reportPage,
  }) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-594',
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
    });

    await test.step('Navigate to the report home page', async () => {
      await reportHomePage.goto();
    });

    await test.step('Create the report', async () => {
      await reportHomePage.createReport(report);
      await reportHomePage.page.waitForURL(reportPage.pathRegex);
    });

    await test.step('Verify the report was created', async () => {
      await expect(reportPage.breadcrumb).toHaveText(
        new RegExp(`Reports[\\s\\S]*${report.appName}[\\s\\S]*${report.name}`, 'i')
      );

      const recordIdColumn = reportPage.dataGridContainer.locator('th', { hasText: /record id/i });
      await expect(recordIdColumn).toBeVisible();
    });
  });

  test('Create a report via the "Create Report" button on an app\'s or survey\'s reports home page.', async ({
    sourceApp,
    reportAppPage,
    reportPage,
  }) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-595',
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
    });

    await test.step("Navigate to the app's or survey's reports home page", async () => {
      await reportAppPage.goto(sourceApp.id);
    });

    await test.step('Create the report', async () => {
      await reportAppPage.createReport(report);
      await reportAppPage.page.waitForURL(reportPage.pathRegex);
    });

    await test.step('Verify the report was created', async () => {
      await expect(reportPage.breadcrumb).toHaveText(
        new RegExp(`Reports[\\s\\S]*${report.appName}[\\s\\S]*${report.name}`, 'i')
      );

      const recordIdColumn = reportPage.dataGridContainer.locator('th', { hasText: /record id/i });
      await expect(recordIdColumn).toBeVisible();
    });
  });

  test('Create a copy of a report', async ({ sourceApp, reportHomePage, reportPage }) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-596',
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
      await reportHomePage.goto();
    });

    await test.step('Create the report to copy', async () => {
      await reportHomePage.createReport(reportToCopy);
      await reportHomePage.page.waitForURL(reportPage.pathRegex);
    });

    await test.step('Navigate back to the report home page', async () => {
      await reportHomePage.goto();
    });

    await test.step('Create a copy of the report', async () => {
      await reportHomePage.createCopyOfReport(reportToCopy.name, copy);
      await reportHomePage.page.waitForURL(reportPage.pathRegex);
    });

    await test.step('Verify the report was created', async () => {
      await expect(reportPage.breadcrumb).toHaveText(
        new RegExp(`Reports[\\s\\S]*${copy.appName}[\\s\\S]*${copy.name}`, 'i')
      );

      const recordIdColumn = reportPage.dataGridContainer.locator('th', { hasText: /record id/i });
      await expect(recordIdColumn).toBeVisible();
    });
  });

  test('Update a report', async ({ sourceApp, reportAppPage, reportPage }) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-597',
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await reportAppPage.goto(sourceApp.id);
    });

    await test.step('Create the report to update', async () => {
      await reportAppPage.createReport(report);
      await reportAppPage.page.waitForURL(reportPage.pathRegex);
    });

    await test.step('Update the report', async () => {
      report.name = FakeDataFactory.createFakeReportName();
      await reportPage.updateReport(report);
      await reportPage.page.waitForURL(reportPage.pathRegex);
    });

    await test.step('Verify the report was updated', async () => {
      await expect(reportPage.breadcrumb).toHaveText(
        new RegExp(`Reports[\\s\\S]*${report.appName}[\\s\\S]*${report.name}`, 'i')
      );

      const recordIdColumn = reportPage.dataGridContainer.locator('th', { hasText: /record id/i });
      await expect(recordIdColumn).toBeVisible();
    });
  });

  test('Delete a report', async ({ sourceApp, reportAppPage, reportPage }) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-598',
    });

    const report = new SavedReportAsReportDataOnly({
      appName: 'Test App',
      name: 'Test Report',
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await reportAppPage.goto(sourceApp.id);
    });

    await test.step('Create the report to delete', async () => {
      await reportAppPage.createReport(report);
      await reportAppPage.page.waitForURL(reportPage.pathRegex);
    });

    await test.step('Delete the report', async () => {
      await reportPage.deleteReport();
      await reportPage.page.waitForURL(reportAppPage.pathRegex);
      await reportAppPage.page.waitForLoadState('networkidle');
    });

    await test.step('Verify the report was deleted', async () => {
      const reportRow = reportAppPage.allReportsGrid.getByRole('row', { name: report.name });

      await expect(reportRow).toBeHidden();
    });
  });

  test('Bulk edit records in a report', async ({
    sourceApp,
    appAdminPage,
    addContentPage,
    editContentPage,
    reportAppPage,
    reportPage,
  }) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-599',
    });

    const fields = getFieldsForApp();
    let records = buildRecords(fields.groupField, fields.seriesField);

    await test.step('Setup source app with fields and records', async () => {
      await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
      records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
      displayFields: Object.values(fields).map(field => new DisplayField({ name: field.name })),
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await reportAppPage.goto(sourceApp.id);
    });

    await test.step('Create the report', async () => {
      await reportAppPage.createReport(report);
      await reportAppPage.page.waitForURL(reportPage.pathRegex);
    });

    await test.step('Bulk edit records in the report', async () => {
      await reportPage.selectAllRecords();
      await reportPage.bulkEditSelectedRecords();
      await reportPage.bulkEditModal.updateFields([
        {
          field: fields.groupField,
          value: fields.groupField.values[0].value,
        },
      ]);
      await reportPage.bulkEditModal.saveChanges();
      await reportPage.page.waitForURL(reportPage.pathRegex);
      await reportPage.page.waitForLoadState('networkidle');
    });

    await test.step('Verify the records were updated', async () => {
      const groupFieldCells = await reportPage.getAllFieldCells(fields.groupField.name);

      for (const cell of groupFieldCells) {
        await expect(cell).toHaveText(fields.groupField.values[0].value);
      }
    });
  });

  test('Bulk delete records in a report', async ({
    sourceApp,
    appAdminPage,
    addContentPage,
    editContentPage,
    reportAppPage,
    reportPage,
  }) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-600',
    });

    const fields = getFieldsForApp();
    let records = buildRecords(fields.groupField, fields.seriesField);

    await test.step('Setup source app with fields and records', async () => {
      await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
      records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await reportAppPage.goto(sourceApp.id);
    });

    await test.step('Create the report', async () => {
      await reportAppPage.createReport(report);
      await reportAppPage.page.waitForURL(reportPage.pathRegex);
    });

    await test.step('Bulk delete records in the report', async () => {
      await reportPage.selectAllRecords();
      await reportPage.bulkDeleteSelectedRecords();
      await reportPage.bulkDeleteDialog.confirmDelete();
      await reportPage.page.waitForURL(reportPage.pathRegex);
    });

    await test.step('Verify the records were deleted', async () => {
      const rows = reportPage.dataGridContainer.locator('tbody').locator('tr');
      await expect(rows).toHaveCount(0);
    });
  });

  test('Apply liver filters to a report', async ({
    sourceApp,
    appAdminPage,
    addContentPage,
    editContentPage,
    reportAppPage,
    reportPage,
  }) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-601',
    });

    const fields = getFieldsForApp();
    let records = buildRecords(fields.groupField, fields.seriesField);

    await test.step('Setup source app with fields and records', async () => {
      await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
      records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
      displayFields: Object.values(fields).map(field => new DisplayField({ name: field.name })),
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await reportAppPage.goto(sourceApp.id);
    });

    await test.step('Create the report', async () => {
      await reportAppPage.createReport(report);
      await reportAppPage.page.waitForURL(reportPage.pathRegex);
      await reportPage.page.waitForLoadState('networkidle');
    });

    await test.step('Apply live filter to the report', async () => {
      await reportPage.applyLiveFilter({
        fieldName: fields.groupField.name,
        fieldType: fields.groupField.type as FieldType,
        operator: 'Contains Any',
        value: fields.groupField.values[0].value,
      });
    });

    await test.step('Verify the report has been filtered', async () => {
      const rows = reportPage.dataGridContainer.locator('tbody').locator('tr');
      await expect(rows).toHaveCount(3);
    });
  });

  test('Sort a report', async ({
    sourceApp,
    appAdminPage,
    addContentPage,
    editContentPage,
    reportAppPage,
    reportPage,
  }) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-602',
    });

    const fields = getFieldsForApp();
    let records = buildRecords(fields.groupField, fields.seriesField);

    await test.step('Setup source app with fields and records', async () => {
      await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
      records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await reportAppPage.goto(sourceApp.id);
    });

    await test.step('Create the report', async () => {
      await reportAppPage.createReport(report);
      await reportAppPage.page.waitForURL(reportPage.pathRegex);
      await reportPage.page.waitForLoadState('networkidle');
    });

    await test.step('Sort the report', async () => {
      await reportPage.sortByField({ fieldName: 'Record Id', sortOrder: 'desc' });
    });

    await test.step('Verify the report has been sorted', async () => {
      const expectedRecordIds = records.map(record => record.id).sort((a, b) => b - a);
      const recordIdCells = await reportPage.getAllFieldCells('Record Id');
      const recordIds = await Promise.all(recordIdCells.map(cell => cell.textContent()));
      const actualRecordIds = recordIds.filter(id => id !== null).map(id => parseInt(id!));

      expect(actualRecordIds).toEqual(expectedRecordIds);
    });
  });

  test('Filter a report', async ({
    sourceApp,
    appAdminPage,
    addContentPage,
    editContentPage,
    reportAppPage,
    reportPage,
  }) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-603',
    });

    const fields = getFieldsForApp();
    let records = buildRecords(fields.groupField, fields.seriesField);

    await test.step('Setup source app with fields and records', async () => {
      await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
      records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await reportAppPage.goto(sourceApp.id);
    });

    await test.step('Create the report', async () => {
      await reportAppPage.createReport(report);
      await reportAppPage.page.waitForURL(reportPage.pathRegex);
      await reportPage.page.waitForLoadState('networkidle');
    });

    await test.step('Filter the report', async () => {
      await reportPage.filterByText('1');
    });

    await test.step('Verify the report has been filtered', async () => {
      const rows = reportPage.dataGridContainer.locator('tbody').locator('tr');

      await expect(rows).toHaveCount(1);
      await expect(rows).toHaveText(new RegExp('1', 'i'));
    });
  });

  test('Export a report', async ({
    sourceApp,
    appAdminPage,
    addContentPage,
    editContentPage,
    reportAppPage,
    reportPage,
    sysAdminUser,
    sysAdminEmail,
    sysAdminPage,
    downloadService,
    sheetParser,
  }) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-604',
    });

    const fields = getFieldsForApp();
    let records = buildRecords(fields.groupField, fields.seriesField);

    await test.step('Setup source app with fields and records', async () => {
      await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
      records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await reportAppPage.goto(sourceApp.id);
    });

    await test.step('Create the report', async () => {
      await reportAppPage.createReport(report);
      await reportAppPage.page.waitForURL(reportPage.pathRegex);
      await reportPage.page.waitForLoadState('networkidle');
    });

    await test.step('Export the report', async () => {
      await reportPage.exportReport();
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
      await sysAdminPage.setContent(exportEmailContent);

      const reportDownload = sysAdminPage.waitForEvent('download');
      await sysAdminPage.getByRole('link').click();
      const report = await reportDownload;
      reportPath = await downloadService.saveDownload(report);
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

  test('Print a report', async ({
    sourceApp,
    appAdminPage,
    addContentPage,
    editContentPage,
    reportAppPage,
    reportPage,
    downloadService,
    pdfParser,
  }) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-605',
    });

    const fields = getFieldsForApp();
    let records = buildRecords(fields.groupField, fields.seriesField);

    await test.step('Setup source app with fields and records', async () => {
      await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
      records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
    });

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await reportAppPage.goto(sourceApp.id);
    });

    await test.step('Create the report', async () => {
      await reportAppPage.createReport(report);
      await reportAppPage.page.waitForURL(reportPage.pathRegex);
      await reportPage.page.waitForLoadState('networkidle');
    });

    let pdfPath: string;

    await test.step('Print the report to PDF', async () => {
      await reportPage.printReport();

      const pdfResponse = await reportPage.page.request.post(`/Report/${reportPage.getReportIdFromUrl()}/Print`);
      const responseHeaders = pdfResponse.headers();
      const nameMatch = responseHeaders['content-disposition'].match(/filename="(.+?)"/);

      expect(nameMatch).not.toBeNull();

      const pdfName = nameMatch![1];

      expect(pdfName).toBe(`${report.name}.pdf`);

      const pdf = await pdfResponse.body();

      pdfPath = await downloadService.saveBuffer(pdf, pdfName);
    });

    await test.step('Verify the printed report contains expected text', async () => {
      const expectedText = [report.name, 'Record Id'].concat(records.map(record => record.id.toString()));
      const foundExpectedText = await pdfParser.findTextInPDF(pdfPath, expectedText);

      expect(foundExpectedText).toBe(true);
    });
  });

  test('Add related data to a report', async ({
    appAdminPage,
    sourceApp,
    addContentPage,
    editContentPage,
    referencedApp,
    reportAppPage,
    reportPage,
  }) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-606',
    });

    const initialFields = getFieldsForApp();
    const fields = {
      ...initialFields,
      referenceField: new ReferenceField({
        name: FakeDataFactory.createFakeFieldName(),
        reference: referencedApp.name,
      }),
    };

    let relatedRecordId: string;

    await test.step('Create record in referenced app', async () => {
      await addContentPage.goto(referencedApp.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
      relatedRecordId = editContentPage.getRecordIdFromUrl().toString();
    });

    let records = buildRecords(fields.groupField, fields.seriesField, {
      referenceField: fields.referenceField,
      relatedRecordId: relatedRecordId!,
    });

    await test.step('Setup source app with fields and records', async () => {
      await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
      records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
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
      await reportAppPage.goto(sourceApp.id);
    });

    await test.step('Create the report', async () => {
      await reportAppPage.createReport(report);
      await reportAppPage.page.waitForURL(reportPage.pathRegex);
      await reportPage.page.waitForLoadState('networkidle');
    });

    await test.step('Verify the report was created', async () => {
      const numOfMasterRows = await reportPage.dataGridContainer.locator('tbody').locator('tr.k-master-row').count();
      expect(numOfMasterRows).toEqual(records.length);

      for (let i = 0; i < numOfMasterRows; i++) {
        const detailListResponse = reportAppPage.page.waitForResponse(/\/Report\/\d+\/DetailRecordList/);
        const masterRow = reportPage.dataGridContainer.locator('tbody').locator('tr.k-master-row').nth(i);
        await masterRow.locator('td').first().getByRole('link').click();
        await detailListResponse;

        const detailRow = reportPage.dataGridContainer.locator('tbody').locator('tr.k-detail-row').nth(i);
        const fieldGridHeader = detailRow.locator('.toolbar-container', { hasText: fields.referenceField.name });
        const recordIdHeader = detailRow.locator('thead').locator('th', { hasText: 'Record Id' });
        const relatedRecord = detailRow.locator('tbody').locator('tr', { hasText: relatedRecordId });

        await expect(fieldGridHeader).toBeVisible();
        await expect(recordIdHeader).toBeVisible();
        await expect(relatedRecord).toBeVisible();
      }
    });
  });

  test('Schedule a report for export', async ({
    sourceApp,
    addContentPage,
    editContentPage,
    reportAppPage,
    reportPage,
    sysAdminEmail,
  }) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-607',
    });

    test.slow();

    await test.step('Create record in source app', async () => {
      await addContentPage.goto(sourceApp.id);
      await addContentPage.saveRecordButton.click();
      await addContentPage.page.waitForURL(editContentPage.pathRegex);
    });

    await test.step("Navigate to the app's reports home page", async () => {
      await reportAppPage.goto(sourceApp.id);
    });

    const reportName = FakeDataFactory.createFakeReportName();

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: reportName,
      scheduling: 'Enabled',
      schedule: new ReportSchedule({
        sendFrequency: 'Every Day',
        startingOn: new Date(Date.now() + 1 * 60_000),
        fromName: 'Automation Test',
        fromAddress: FakeDataFactory.createFakeEmailFromAddress(),
        subject: `Scheduled Report ${reportName}`,
        body: 'This is the body of the scheduled report.',
      }),
    });

    await test.step('Create the report', async () => {
      await reportAppPage.createReport(report);
      await reportAppPage.page.waitForURL(reportPage.pathRegex);
      await reportPage.page.waitForLoadState('networkidle');
    });

    await test.step('Verify the report is exported', async () => {
      await expect(async () => {
        const searchCriteria = [['TEXT', report.schedule!.subject]];
        const result = await sysAdminEmail.getEmailByQuery(searchCriteria);

        expect(result.isOk()).toBe(true);
      }).toPass({
        intervals: [90_000, 30_000],
        timeout: 300_000,
      });
    });
  });

  test(
    'Configure a bar chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ appAdminPage, sourceApp, addContentPage, editContentPage, reportAppPage, reportPage }) => {
      test.info().annotations.push({
        description: AnnotationType.TestId,
        type: 'Test-608',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
        records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new BarChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
        }),
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await reportAppPage.goto(sourceApp.id);
      });

      await test.step('Create the report', async () => {
        await reportAppPage.createReport(report);
        await reportAppPage.page.waitForURL(reportPage.pathRegex);
        await reportPage.waitUntilLoaded();
      });

      await test.step('Verify the bar chart displays as expected', async () => {
        await expect(reportPage.reportContents).toHaveScreenshot();
      });
    }
  );

  test(
    'Configure a column chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ appAdminPage, sourceApp, addContentPage, editContentPage, reportAppPage, reportPage }) => {
      test.info().annotations.push({
        description: AnnotationType.TestId,
        type: 'Test-609',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
        records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new ColumnChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
        }),
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await reportAppPage.goto(sourceApp.id);
      });

      await test.step('Create the report', async () => {
        await reportAppPage.createReport(report);
        await reportAppPage.page.waitForURL(reportPage.pathRegex);
        await reportPage.waitUntilLoaded();
      });

      await test.step('Verify the column chart displays as expected', async () => {
        await expect(reportPage.reportContents).toHaveScreenshot();
      });
    }
  );

  test(
    'Configure a pie chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ appAdminPage, sourceApp, addContentPage, editContentPage, reportAppPage, reportPage }) => {
      test.info().annotations.push({
        description: AnnotationType.TestId,
        type: 'Test-610',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
        records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new PieChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
        }),
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await reportAppPage.goto(sourceApp.id);
      });

      await test.step('Create the report', async () => {
        await reportAppPage.createReport(report);
        await reportAppPage.page.waitForURL(reportPage.pathRegex);
        await reportPage.waitUntilLoaded();
      });

      await test.step('Verify the pie chart displays as expected', async () => {
        await expect(reportPage.reportContents).toHaveScreenshot();
      });
    }
  );

  test(
    'Configure a donut chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ appAdminPage, sourceApp, addContentPage, editContentPage, reportAppPage, reportPage }) => {
      test.info().annotations.push({
        description: AnnotationType.TestId,
        type: 'Test-611',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
        records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new DonutChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
        }),
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await reportAppPage.goto(sourceApp.id);
      });

      await test.step('Create the report', async () => {
        await reportAppPage.createReport(report);
        await reportAppPage.page.waitForURL(reportPage.pathRegex);
        await reportPage.waitUntilLoaded();
      });

      await test.step('Verify the donut chart displays as expected', async () => {
        await expect(reportPage.reportContents).toHaveScreenshot();
      });
    }
  );

  test(
    'Configure a line chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ appAdminPage, sourceApp, addContentPage, editContentPage, reportAppPage, reportPage }) => {
      test.info().annotations.push({
        description: AnnotationType.TestId,
        type: 'Test-612',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
        records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new LineChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
        }),
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await reportAppPage.goto(sourceApp.id);
      });

      await test.step('Create the report', async () => {
        await reportAppPage.createReport(report);
        await reportAppPage.page.waitForURL(reportPage.pathRegex);
        await reportPage.waitUntilLoaded();
      });

      await test.step('Verify the line chart displays as expected', async () => {
        await expect(reportPage.reportContents).toHaveScreenshot();
      });
    }
  );

  test(
    'Configure a spline chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ appAdminPage, sourceApp, addContentPage, editContentPage, reportAppPage, reportPage }) => {
      test.info().annotations.push({
        description: AnnotationType.TestId,
        type: 'Test-613',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
        records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new SplineChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
        }),
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await reportAppPage.goto(sourceApp.id);
      });

      await test.step('Create the report', async () => {
        await reportAppPage.createReport(report);
        await reportAppPage.page.waitForURL(reportPage.pathRegex);
        await reportPage.waitUntilLoaded();
      });

      await test.step('Verify the spline chart displays as expected', async () => {
        await expect(reportPage.reportContents).toHaveScreenshot();
      });
    }
  );

  test(
    'Configure a funnel chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ appAdminPage, sourceApp, addContentPage, editContentPage, reportAppPage, reportPage }) => {
      test.info().annotations.push({
        description: AnnotationType.TestId,
        type: 'Test-614',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
        records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new FunnelChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
        }),
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await reportAppPage.goto(sourceApp.id);
      });

      await test.step('Create the report', async () => {
        await reportAppPage.createReport(report);
        await reportAppPage.page.waitForURL(reportPage.pathRegex);
        await reportPage.waitUntilLoaded();
      });

      await test.step('Verify the funnel chart displays as expected', async () => {
        await expect(reportPage.reportContents).toHaveScreenshot();
      });
    }
  );

  test(
    'Configure a pyramid chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ appAdminPage, sourceApp, addContentPage, editContentPage, reportAppPage, reportPage }) => {
      test.info().annotations.push({
        description: AnnotationType.TestId,
        type: 'Test-615',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
        records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new PyramidChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
        }),
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await reportAppPage.goto(sourceApp.id);
      });

      await test.step('Create the report', async () => {
        await reportAppPage.createReport(report);
        await reportAppPage.page.waitForURL(reportPage.pathRegex);
        await reportPage.waitUntilLoaded();
      });

      await test.step('Verify the pyramid chart displays as expected', async () => {
        await expect(reportPage.reportContents).toHaveScreenshot();
      });
    }
  );

  test(
    'Configure a stacked bar chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ appAdminPage, sourceApp, addContentPage, editContentPage, reportAppPage, reportPage }) => {
      test.info().annotations.push({
        description: AnnotationType.TestId,
        type: 'Test-616',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
        records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new StackedBarChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
          seriesData: fields.seriesField.name,
        }),
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await reportAppPage.goto(sourceApp.id);
      });

      await test.step('Create the report', async () => {
        await reportAppPage.createReport(report);
        await reportAppPage.page.waitForURL(reportPage.pathRegex);
        await reportPage.waitUntilLoaded();
      });

      await test.step('Verify the stacked bar chart displays as expected', async () => {
        await expect(reportPage.reportContents).toHaveScreenshot();
      });
    }
  );

  test(
    'Configure a column plus line chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ appAdminPage, addContentPage, editContentPage, reportAppPage, reportPage, sysAdminPage }) => {
      test.info().annotations.push({
        description: AnnotationType.TestId,
        type: 'Test-617',
      });

      // The name of the source app needs to be unique to avoid conflicts...but
      // it also needs to be consistent across test runs so that snapshots can be compared.
      const projectName = test.info().project.name;
      const appName = `configure_a_column_plus_line_chart_${projectName}`;
      const sourceApp = await createApp(sysAdminPage, appName);
      appsToDelete.push(appName);

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
        records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
      });

      const lineReport = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new LineChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
        }),
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
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await reportAppPage.goto(sourceApp.id);
      });

      await test.step('Create the line report', async () => {
        await reportAppPage.createReport(lineReport);
        await reportAppPage.page.waitForURL(reportPage.pathRegex);
      });

      await test.step('Navigate back to the app reports home page', async () => {
        await reportAppPage.goto(sourceApp.id);
      });

      await test.step('Create the column report', async () => {
        await reportAppPage.createReport(columnReport);
        await reportAppPage.page.waitForURL(reportPage.pathRegex);
        await reportPage.waitUntilLoaded();
      });

      await test.step('Verify the column plus line chart displays as expected', async () => {
        await expect(reportPage.reportContents).toHaveScreenshot();
      });
    }
  );

  test(
    'Configure a stacked column chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ appAdminPage, sourceApp, addContentPage, editContentPage, reportAppPage, reportPage }) => {
      test.info().annotations.push({
        description: AnnotationType.TestId,
        type: 'Test-618',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
        records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
      });

      const report = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new StackedColumnChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
          seriesData: fields.seriesField.name,
        }),
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await reportAppPage.goto(sourceApp.id);
      });

      await test.step('Create the report', async () => {
        await reportAppPage.createReport(report);
        await reportAppPage.page.waitForURL(reportPage.pathRegex);
        await reportPage.waitUntilLoaded();
      });

      await test.step('Verify the stacked column chart displays as expected', async () => {
        await expect(reportPage.reportContents).toHaveScreenshot();
      });
    }
  );

  test(
    'Configure a stacked column plus line chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ appAdminPage, addContentPage, editContentPage, reportAppPage, reportPage, sysAdminPage }) => {
      test.info().annotations.push({
        description: AnnotationType.TestId,
        type: 'Test-619',
      });

      // The name of the source app needs to be unique to avoid conflicts...but
      // it also needs to be consistent across test runs so that snapshots can be compared.
      const projectName = test.info().project.name;
      const appName = `configure_a_column_plus_line_chart_${projectName}`;
      const sourceApp = await createApp(sysAdminPage, appName);
      appsToDelete.push(appName);

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
        records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
      });

      const lineReport = new SavedReportAsChart({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        chart: new LineChart({
          visibility: 'Display Chart Only',
          groupData: fields.groupField.name,
        }),
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
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await reportAppPage.goto(sourceApp.id);
      });

      await test.step('Create the line report', async () => {
        await reportAppPage.createReport(lineReport);
        await reportAppPage.page.waitForURL(reportPage.pathRegex);
      });

      await test.step("Navigate back to the app's reports home page", async () => {
        await reportAppPage.goto(sourceApp.id);
      });

      await test.step('Create the stacked column plus line report', async () => {
        await reportAppPage.createReport(stackedColumnReport);
        await reportAppPage.page.waitForURL(reportPage.pathRegex);
        await reportPage.waitUntilLoaded();
      });

      await test.step('Verify the stacked column plus line chart displays as expected', async () => {
        await expect(reportPage.reportContents).toHaveScreenshot();
      });
    }
  );

  test(
    'Configure a bubble chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ appAdminPage, sourceApp, addContentPage, editContentPage, reportAppPage, reportPage }) => {
      test.info().annotations.push({
        description: AnnotationType.TestId,
        type: 'Test-620',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField, undefined, fields.additionalGroupField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
        records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
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
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await reportAppPage.goto(sourceApp.id);
      });

      await test.step('Create the report', async () => {
        await reportAppPage.createReport(report);
        await reportAppPage.page.waitForURL(reportPage.pathRegex);
        await reportPage.waitUntilLoaded();
      });

      await test.step('Verify the bubble chart displays as expected', async () => {
        await expect(reportPage.reportContents).toHaveScreenshot();
      });
    }
  );

  test(
    'Configure a heat map chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ appAdminPage, sourceApp, addContentPage, editContentPage, reportAppPage, reportPage }) => {
      test.info().annotations.push({
        description: AnnotationType.TestId,
        type: 'Test-621',
      });

      const fields = getFieldsForApp();
      let records = buildRecords(fields.groupField, fields.seriesField);

      await test.step('Setup source app with fields and records', async () => {
        await addFieldsToApp(appAdminPage, sourceApp, Object.values(fields));
        records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
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
      });

      await test.step("Navigate to the app's reports home page", async () => {
        await reportAppPage.goto(sourceApp.id);
      });

      await test.step('Create the report', async () => {
        await reportAppPage.createReport(report);
        await reportAppPage.page.waitForURL(reportPage.pathRegex);
        await reportPage.waitUntilLoaded();
      });

      await test.step('Verify the heat map chart displays as expected', async () => {
        await expect(reportPage.reportContents).toHaveScreenshot();
      });
    }
  );

  test(
    'Configure a calendar',
    {
      tag: [Tags.Snapshot],
    },
    async ({ appAdminPage, sourceApp, addContentPage, editContentPage, reportAppPage, reportPage }) => {
      test.info().annotations.push({
        description: AnnotationType.TestId,
        type: 'Test-622',
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
        await addFieldsToApp(appAdminPage, sourceApp, [startDate, endDate]);
        records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
      });

      await test.step('Navigate to the app reports home page', async () => {
        await reportAppPage.goto(sourceApp.id);
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
      });

      await test.step('Create the report', async () => {
        await reportAppPage.createReport(report);
        await reportAppPage.page.waitForURL(reportPage.pathRegex);
        await reportPage.calendarChart.selectDate(testDate);
        await reportPage.waitUntilLoaded();
      });

      await test.step('Verify the calendar displays as expected', async () => {
        await reportPage.page.mouse.move(0, 0);
        await expect(reportPage.reportContents).toHaveScreenshot();
      });
    }
  );

  test(
    'Configure a gantt chart',
    {
      tag: [Tags.Snapshot],
    },
    async ({ appAdminPage, sourceApp, addContentPage, editContentPage, reportAppPage, reportPage }) => {
      test.info().annotations.push({
        description: AnnotationType.TestId,
        type: 'Test-623',
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
        await addFieldsToApp(appAdminPage, sourceApp, [startDate, endDate]);
        records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
      });

      await test.step('Navigate to the app reports home page', async () => {
        await reportAppPage.goto(sourceApp.id);
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
      });

      await test.step('Create the report', async () => {
        await reportAppPage.createReport(report);
        await reportAppPage.page.waitForURL(reportPage.pathRegex);
        await reportPage.waitUntilLoaded();
      });

      await test.step('Verify the gantt chart displays as expected', async () => {
        await expect(reportPage.reportContents).toHaveScreenshot();
      });
    }
  );

  test(
    'Configure a point map',
    {
      tag: [Tags.Snapshot],
    },
    async ({
      sourceApp,
      appAdminPage,
      addContentPage,
      editContentPage,
      viewContentPage,
      reportAppPage,
      reportPage,
    }) => {
      test.info().annotations.push({
        description: AnnotationType.TestId,
        type: 'Test-624',
      });

      const addressField = new TextField({ name: FakeDataFactory.createFakeFieldName() });
      const cityField = new TextField({ name: FakeDataFactory.createFakeFieldName() });
      const stateField = new TextField({ name: FakeDataFactory.createFakeFieldName() });
      const zipField = new TextField({ name: FakeDataFactory.createFakeFieldName() });
      const geocodePrecisionFieldName = 'Geocode Precision';
      const latitudeFieldName = 'Latitude';
      const longitudeFieldName = 'Longitude';

      await test.step('Navigate to the source app admin page', async () => {
        await appAdminPage.goto(sourceApp.id);
      });

      await test.step('Enable geocoding for the source app', async () => {
        await appAdminPage.enableGeocoding({
          address: addressField,
          city: cityField,
          state: stateField,
          zip: zipField,
        });
      });

      await test.step('Wait for geocode fields to be created', async () => {
        await appAdminPage.layoutTabButton.click();

        await expect(async () => {
          await appAdminPage.page.reload();

          const geocodePrecisionRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
            name: geocodePrecisionFieldName,
          });
          const latitudeRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: latitudeFieldName });
          const longitudeRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', {
            name: longitudeFieldName,
          });

          await expect(geocodePrecisionRow).toBeVisible({ timeout: 1_000 });
          await expect(latitudeRow).toBeVisible({ timeout: 1_000 });
          await expect(longitudeRow).toBeVisible({ timeout: 1_000 });
        }).toPass({
          intervals: [5_000],
          timeout: 120_000,
        });
      });

      await test.step('Place geocode fields on layout', async () => {
        await appAdminPage.layoutTab.openLayout();

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
          await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
            tabName: 'Tab 2',
            sectionName: 'Section 1',
            sectionColumn: 0,
            sectionRow: 0,
            fieldName: field,
          });
        }

        await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
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
        records = await addRecordsToApp(addContentPage, editContentPage, sourceApp, records);
      });

      await test.step('Wait for record to be geocoded', async () => {
        await viewContentPage.goto(sourceApp.id, records[0].id);

        const geocodePrecisionField = await viewContentPage.form.getField({
          tabName: 'Tab 2',
          sectionName: 'Section 1',
          fieldName: geocodePrecisionFieldName,
          fieldType: 'Text',
        });

        await expect(async () => {
          await viewContentPage.page.reload();
          await expect(geocodePrecisionField).toHaveText('High', { timeout: 1_000 });
        }).toPass({
          intervals: [5_000],
          timeout: 120_000,
        });
      });

      await test.step('Navigate to the source app reports home page', async () => {
        await reportAppPage.goto(sourceApp.id);
      });

      const report = new SavedReportAsPointMap({
        appName: sourceApp.name,
        name: FakeDataFactory.createFakeReportName(),
        visibility: 'Display Map Only',
        markerNameField: 'Record Id',
        selectedColor: '#FF0000',
      });

      await test.step('Create the report', async () => {
        await reportAppPage.createReport(report);
        await reportAppPage.page.waitForURL(reportPage.pathRegex);
        await reportPage.waitUntilLoaded();
      });

      await test.step('Verify the point map displays as expected', async () => {
        await expect(reportPage.reportContents).toHaveScreenshot();
      });
    }
  );

  test('Add a Report Alias to a display field and verify it displays correctly when viewing the report', async ({
    sourceApp,
    reportHomePage,
    reportPage,
  }) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-870',
    });

    const aliasValue = 'Alias';

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
      displayFields: [new DisplayField({ name: 'Record Id', alias: aliasValue })],
    });

    await test.step('Navigate to the report home page', async () => {
      await reportHomePage.goto();
    });

    await test.step('Create the report', async () => {
      await reportHomePage.createReport(report);
      await reportHomePage.page.waitForURL(reportPage.pathRegex);
    });

    await test.step('Verify the report was created', async () => {
      await expect(reportPage.breadcrumb).toHaveText(
        new RegExp(`Reports[\\s\\S]*${report.appName}[\\s\\S]*${report.name}`, 'i')
      );

      const recordIdColumn = reportPage.dataGridContainer.locator('th', { hasText: new RegExp(aliasValue, 'i') });
      await expect(recordIdColumn).toBeVisible();
    });
  });

  test('Update a report alias on a display field and verify it updates correctly when viewing the report', async ({
    sourceApp,
    reportHomePage,
    reportPage,
  }) => {
    test.info().annotations.push({
      description: AnnotationType.TestId,
      type: 'Test-871',
    });

    const aliasValue = 'Alias';
    const updatedAliasValue = 'Updated Alias';

    const report = new SavedReportAsReportDataOnly({
      appName: sourceApp.name,
      name: FakeDataFactory.createFakeReportName(),
      displayFields: [new DisplayField({ name: 'Record Id', alias: aliasValue })],
    });

    await test.step('Navigate to the report home page', async () => {
      await reportHomePage.goto();
    });

    await test.step('Create the report', async () => {
      await reportHomePage.createReport(report);
      await reportHomePage.page.waitForURL(reportPage.pathRegex);
    });

    await test.step('Verify the report was created', async () => {
      await expect(reportPage.breadcrumb).toHaveText(
        new RegExp(`Reports[\\s\\S]*${report.appName}[\\s\\S]*${report.name}`, 'i')
      );

      const recordIdColumn = reportPage.dataGridContainer.locator('th', { hasText: new RegExp(aliasValue, 'i') });
      await expect(recordIdColumn).toBeVisible();
    });

    await test.step('Update the report alias', async () => {
      const updatedReport = new SavedReportAsReportDataOnly({
        appName: sourceApp.name,
        name: report.name,
        displayFields: [new DisplayField({ name: 'Record Id', alias: updatedAliasValue })],
      });

      await reportPage.updateReport(updatedReport);
    });

    await test.step('Verify the report alias was updated', async () => {
      const updatedRecordIdColumn = reportPage.dataGridContainer.locator('th', {
        hasText: new RegExp(updatedAliasValue, 'i'),
      });

      await expect(updatedRecordIdColumn).toBeVisible();
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

async function addFieldsToApp(appAdminPage: AppAdminPage, app: App, fields: LayoutItem[]) {
  await appAdminPage.goto(app.id);
  await appAdminPage.layoutTabButton.click();
  await appAdminPage.layoutTab.openLayout();

  for (const [index, field] of fields.entries()) {
    await appAdminPage.layoutTab.addLayoutItemFromLayoutDesigner(field);

    await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
      fieldName: field.name,
      tabName: 'Tab 2',
      sectionName: 'Section 1',
      sectionColumn: 0,
      sectionRow: index,
    });
  }

  await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
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
        fieldValues: fieldValues,
      });
    }
  }

  if (additionalField) {
    for (const [index, record] of records.entries()) {
      const value = additionalField.values[index % additionalField.values.length].value;

      record.fieldValues.push({
        field: additionalField.name,
        value: value,
        tabName: 'Tab 2',
        sectionName: 'Section 1',
        type: additionalField.type as FieldType,
      });
    }
  }

  return records;
}

async function addRecordsToApp(
  addContentPage: AddContentPage,
  editContentPage: EditContentPage,
  app: App,
  records: Record[]
) {
  const createdRecords = [];

  for (const record of records) {
    await addContentPage.goto(app.id);

    for (const fieldValue of record.fieldValues) {
      switch (fieldValue.type) {
        case 'List': {
          const field = await addContentPage.form.getField({
            tabName: fieldValue.tabName,
            sectionName: fieldValue.sectionName,
            fieldName: fieldValue.field,
            fieldType: fieldValue.type,
          });

          await field.click();
          await field.page().getByRole('option', { name: fieldValue.value }).click();
          break;
        }
        case 'Reference': {
          const field = await addContentPage.form.getField({
            tabName: fieldValue.tabName,
            sectionName: fieldValue.sectionName,
            fieldName: fieldValue.field,
            fieldType: fieldValue.type,
          });

          await field.searchForAndSelectRecord(fieldValue.value);
          break;
        }
        case 'Date/Time': {
          const field = await addContentPage.form.getField({
            tabName: fieldValue.tabName,
            sectionName: fieldValue.sectionName,
            fieldName: fieldValue.field,
            fieldType: fieldValue.type,
          });

          await field.enterDate(new Date(fieldValue.value));
          break;
        }
        case 'Text': {
          const field = await addContentPage.form.getField({
            tabName: fieldValue.tabName,
            sectionName: fieldValue.sectionName,
            fieldName: fieldValue.field,
            fieldType: fieldValue.type,
          });

          await field.fill(fieldValue.value);
          break;
        }
        default:
          throw new Error(`Field type ${fieldValue.type} is not supported.`);
      }
    }

    await addContentPage.saveRecordButton.click();
    await addContentPage.page.waitForURL(editContentPage.pathRegex);

    const createdRecord = { ...record };
    createdRecord.id = editContentPage.getRecordIdFromUrl();
    createdRecords.push(createdRecord);
  }

  return createdRecords;
}
