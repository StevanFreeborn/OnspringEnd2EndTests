import { FakeDataFactory } from '../../factories/fakeDataFactory';
import { test as base } from '../../fixtures';
import { AdminHomePage } from '../../pageObjectModels/adminHomePage';
import { AppAdminPage } from './../../pageObjectModels/appAdminPage';

type TextFieldTestFixtures = {
  appAdminPage: AppAdminPage;
  appId: number;
};

const test = base.extend<TextFieldTestFixtures>({
  appAdminPage: async ({ sysAdminPage }, use) => {
    const appAdminPage = new AppAdminPage(sysAdminPage);
    await use(appAdminPage);
  },
  appId: async ({ appAdminPage, sysAdminPage }, use) => {
    const adminHomePage = new AdminHomePage(sysAdminPage);
    const appName = FakeDataFactory.createFakeAppName();

    await adminHomePage.goto();
    await adminHomePage.createApp(appName);
    await appAdminPage.page.waitForLoadState();
    const appId = appAdminPage.getAppIdFromUrl();
    await use(appId);
  },
});

test.describe('text field', () => {
  test.beforeEach(async ({ appAdminPage, appId }) => {
    await appAdminPage.goto(appId);
  });

  test('Add a Text Field to an app from the Fields & Objects report', async ({ appAdminPage }) => {
    await test.step('Add the text field', async () => {
      await appAdminPage.layoutTabButton.click();
    });
    await test.step('Verify the field was added', async () => {});
  });
});
