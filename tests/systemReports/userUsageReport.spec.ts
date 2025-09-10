import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect, Page } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
import { testUserPage } from '../../fixtures/auth.fixtures';
import { createUserFixture } from '../../fixtures/user.fixtures';
import { App } from '../../models/app';
import { ReferenceField } from '../../models/referenceField';
import { User, UserStatus } from '../../models/user';
import { AppAdminPage } from '../../pageObjectModels/apps/appAdminPage';
import { AddContentPage } from '../../pageObjectModels/content/addContentPage';
import { EditContentPage } from '../../pageObjectModels/content/editContentPage';
import { UserUsagePage } from '../../pageObjectModels/systemReports/userUsagePage';
import { AnnotationType } from '../annotations';

type UserUsageReportTextFixtures = {
  app: App;
  user: User;
  testUserPage: Page;
  appAdminPage: AppAdminPage;
  addContentPage: AddContentPage;
  editContentPage: EditContentPage;
  userUsagePage: UserUsagePage;
};

const test = base.extend<UserUsageReportTextFixtures>({
  app: app,
  user: async ({ browser, sysAdminPage }, use, testInfo) => {
    await createUserFixture(
      {
        browser,
        sysAdminPage,
        userStatus: UserStatus.Active,
        sysAdmin: true,
        roles: [],
      },
      use,
      testInfo
    );
  },
  testUserPage: testUserPage,
  appAdminPage: async ({ sysAdminPage }, use) => await use(new AppAdminPage(sysAdminPage)),
  addContentPage: async ({ sysAdminPage }, use) => await use(new AddContentPage(sysAdminPage)),
  editContentPage: async ({ sysAdminPage }, use) => await use(new EditContentPage(sysAdminPage)),
  userUsagePage: async ({ sysAdminPage }, use) => await use(new UserUsagePage(sysAdminPage)),
});

test.describe('user usage report', () => {
  test('Filter the user usage report', async ({ userUsagePage, sysAdminUser }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-886',
    });

    await test.step('Navigate to the user usage report page', async () => {
      await userUsagePage.goto();
    });

    await test.step('Filter the user usage report', async () => {
      await userUsagePage.filterReport({
        name: sysAdminUser.fullName,
        status: 'Active',
        tier: 'Full User',
      });
    });

    await test.step('Verify the report is filtered', async () => {
      const rows = await userUsagePage.getRows();
      expect(rows.length).toBe(1);
      await expect(rows[0]).toHaveText(new RegExp(sysAdminUser.fullName));
    });
  });

  test('Sort the user usage report', async ({ userUsagePage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-887',
    });

    await test.step('Navigate to the user usage report page', async () => {
      await userUsagePage.goto();
    });

    await test.step('Sort the user usage report', async () => {
      await userUsagePage.filterReport({ status: 'Active' });
      await userUsagePage.clearSort();
      await userUsagePage.sortGridBy('Username', 'ascending');
    });

    await test.step('Verify the report is sorted', async () => {
      const rows = await userUsagePage.getRows();
      const usernames = await Promise.all(
        rows.map(async row => {
          const usernameCell = row.locator('td').nth(1);
          return usernameCell.innerText();
        })
      );
      const sortedUsernames = [...usernames].sort((a, b) => a.localeCompare(b));

      expect(usernames).toEqual(sortedUsernames);
    });
  });

  test('Click on the Usage link for a user in the report to view the usage details', async ({
    userUsagePage,
    sysAdminUser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-888',
    });

    await test.step('Navigate to the user usage report page', async () => {
      await userUsagePage.goto();
    });

    await test.step('Click on the Usage link for a user', async () => {
      await userUsagePage.filterReport({ name: sysAdminUser.fullName, status: 'Active' });

      const userRow = await userUsagePage.getRowByName(new RegExp(sysAdminUser.fullName));
      const usageLink = userRow.getByRole('link', { name: 'Usage' });
      await usageLink.click();
    });

    await test.step('Verify the usage details dialog is displayed', async () => {
      const dialog = userUsagePage.page.getByRole('dialog', { name: 'User Usage' });
      await expect(dialog).toBeVisible();
    });
  });

  test('Click on a "Link" link within the usage details dialog', async ({
    app,
    appAdminPage,
    addContentPage,
    editContentPage,
    user: testUser,
    userUsagePage,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-889',
    });

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const referenceField = new ReferenceField({
      name: FakeDataFactory.createFakeFieldName(),
      reference: 'Users',
    });

    await test.step("Create a reference field to the user's app", async () => {
      await createReferenceFieldToUsersApp(appAdminPage, app, tabName, sectionName, referenceField);
    });

    await test.step('Create a record with a reference to a user', async () => {
      await createRecordWithReferenceToUser(
        addContentPage,
        editContentPage,
        app,
        tabName,
        sectionName,
        referenceField,
        testUser
      );
    });

    await test.step('Navigate to the user usage report page', async () => {
      await userUsagePage.goto();
    });

    await test.step('Click on the Usage link for a user', async () => {
      await userUsagePage.filterReport({ name: testUser.fullName, status: 'Active' });
      const userRow = await userUsagePage.getRowByName(new RegExp(testUser.fullName));
      const usageLink = userRow.getByRole('link', { name: 'Usage' });
      await usageLink.click();
    });

    await test.step('Verify that clicking on the "Link" link within the usage details dialog takes the user to the correct page', async () => {
      const usageDialog = userUsagePage.page.getByRole('dialog', { name: 'User Usage' });
      const contentReferencesGrid = usageDialog.locator('#contentGrid');
      const contentReferenceRow = contentReferencesGrid.getByRole('row', { name: new RegExp(app.name) });
      const link = contentReferenceRow.getByRole('link', { name: 'Link' });

      const context = userUsagePage.page.context();
      const reportPagePromise = context.waitForEvent('page');
      await link.click();
      const reportPage = await reportPagePromise;

      await expect(reportPage).toHaveURL(/\/Report\/[a-f0-9]{24}\/DisplayTemp/);
    });
  });

  test('Export the User Usage details for a user', async ({
    app,
    appAdminPage,
    addContentPage,
    editContentPage,
    user: testUser,
    testUserPage,
    sysAdminEmail,
    downloadService,
    sheetParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-890',
    });

    test.slow();

    const tabName = 'Tab 2';
    const sectionName = 'Section 1';
    const referenceField = new ReferenceField({
      name: FakeDataFactory.createFakeFieldName(),
      reference: 'Users',
    });

    await test.step("Create a reference field to the user's app", async () => {
      await createReferenceFieldToUsersApp(appAdminPage, app, tabName, sectionName, referenceField);
    });

    await test.step('Create a record with a reference to a user', async () => {
      await createRecordWithReferenceToUser(
        addContentPage,
        editContentPage,
        app,
        tabName,
        sectionName,
        referenceField,
        testUser
      );
    });

    const testUserUsagePage = new UserUsagePage(testUserPage);

    await test.step('Navigate to the user usage report page', async () => {
      await testUserUsagePage.goto();
    });

    await test.step('Click on the Usage link for a user', async () => {
      await testUserUsagePage.filterReport({ name: testUser.fullName, status: 'Active' });
      const userRow = await testUserUsagePage.getRowByName(new RegExp(testUser.fullName));
      const usageLink = userRow.getByRole('link', { name: 'Usage' });
      await usageLink.click();
    });

    await test.step('Click the Export button within the usage details dialog', async () => {
      const usageDialog = testUserUsagePage.page.getByRole('dialog', { name: 'User Usage' });
      const exportButtonLink = usageDialog.getByRole('link', { name: 'Export' });
      await exportButtonLink.click();

      const exportReportDialog = testUserUsagePage.page.getByRole('dialog', { name: 'Export Report' });
      const exportButton = exportReportDialog.getByRole('button', { name: 'Export' });
      await exportButton.click();
    });

    let exportEmailContent: string;

    await test.step('Verify the user usage details are exported', async () => {
      await expect(async () => {
        const searchCriteria = [
          ['TO', testUser.email],
          ['SUBJECT', 'Onspring Report Export Complete'],
          ['TEXT', `User Usage Report`],
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

    await test.step('Download the exported user usage details', async () => {
      await testUserPage.setContent(exportEmailContent);

      const reportDownload = testUserPage.waitForEvent('download');
      await testUserPage.getByRole('link', { name: 'Download the export file' }).click();

      const report = await reportDownload;
      reportPath = await downloadService.saveDownload(report);
    });

    await test.step('Verify report contains expected data', async () => {
      const reportData = sheetParser.parseFile(reportPath, false);
      expect(reportData).toMatchObject([
        {
          name: 'Content References',
          data: [
            {
              '0': `Username: ${testUser.fullName} / ${testUser.username}`,
            },
            {},
            {
              '0': 'Content References',
            },
            {
              '0': 'App/Survey',
              '1': 'Field Name',
              '2': 'Record Count',
              '3': 'Report Link',
            },
            {
              '0': app.name,
              '1': referenceField.name,
              '2': 1,
              '3': 'Link',
            },
          ],
        },
        {
          name: 'Admin Apps',
          data: [
            {
              '0': 'App',
              '1': 'Type',
              '2': 'Name',
              '3': 'Link',
            },
          ],
        },
        {
          name: 'Admin Integration',
          data: [
            {
              '0': 'Apps',
              '1': 'Type',
              '2': 'Name',
              '3': 'Link',
            },
          ],
        },
        {
          name: 'Admin Dashboard',
          data: [
            {
              '0': 'Name',
              '1': 'Type',
              '2': 'Link',
            },
          ],
        },
      ]);
    });
  });
});

async function createReferenceFieldToUsersApp(
  appAdminPage: AppAdminPage,
  app: App,
  tabName: string,
  sectionName: string,
  referenceField: ReferenceField
) {
  await appAdminPage.goto(app.id);
  await appAdminPage.layoutTabButton.click();
  await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(referenceField);
  await appAdminPage.layoutTab.openLayout();
  await appAdminPage.layoutTab.layoutDesignerModal.dragFieldOnToLayout({
    fieldName: referenceField.name,
    tabName: tabName,
    sectionName: sectionName,
    sectionColumn: 0,
    sectionRow: 0,
  });
  await appAdminPage.layoutTab.layoutDesignerModal.saveAndCloseLayout();
}

async function createRecordWithReferenceToUser(
  addContentPage: AddContentPage,
  editContentPage: EditContentPage,
  app: App,
  tabName: string,
  sectionName: string,
  referenceField: ReferenceField,
  testUser: User
) {
  await addContentPage.goto(app.id);
  const editableReferenceField = await addContentPage.form.getField({
    tabName: tabName,
    sectionName: sectionName,
    fieldName: referenceField.name,
    fieldType: 'Reference',
  });
  await editableReferenceField.searchForAndSelectRecord(testUser.fullName);
  await addContentPage.saveRecordButton.click();
  await addContentPage.page.waitForURL(editContentPage.pathRegex);
}
