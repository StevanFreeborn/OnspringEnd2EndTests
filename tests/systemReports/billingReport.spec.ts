import { User } from '@stevanfreeborn/onspring-models';
import { BillingReportTargets, BillingReportTasks, SystemReportQuestions } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ActorFixture, expect, test as base, UserFixture } from '../../fixtures';
import { AnnotationType } from '../annotations';

type BillingReportTestFixtures = {
  user: User;
  testUserActor: WebActor;
};

const test = base.extend<BillingReportTestFixtures>({
  user: UserFixture.create().withStatus('Active').withSysAdmin(true).build(),
  testUserActor: ActorFixture.forUser().build(),
});

test.describe('billing report', () => {
  test('Filter the Usage History Report', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-291',
    });

    await test.step('Navigate to the billing report', async () => {
      await sysAdminActor.attemptsTo(BillingReportTasks.goto());
    });

    let filterResult: { ok: boolean; hasSeriesData: boolean };

    await test.step('Filter the usage history report', async () => {
      filterResult = await sysAdminActor.asks(
        SystemReportQuestions.applyBillingUsageHistoryFilter({
          type: 'Custom Dates',
          increment: 'Year',
          startDate: new Date(2024, 5, 26),
          endDate: new Date(2025, 5, 26),
        })
      );
    });

    await test.step('Verify the usage history report is filtered', async () => {
      expect(filterResult.ok).toBe(true);

      // NOTE: These are conditional because
      // the data in this chart is supplied only if
      // a particular scheduled task has been setup in the environment
      // if there is no data then the x-axis labels will not be present
      // eslint-disable-next-line playwright/no-conditional-in-test
      if (filterResult.hasSeriesData) {
        await sysAdminActor.browse().check(BillingReportTargets.usageHistory.xAxisYearLabel('2024')).isVisible();
        await sysAdminActor.browse().check(BillingReportTargets.usageHistory.xAxisYearLabel('2025')).isVisible();
      }
    });
  });

  test('Export the Detailed Data Usage By App Statistics report', async ({
    user: testUser,
    testUserActor,
    sysAdminEmail,
    downloadService,
    sheetParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-882',
    });

    test.slow();

    await test.step('Navigate to the billing report', async () => {
      await testUserActor.attemptsTo(BillingReportTasks.goto());
    });

    await test.step('Export the Detailed Data Usage By App Statistics report', async () => {
      await testUserActor.attemptsTo(BillingReportTasks.exportDataUsageReport());
    });

    let exportEmailContent: string;

    await test.step('Verify the export is successful', async () => {
      await expect(async () => {
        const searchCriteria = [['TO', testUser.email], ['TEXT', 'Detailed Data Usage By App Report'], ['UNSEEN']];
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

    await test.step('Download the exported Detailed Data Usage By App Statistics report', async () => {
      const report = await testUserActor.asks(SystemReportQuestions.downloadedExportFromEmailHtml(exportEmailContent));
      reportPath = await downloadService.saveDownload(report);
    });

    await test.step('Verify report contains expected data', async () => {
      const reportData = sheetParser.parseFile(reportPath);
      expect(reportData).toHaveLength(1);

      const sheet = reportData[0];
      expect(sheet.name).toEqual('Report Data');
      expect(sheet.data.length).toBeGreaterThanOrEqual(3);

      const headers = Object.keys(sheet.data[0]);
      expect(headers).toEqual(expect.arrayContaining(['App ID', 'App Name', 'Total Records', 'Total Size (GB)']));

      const expectedApps = ['Users', 'Roles', 'Groups'];
      const appNames = sheet.data.map(row => row['App Name']);
      expect(appNames).toEqual(expect.arrayContaining(expectedApps));
    });
  });

  test('Sort the Detailed Data usage By App Statistics report', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-883',
    });

    await test.step('Navigate to the billing report', async () => {
      await sysAdminActor.attemptsTo(BillingReportTasks.goto());
    });

    await test.step('Sort the Detailed Data usage By App Statistics report', async () => {
      await sysAdminActor.attemptsTo(
        BillingReportTasks.clearDataUsageSort(),
        BillingReportTasks.sortDataUsageBy('App ID', 'ascending')
      );
    });

    await test.step('Verify the report is sorted', async () => {
      const appIds = await sysAdminActor.browse().getAllTexts(BillingReportTargets.dataUsage.firstColumnCells);
      expect(appIds.length).toBeGreaterThanOrEqual(2);

      for (let i = 0; i < appIds.length - 1; i++) {
        const currentAppIdNumber = parseInt(appIds[i] || '0', 10);
        const nextAppIdNumber = parseInt(appIds[i + 1] || '0', 10);

        expect(currentAppIdNumber).toBeLessThanOrEqual(nextAppIdNumber);
      }
    });
  });

  test('Export the Detailed File Storage By App Statistics report', async ({
    user: testUser,
    testUserActor,
    sysAdminEmail,
    downloadService,
    sheetParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-884',
    });

    await test.step('Navigate to the billing report', async () => {
      await testUserActor.attemptsTo(BillingReportTasks.goto());
    });

    await test.step('Export the Detailed File Storage By App Statistics report', async () => {
      await testUserActor.attemptsTo(BillingReportTasks.exportFileStorageReport());
    });

    let exportEmailContent: string;

    await test.step('Verify the export is successful', async () => {
      await expect(async () => {
        const searchCriteria = [['TO', testUser.email], ['TEXT', 'Detailed File Storage By App Report'], ['UNSEEN']];
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

    await test.step('Download the exported Detailed File Storage By App Statistics report', async () => {
      const report = await testUserActor.asks(SystemReportQuestions.downloadedExportFromEmailHtml(exportEmailContent));
      reportPath = await downloadService.saveDownload(report);
    });

    await test.step('Verify report contains expected data', async () => {
      const reportData = sheetParser.parseFile(reportPath);
      expect(reportData).toHaveLength(1);

      const sheet = reportData[0];
      expect(sheet.name).toEqual('Report Data');
      expect(sheet.data.length).toBeGreaterThanOrEqual(3);

      const headers = Object.keys(sheet.data[0]);
      expect(headers).toEqual(expect.arrayContaining(['App ID', 'App/Survey Name', 'Total Files', 'File Size (GB)']));

      const expectedApps = ['Users', 'Roles', 'Groups', 'Unused Files', 'Miscellaneous'];
      const appNames = sheet.data.map(row => row['App/Survey Name']);
      expect(appNames).toEqual(expect.arrayContaining(expectedApps));
    });
  });

  test('Sort the Detailed File Storage By App Statistics report', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-885',
    });

    await test.step('Navigate to the billing report', async () => {
      await sysAdminActor.attemptsTo(BillingReportTasks.goto());
    });

    await test.step('Sort the Detailed File Storage By App Statistics report', async () => {
      await sysAdminActor.attemptsTo(
        BillingReportTasks.clearFileStorageSort(),
        BillingReportTasks.sortFileStorageBy('App ID', 'ascending')
      );
    });

    await test.step('Verify the report is sorted', async () => {
      const appIds = await sysAdminActor.browse().getAllTexts(BillingReportTargets.fileStorage.firstColumnCells);
      expect(appIds.length).toBeGreaterThanOrEqual(2);

      for (let i = 0; i < appIds.length - 1; i++) {
        const currentAppIdNumber = parseInt(appIds[i] || '0', 10);
        const nextAppIdNumber = parseInt(appIds[i + 1] || '0', 10);

        expect(currentAppIdNumber).toBeLessThanOrEqual(nextAppIdNumber);
      }
    });
  });
});
