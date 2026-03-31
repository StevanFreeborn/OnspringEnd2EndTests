import { test as base, expect, Locator, Page } from '../../fixtures';
import { createTestUserPageFixture } from '../../fixtures/auth.fixtures';
import { createUserFixture } from '../../fixtures/user.fixtures';
import { User, UserStatus } from '../../models/user';
import { PageHistoryReportPage } from '../../pageObjectModels/systemReports/pageHistoryReportPage';
import { AnnotationType } from '../annotations';

type PageHistoryReportTestFixtures = {
  pageHistoryReportPage: PageHistoryReportPage;
  testUser: User;
  testUserPage: Page;
};

const test = base.extend<PageHistoryReportTestFixtures>({
  pageHistoryReportPage: async ({ sysAdminPage }, use) => await use(new PageHistoryReportPage(sysAdminPage)),
  testUser: async ({ browser, sysAdminPage }, use, testInfo) => {
    await createUserFixture(
      {
        browser,
        sysAdminPage,
        sysAdmin: true,
        userStatus: UserStatus.Active,
        roles: [],
      },
      use,
      testInfo
    );
  },
  testUserPage: async ({ browser, testUser }, use, testInfo) =>
    await createTestUserPageFixture({ browser, user: testUser }, use, testInfo),
});

test.describe('page history report', () => {
  test('Filter page history report', async ({ pageHistoryReportPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-580',
    });

    const today = new Date();

    await test.step('Navigate to the page history report', async () => {
      await pageHistoryReportPage.goto();
    });

    await test.step('Filter the page history report', async () => {
      await pageHistoryReportPage.filterReport({
        dateFilter: {
          type: 'Custom Dates',
          from: today,
          to: today,
        },
      });
    });

    await test.step('Verify the report is filtered correctly', async () => {
      const rows = await pageHistoryReportPage.getReportRows();

      expect(rows.length).toBeGreaterThanOrEqual(1);

      for (const row of rows) {
        const dateCell = row.getByRole('gridcell').nth(0);

        const dateValue = await dateCell.textContent();
        const activityDay = dateValue?.trim().split(' ')[0];

        expect(activityDay).toBe(`${today.toLocaleDateString('en-US', { timeZone: 'America/Chicago' })}`);
      }
    });
  });

  test('Sort page history report', async ({ pageHistoryReportPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-581',
    });

    await test.step('Navigate to the page history report', async () => {
      await pageHistoryReportPage.goto();
    });

    let initialRows: Locator[];
    let initialFirstRowContent: string;

    await test.step('Get initial grid rows', async () => {
      await expect(async () => {
        initialRows = await pageHistoryReportPage.getReportRows();
        expect(initialRows.length).toBeGreaterThan(1);
      }).toPass();

      const firstRowCells = await initialRows[0].getByRole('gridcell').all();
      initialFirstRowContent = await Promise.all(firstRowCells.map(c => c.textContent())).then(arr => arr.join(''));
    });

    await test.step('Sort the grid by Date', async () => {
      await pageHistoryReportPage.sortGridBy('Date', 'ascending');
    });

    await test.step('Verify the grid is sorted', async () => {
      const sortedRows = await pageHistoryReportPage.getReportRows();
      const sortedFirstRowCells = await sortedRows[0].getByRole('gridcell').all();
      const sortedFirstRowContent = await Promise.all(sortedFirstRowCells.map(c => c.textContent())).then(arr =>
        arr.join('')
      );

      expect(initialFirstRowContent).not.toEqual(sortedFirstRowContent);
    });
  });

  test('Export page history report', async ({
    testUser,
    testUserPage,
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
    const testUserPageHistoryPage = new PageHistoryReportPage(testUserPage);

    await test.step('Navigate to the page history report', async () => {
      await testUserPageHistoryPage.goto();
    });

    await test.step('Filter the page history report to limit results', async () => {
      await testUserPageHistoryPage.filterReport({
        dateFilter: {
          type: 'Custom Dates',
          from: today,
          to: today,
        },
      });
    });

    await test.step('Export the page history report', async () => {
      await testUserPageHistoryPage.exportReport();
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
      await testUserPage.setContent(exportEmailContent);

      const reportDownload = testUserPage.waitForEvent('download');
      await testUserPage.getByRole('link', { name: 'Download the export file' }).click();

      const report = await reportDownload;
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
