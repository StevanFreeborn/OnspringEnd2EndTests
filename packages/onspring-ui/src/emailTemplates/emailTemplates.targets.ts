import { Locator, Page } from '@playwright/test';

export const EmailTemplatesPageTargets = {
  route: '/Admin/Messaging/Template',
  getListPagePath: '/Admin/Messaging/Template/GetListPage',
  deleteTemplatePathRegex: /\/Admin\/Messaging\/Template\/\d+\/Delete/,
  createEmailTemplateButton: (page: Page): Locator => page.getByRole('button', { name: 'Create Email Template' }),
  grid: (page: Page): Locator => page.locator('#grid'),
  rowByName:
    (name: string) =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).first(),
  deleteButtonInRow:
    (name: string) =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).first().getByTitle('Delete'),
};

export const EditEmailTemplatePageTargets = {
  pathRegex: /\/Admin\/Messaging\/Template\/\d+\/Edit/,
  nameInput: (page: Page): Locator => page.getByLabel('Name', { exact: true }),
  descriptionEditor: (page: Page): Locator => page.locator('.content-area.mce-content-body:visible'),
  statusSwitch: (page: Page): Locator => page.getByRole('switch'),
  statusToggle: (page: Page): Locator => page.getByRole('switch').locator('span').nth(3),
  saveChangesButton: (page: Page): Locator => page.getByRole('link', { name: 'Save Changes' }),
  generalTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'General' }),
};
