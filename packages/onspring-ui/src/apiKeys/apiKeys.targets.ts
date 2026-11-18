import { Locator, Page } from '@playwright/test';

export const ApiKeysPageTargets = {
  route: '/Admin/Security/ApiKey',
  getListPagePath: '/Admin/Security/ApiKey/GetListPage',
  deleteApiKeyPathRegex: /\/Admin\/Security\/ApiKey\/\d+\/Delete/,
  createApiKeyButton: (page: Page): Locator => page.getByRole('button', { name: 'Create API Key' }),
  grid: (page: Page): Locator => page.locator('#grid'),
  rowByName:
    (name: string) =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).first(),
  deleteButtonInRow:
    (name: string) =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).first().getByTitle('Delete API Key'),
};

export const ApiKeyDetailTargets = {
  pathRegex: /\/Admin\/Security\/ApiKey\/\d+\/Edit/,
  saveButton: (page: Page): Locator => page.getByRole('link', { name: 'Save Changes' }),
  generalTabButton: (page: Page): Locator => page.locator('#tab-strip').getByText('General'),
  devInfoTabButton: (page: Page): Locator => page.locator('#tab-strip').getByText('Developer Information'),
  generalTab: {
    nameInput: (page: Page): Locator => page.getByLabel('Name'),
    descriptionEditor: (page: Page): Locator => page.locator('.content-area.mce-content-body'),
    roleSelect: (page: Page): Locator => page.getByRole('listbox', { name: 'Role' }),
    roleOption:
      (role: string) =>
      (page: Page): Locator =>
        page.getByRole('option', { name: role }),
    statusSwitch: (page: Page): Locator => page.getByRole('switch', { name: 'Status' }),
    statusToggle: (page: Page): Locator => page.getByRole('switch', { name: 'Status' }).locator('span').nth(3),
  },
  devInfoTab: {
    apiUrl: (page: Page): Locator => page.locator('td:nth-match(td:has-text("API URL") + td, 1)'),
    apiKey: (page: Page): Locator => page.locator('td:nth-match(td:has-text("X-ApiKey Header") + td, 1)'),
  },
};
