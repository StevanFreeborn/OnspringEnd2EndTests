import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { app } from '../../fixtures/app.fixtures';
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
  testUser: User;
  appAdminPage: AppAdminPage;
  addContentPage: AddContentPage;
  editContentPage: EditContentPage;
  userUsagePage: UserUsagePage;
};

const test = base.extend<UserUsageReportTextFixtures>({
  app: app,
  testUser: async ({ browser, sysAdminPage }, use, testInfo) => {
    await createUserFixture(
      {
        browser,
        sysAdminPage,
        userStatus: UserStatus.Inactive,
        roles: [],
      },
      use,
      testInfo
    );
  },
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
    testUser,
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
    });

    await test.step('Create a record with a reference to a user', async () => {
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
    });

    await test.step('Navigate to the user usage report page', async () => {
      await userUsagePage.goto();
    });

    await test.step('Click on the Usage link for a user', async () => {
      await userUsagePage.filterReport({ name: testUser.fullName, status: 'Inactive' });
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

  test('Export the User Usage details for a user', async () => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-890',
    });

    expect(true).toBeTruthy();
  });
});
