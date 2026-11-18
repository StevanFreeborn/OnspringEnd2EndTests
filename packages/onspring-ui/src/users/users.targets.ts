import { Locator, Page } from '@playwright/test';
import { UserStatus } from '@stevanfreeborn/onspring-models';

export const UsersPageTargets = {
  route: '/Admin/Security/User',
  getUsersPath: '/Admin/Security/User/UserList',
  deleteUserPathRegex: /\/Admin\/Security\/User\/\d+\/Delete/,
  createUserButton: (page: Page): Locator => page.getByRole('button', { name: 'Create User' }),
  userGrid: (page: Page): Locator => page.locator('#grid'),
  rowByName: (username: string) => (page: Page): Locator =>
    page.locator('#grid').getByRole('row', { name: username }).first(),
  deleteButtonInRow: (username: string) => (page: Page): Locator =>
    page.locator('#grid').getByRole('row', { name: username }).first().getByTitle('Delete User'),
  copyButtonInRow: (username: string) => (page: Page): Locator =>
    page.locator('#grid').getByRole('row', { name: username }).first().getByTitle('Copy User'),
};

export const AddUserPageTargets = {
  route: '/Admin/Security/User/Add',
  generalTabButton: (page: Page): Locator => page.locator('#tab-strip-0').getByText('General'),
  securityTabButton: (page: Page): Locator => page.locator('#tab-strip-0').getByText('Security'),
  firstNameInput: (page: Page): Locator => page.locator('.data-FirstName input'),
  lastNameInput: (page: Page): Locator => page.locator('.data-LastName input'),
  usernameInput: (page: Page): Locator => page.locator('.data-Username input'),
  emailInput: (page: Page): Locator => page.locator('.data-EmailAddress input'),
  statusButton: (status: UserStatus) => (page: Page): Locator =>
    page.getByRole('button', { name: status, exact: status === 'Active' }),
  activeStatusButton: (page: Page): Locator =>
    page.getByRole('button', { name: 'Active', exact: true }),
  inactiveStatusButton: (page: Page): Locator =>
    page.getByRole('button', { name: 'Inactive' }),
  lockedStatusButton: (page: Page): Locator =>
    page.getByRole('button', { name: 'Locked' }),
  saveRecordButton: (page: Page): Locator => page.getByRole('link', { name: 'Save Record' }),
};

export const EditUserPageTargets = {
  pathRegex: /\/Admin\/Security\/User\/\d+\/Edit/,
  saveRecordButton: (page: Page): Locator => page.getByRole('link', { name: 'Save Record' }),
  securityTabButton: (page: Page): Locator => page.locator('#tab-strip-0').getByText('Security'),

  generalTab: {
    firstNameInput: (page: Page): Locator => page.locator('.data-FirstName input'),
    lastNameInput: (page: Page): Locator => page.locator('.data-LastName input'),
    usernameInput: (page: Page): Locator => page.locator('.data-Username input'),
    emailInput: (page: Page): Locator => page.locator('.data-EmailAddress input'),
    statusButton: (status: UserStatus) => (page: Page): Locator =>
      page.getByRole('button', { name: status, exact: status === 'Active' }),
    activeStatusButton: (page: Page): Locator =>
      page.getByRole('button', { name: 'Active', exact: true }),
    inactiveStatusButton: (page: Page): Locator =>
      page.getByRole('button', { name: 'Inactive' }),
    lockedStatusButton: (page: Page): Locator =>
      page.getByRole('button', { name: 'Locked' }),
  },

  securityTab: {
    rolesReferenceGrid: {
      control: (page: Page): Locator => page.locator('.data-Roles div.onx-reference-grid'),
      filterInput: (page: Page): Locator =>
        page.locator('.data-Roles div.onx-reference-grid').getByPlaceholder('Select Related'),
      searchResults: (page: Page): Locator => page.locator('.grid-search-results:visible'),
      gridTable: (page: Page): Locator =>
        page.locator('.data-Roles div.onx-reference-grid').getByRole('grid'),
      rowByName: (roleName: string) => (page: Page): Locator =>
        page.locator('.data-Roles div.onx-reference-grid').getByRole('grid').getByRole('row', { name: roleName }),
    },
    groupsReferenceGrid: {
      control: (page: Page): Locator => page.locator('.data-Groups div.onx-reference-grid'),
      filterInput: (page: Page): Locator =>
        page.locator('.data-Groups div.onx-reference-grid').getByPlaceholder('Select Related'),
      searchResults: (page: Page): Locator => page.locator('.grid-search-results:visible'),
      gridTable: (page: Page): Locator =>
        page.locator('.data-Groups div.onx-reference-grid').getByRole('grid'),
      rowByName: (groupName: string) => (page: Page): Locator =>
        page.locator('.data-Groups div.onx-reference-grid').getByRole('grid').getByRole('row', { name: groupName }),
    },
  },
};

export const CopyUserPageTargets = {
  pathRegex: /\/Admin\/Security\/User\/\d+\/Copy/,
  saveRecordButton: (page: Page): Locator => page.getByRole('link', { name: 'Save Record' }),
  generalTab: {
    firstNameInput: (page: Page): Locator => page.locator('.data-FirstName input'),
    lastNameInput: (page: Page): Locator => page.locator('.data-LastName input'),
    usernameInput: (page: Page): Locator => page.locator('.data-Username input'),
    emailInput: (page: Page): Locator => page.locator('.data-EmailAddress input'),
    activeStatusButton: (page: Page): Locator =>
      page.getByRole('button', { name: 'Active', exact: true }),
    inactiveStatusButton: (page: Page): Locator =>
      page.getByRole('button', { name: 'Inactive' }),
    lockedStatusButton: (page: Page): Locator =>
      page.getByRole('button', { name: 'Locked' }),
  },
};
