import { User } from '@stevanfreeborn/onspring-models';
import { PageHistoryReportTargets, PageHistoryReportTasks, SystemReportQuestions } from '@stevanfreeborn/onspring-ui';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ActorFixture, expect, test as base, UserFixture } from '../../fixtures';
import { AnnotationType } from '../annotations';

type PageHistoryReportTestFixtures = {
  user: User;
  testUserActor: WebActor;
};

const test = base.extend<PageHistoryReportTestFixtures>({
  user: UserFixture.create().withStatus('Active').withSysAdmin(true).build(),
  testUserActor: ActorFixture.forUser().build(),
});

test.describe('page history report', () => {
  test('Filter page history report', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-580',
    });

    const today = new Date();

    await test.step('Navigate to the page history report', async () => {
      await sysAdminActor.attemptsTo(PageHistoryReportTasks.goto());
    });

    await test.step('Filter the page history report', async () => {
      await sysAdminActor.attemptsTo(
        PageHistoryReportTasks.filterReport({
          dateFilter: {
            type: 'Custom Dates',
            from: today,
            to: today,
          },
        })
      );
    });

    await test.step('Verify the report is filtered correctly', async () => {
      const dateValues = await sysAdminActor.browse().getAllTexts(PageHistoryReportTargets.dateCells);
      expect(dateValues.length).toBeGreaterThanOrEqual(1);

      const expectedDay = today.toLocaleDateString('en-US', { timeZone: 'America/Chicago' });

      for (const dateValue of dateValues) {
        const activityDay = dateValue?.trim().split(' ')[0];
        expect(activityDay).toBe(expectedDay);
      }
    });
  });

  test('Sort page history report', async ({ sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-581',
    });

    await test.step('Navigate to the page history report', async () => {
      await sysAdminActor.attemptsTo(PageHistoryReportTasks.goto());
    });

    let initialFirstRowContent: string;

    await test.step('Get initial grid rows', async () => {
      await expect(async () => {
        const initialRowCount = await sysAdminActor.browse().count(PageHistoryReportTargets.rows);
        expect(initialRowCount).toBeGreaterThan(1);
      }).toPass();

      const firstRowCellTexts = await sysAdminActor.browse().getAllTexts(PageHistoryReportTargets.firstRowCells);
      initialFirstRowContent = firstRowCellTexts.join('');
    });

    await test.step('Sort the grid by Date', async () => {
      await sysAdminActor.attemptsTo(PageHistoryReportTasks.sortGridBy('Date', 'ascending'));
    });

    await test.step('Verify the grid is sorted', async () => {
      const sortedFirstRowCellTexts = await sysAdminActor.browse().getAllTexts(PageHistoryReportTargets.firstRowCells);
      const sortedFirstRowContent = sortedFirstRowCellTexts.join('');

      expect(initialFirstRowContent).not.toEqual(sortedFirstRowContent);
    });
  });

  test('Export page history report', async ({
    user: testUser,
    testUserActor,
    sysAdminEmail,
    downloadService,
    sheetParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-582',
    });

    test.slow();

    const today = new Date();

    await test.step('Navigate to the page history report', async () => {
      await testUserActor.attemptsTo(PageHistoryReportTasks.goto());
    });

    await test.step('Filter the page history report to limit results', async () => {
      await testUserActor.attemptsTo(
        PageHistoryReportTasks.filterReport({
          dateFilter: {
            type: 'Custom Dates',
            from: today,
            to: today,
          },
        })
      );
    });

    await test.step('Export the page history report', async () => {
      await testUserActor.attemptsTo(PageHistoryReportTasks.exportReport());
    });

    let exportEmailContent: string;

    await test.step('Verify the report is exported successfully', async () => {
      await expect(async () => {
        const searchCriteria = [
          ['TO', testUser.email],
          ['SUBJECT', 'Onspring Report Export Complete'],
          ['TEXT', 'Page History'],
          ['UNSEEN'],
        ];
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

    await test.step('Download the exported page history report', async () => {
      const report = await testUserActor.asks(SystemReportQuestions.downloadedExportFromEmailHtml(exportEmailContent));
      reportPath = await downloadService.saveDownload(report);
    });

    await test.step('Verify report contains expected data', async () => {
      const reportData = sheetParser.parseFile(reportPath);
      expect(reportData).toHaveLength(1);

      const sheet = reportData[0];
      expect(sheet.name).toEqual('Report Data');
      expect(sheet.data.length).toBeGreaterThanOrEqual(1);

      const headers = Object.keys(sheet.data[0]);
      expect(headers).toEqual(expect.arrayContaining(['Date', 'Username', 'HTTP Method', 'Url']));

      const expectedUsernames = [testUser.username];
      const usernames = sheet.data.map(row => row['Username']);
      expect(usernames).toEqual(expect.arrayContaining(expectedUsernames));
    });
  });
});
