import { Locator, Page } from '@playwright/test';

export const SharedListsPageTargets = {
  route: '/Admin/SharedList',
  getListPath: '/Admin/SharedList/GetListPage',
  deleteListPathRegex: /\/Admin\/SharedList\/\d+\/Delete/,
  createListButton: (page: Page): Locator => page.getByRole('button', { name: 'Create List' }),
  listsGrid: (page: Page): Locator => page.locator('#grid'),
  rowByName: (listName: string) => (page: Page): Locator =>
    page.locator('#grid').getByRole('row', { name: listName }).first(),
  deleteButtonInRow: (listName: string) => (page: Page): Locator =>
    page.locator('#grid').getByRole('row', { name: listName }).first().getByTitle('Delete List'),
};

export const EditSharedListPageTargets = {
  pathRegex: /\/Admin\/SharedList\/\d+\/Edit/,
  saveChangesButton: (page: Page): Locator => page.getByRole('link', { name: 'Save Changes' }),
  generalTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'General' }),
  valuesTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Values' }),
  sharingTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Sharing' }),

  generalTab: {
    nameInput: (page: Page): Locator => page.getByLabel('Name'),
    descriptionEditor: (page: Page): Locator => page.locator('.content-area.mce-content-body'),
    statusSwitch: (page: Page): Locator => page.getByRole('switch', { name: 'Status' }),
    statusToggle: (page: Page): Locator =>
      page.getByRole('switch', { name: 'Status' }).locator('span').nth(3),
  },

  valuesTab: {
    valuesGrid: (page: Page): Locator => page.locator('.list-values'),
    addValueButton: (page: Page): Locator =>
      page.locator('.list-values').getByRole('button', { name: 'Add Value' }),
    editAllButton: (page: Page): Locator =>
      page.locator('.list-values').getByRole('button', { name: 'Edit All' }),
    customSortCheckbox: (page: Page): Locator =>
      page.locator('.list-values').getByLabel('Enable custom sort'),
    rowByValue: (value: string) => (page: Page): Locator =>
      page.locator('.list-values').locator('div.k-grid-content').getByRole('row', { name: value }),
  },

  sharingTab: {
    availableToSelector: (page: Page): Locator =>
      page.locator('.label:has-text("Available to") + .data'),
    selectedAppsDualPaneSelector: (page: Page): Locator =>
      page.locator('.label:has-text("Selected Apps & Surveys") + .data'),
  },
};
