import { Page } from '@playwright/test';
import { App } from '../models/app';
import { LayoutItem } from '../models/layoutItem';
import { AppAdminPage } from '../pageObjectModels/apps/appAdminPage';

export async function createFields(sysAdminPage: Page, app: App, fields: LayoutItem[]) {
  const appAdminPage = new AppAdminPage(sysAdminPage);

  await appAdminPage.goto(app.id);
  await appAdminPage.layoutTabButton.click();

  const createdFields: LayoutItem[] = [];

  for (const field of fields) {
    await appAdminPage.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    const fieldId = await appAdminPage.layoutTab.getFieldIdFromFieldsAndObjectsGrid(field);
    createdFields.push({ ...field, id: fieldId });
  }

  return createdFields;
}
