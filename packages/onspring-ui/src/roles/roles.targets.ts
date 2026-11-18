import { Page } from '@playwright/test';

export const RolesSecurityPageTargets = {
  route: '/Admin/Security/Role',
  getRolesPath: '/Admin/Security/Role/RoleList',
  deleteRolePathRegex: /\/Admin\/Security\/Role\/\d+\/Delete/,
  createRoleButton: (page: Page) => page.getByRole('button', { name: 'Create Role' }),
  roleGrid: (page: Page) => page.locator('#grid'),
  rowByName: (roleName: string) => (page: Page) =>
    page.locator('#grid').getByRole('row', { name: roleName }).first(),
  deleteButtonInRow: (roleName: string) => (page: Page) =>
    page.locator('#grid').getByRole('row', { name: roleName }).first().getByTitle('Delete Role'),
  copyButtonInRow: (roleName: string) => (page: Page) =>
    page.locator('#grid').getByRole('row', { name: roleName }).first().getByTitle('Copy Role'),
};

export const AddRolePageTargets = {
  route: '/Admin/Security/Role/Add',
  editPathRegex: /\/Admin\/Security\/Role\/\d+\/Edit/,
  generalTabButton: (page: Page) => page.getByRole('tab', { name: 'General' }),
  appPermissionsTabButton: (page: Page) => page.getByRole('tab', { name: 'App Permissions' }),
  adminPermissionsTabButton: (page: Page) => page.getByRole('tab', { name: 'Administration Permissions' }),
  nameInput: (page: Page) => page.locator('.data-Name input'),
  descriptionEditor: (page: Page) => page.locator('.data-Description .content-area.mce-content-body'),
  statusToggle: (page: Page) =>
    page.locator('.data-Status div.type-checkbox').getByRole('switch').locator('span').nth(3),
  saveRecordButton: (page: Page) => page.getByRole('link', { name: 'Save Record' }),

  appPermTab: {
    filterByInput: (page: Page) => page.locator('#app-filter-input > input'),
    appSectionHeading: (appName: string) => (page: Page) =>
      page
        .locator('section.section')
        .filter({ has: page.locator('h1').filter({ hasText: appName }) })
        .first()
        .locator('h1'),
    appSectionGrid: (appName: string) => (page: Page) =>
      page
        .locator('section.section')
        .filter({ has: page.locator('h1').filter({ hasText: appName }) })
        .first()
        .locator('table'),
    permissionRow: (appName: string, rowName: string) => (page: Page) =>
      page
        .locator('section.section')
        .filter({ has: page.locator('h1').filter({ hasText: appName }) })
        .first()
        .locator('table')
        .getByRole('row', { name: rowName }),
    permissionCheckbox: (appName: string, rowName: string, permType: 'create' | 'read' | 'update' | 'delete' | 'enabled') => (page: Page) =>
      page
        .locator('section.section')
        .filter({ has: page.locator('h1').filter({ hasText: appName }) })
        .first()
        .locator('table')
        .getByRole('row', { name: rowName })
        .locator(`[data-permission-type="${permType}"]`)
        .first(),
  },
};

export const EditRolePageTargets = {
  pathRegex: /\/Admin\/Security\/Role\/\d+\/Edit/,
  saveRecordButton: (page: Page) => page.getByRole('link', { name: 'Save Record' }),
  generalTab: {
    nameInput: (page: Page) => page.locator('.data-Name input'),
    descriptionEditor: (page: Page) => page.locator('.data-Description .content-area.mce-content-body'),
    statusSwitch: (page: Page) => page.getByRole('switch'),
    statusToggle: (page: Page) =>
      page.locator('.data-Status div.type-checkbox').getByRole('switch').locator('span').nth(3),
  },
};

export const CopyRolePageTargets = {
  pathRegex: /\/Admin\/Security\/Role\/\d+\/Copy/,
  saveRecordButton: (page: Page) => page.getByRole('link', { name: 'Save Record' }),
  generalTab: {
    nameInput: (page: Page) => page.locator('.data-Name input'),
    descriptionEditor: (page: Page) => page.locator('.data-Description .content-area.mce-content-body'),
  },
};

export const SecurityPillNavTargets = {
  usersPill: (page: Page) => page.getByRole('link', { name: 'Users' }),
  rolesPill: (page: Page) => page.getByRole('link', { name: 'Roles' }),
  groupsPill: (page: Page) => page.getByRole('link', { name: 'Groups' }),
  apiKeysPill: (page: Page) => page.getByRole('link', { name: 'API Keys' }),
};
