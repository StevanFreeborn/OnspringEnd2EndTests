import { Page } from '@playwright/test';
import { App } from '../models/app';
import { LayoutItem } from '../models/layoutItem';
import { AppAdminPage } from '../pageObjectModels/apps/appAdminPage';

export async function createFields(sysAdminPage: Page, app: App, fields: LayoutItem[]) {
  const appAdminPage = new AppAdminPage(sysAdminPage);

  await appAdminPage.goto(app.id);
  await appAdminPage.layoutTabButton.click();

  for (const field of fields) {
    await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    field.id = await appAdminPage.layoutTab.getFieldIdFromFieldsAndObjectsGrid(field);
  }

  return fields;
}
