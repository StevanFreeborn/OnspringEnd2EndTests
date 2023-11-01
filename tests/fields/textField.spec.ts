import { LayoutItemType } from '../../componentObjectModels/menus/addLayoutItemMenu';
import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base, expect } from '../../fixtures';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AnnotationType } from '../annotations';
import { AppAdminPage } from './../../pageObjectModels/appAdminPage';
import { AppsAdminPage } from './../../pageObjectModels/appsAdminPage';

type TextFieldTestFixtures = {
  appAdminPage: AppAdminPage;
  appId: number;
};

const test = base.extend<TextFieldTestFixtures>({
  appAdminPage: async ({ sysAdminPage }, use) => {
    const appAdminPage = new AppAdminPage(sysAdminPage);
    await use(appAdminPage);
  },
  appId: async ({ sysAdminPage }, use) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    const appsAdminPage = new AppsAdminPage(sysAdminPage);
    const appAdminPage = new AppAdminPage(sysAdminPage);
    const appName = FakeDataFactory.createFakeAppName();

    await adminHomePage.goto();
    await adminHomePage.createApp(appName);
    await appAdminPage.page.waitForURL(appAdminPage.pathRegex);
    const appId = appAdminPage.getAppIdFromUrl();

    await use(appId);

    await appsAdminPage.goto();
    await appsAdminPage.deleteApps([appName]);
  },
});

test.describe('text field', () => {
  test.beforeEach(async ({ appAdminPage, appId }) => {
    await appAdminPage.goto(appId);
    await appAdminPage.layoutTabButton.click();
  });

  test('Add a Text Field to an app from the Fields & Objects report', async ({ appAdminPage }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-80',
    });

    const fieldName = FakeDataFactory.createFakeFieldName();

    await test.step('Add the text field', async () => {
      await appAdminPage.layoutTab.addFieldButton.click();
      await appAdminPage.layoutTab.addLayoutItemMenu.selectItem(LayoutItemType.TextField);
      await appAdminPage.layoutTab.addLayoutItemDialog.continueButton.click();
      await appAdminPage.layoutTab.addLayoutItemModal.nameInput.fill(fieldName);
      await appAdminPage.layoutTab.addLayoutItemModal.saveButton.click();
    });

    await test.step('Verify the field was added', async () => {
      await appAdminPage.page.waitForLoadState('networkidle');
      const fieldRow = appAdminPage.layoutTab.fieldsAndObjectsGrid.getByRole('row', { name: fieldName });
      await expect(fieldRow).toBeVisible();
    });
  });
});
