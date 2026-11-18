import { Locator, Page } from '@playwright/test';

export const ContainersPageTargets = {
  route: '/Admin/Dashboard/Container',
  getListPagePath: '/Admin/Dashboard/Container/GetListPage',
  deleteContainerPathRegex: /\/Admin\/Dashboard\/Container\/\d+\/Delete/,
  createContainerButton: (page: Page): Locator => page.getByRole('button', { name: 'Create Container' }),
  containerGrid: (page: Page): Locator => page.locator('#grid'),
  rowByName:
    (name: string) =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).first(),
  copyButtonInRow:
    (name: string) =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).first().getByTitle('Copy Container'),
  deleteButtonInRow:
    (name: string) =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).first().getByTitle('Delete Container'),
};

export const AddContainerPageTargets = {
  route: '/Admin/Dashboard/Container/Add',
  pathRegex: /\/Admin\/Dashboard\/Container\/Add/,
  nameInput: (page: Page): Locator => page.getByLabel('Name'),
  saveChangesButton: (page: Page): Locator => page.getByRole('link', { name: 'Save Changes' }),
};

export const EditContainerPageTargets = {
  pathRegex: /\/Admin\/Dashboard\/Container\/\d+\/Edit/,
  nameInput: (page: Page): Locator => page.getByLabel('Name'),
  saveChangesButton: (page: Page): Locator => page.getByRole('link', { name: 'Save Changes' }),
};

export const CopyContainerPageTargets = {
  pathRegex: /\/Admin\/Dashboard\/Container\/\d+\/Copy/,
  nameInput: (page: Page): Locator => page.getByLabel('Name'),
  saveChangesButton: (page: Page): Locator => page.getByRole('link', { name: 'Save Changes' }),
};
