import { Page } from '@playwright/test';
import { FakeDataFactory } from '../factories/fakeDataFactory';
import { App } from '../models/app';
import { AdminHomePage } from '../pageObjectModels/adminHomePage';
import { AppAdminPage } from '../pageObjectModels/apps/appAdminPage';
import { AppsAdminPage } from '../pageObjectModels/apps/appsAdminPage';

export async function appAdminPage({ sysAdminPage }: { sysAdminPage: Page }, use: (r: AppAdminPage) => Promise<void>) {
  const appAdminPage = new AppAdminPage(sysAdminPage);

  await use(appAdminPage);
}

export async function app({ sysAdminPage }: { sysAdminPage: Page }, use: (r: App) => Promise<void>) {
  const app = await createApp(sysAdminPage);

  await use(app);

  await new AppsAdminPage(sysAdminPage).deleteApps([app.name]);
}

export async function createApp(sysAdminPage: Page) {
  const adminHomePage = new AdminHomePage(sysAdminPage);
  const appAdminPage = new AppAdminPage(sysAdminPage);
  const appName = FakeDataFactory.createFakeAppName();

  await adminHomePage.goto();
  await adminHomePage.createApp(appName);
  await appAdminPage.page.waitForURL(appAdminPage.pathRegex);
  const appId = appAdminPage.getIdFromUrl();
  const app = new App({ id: appId, name: appName });
  return app;
}
