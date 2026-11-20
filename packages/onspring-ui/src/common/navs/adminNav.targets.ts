import { Locator, Page } from '@playwright/test';

export const AdminNavTargets = {
  adminCreateButton: (page: Page): Locator => page.locator('#admin-create-button'),
  adminCreateMenu: (page: Page): Locator => page.locator('#admin-create-menu'),
  menuOption:
    (name: string) =>
    (page: Page): Locator =>
      page.locator('#admin-create-menu').getByText(name),
};

export const SidebarNavTargets = {
  usersFullName: (page: Page): Locator => page.locator('#user-name'),
  dashboardsTab: (page: Page): Locator => page.locator('#dashboard-tab'),
  contentTab: (page: Page): Locator => page.locator('#content-tab'),
  adminGearIcon: (page: Page): Locator => page.locator('#admin-tab'),
  pinnedContent: (page: Page): Locator => page.locator('#pinned-items'),
  userImage: (page: Page): Locator => page.locator('#user-image'),
  userMenu: (page: Page): Locator => page.locator('#user-menu'),
  profileLink: (page: Page): Locator => page.locator('#user-menu').getByText('Profile'),
  preferencesLink: (page: Page): Locator => page.locator('#user-menu').getByText('Preferences'),
  logoutLink: (page: Page): Locator => page.locator('#user-menu').getByText('Log Out'),
  containerLink:
    (containerName: string) =>
    (page: Page): Locator =>
      page.locator('#container-list').getByRole('link', { name: containerName }),
};

export const UserPreferencesModalTargets = {
  modal: (page: Page): Locator => page.getByRole('dialog', { name: 'User Preferences' }),
  defaultDashboardPlaceholder: (page: Page): Locator =>
    page
      .getByRole('dialog', { name: 'User Preferences' })
      .frameLocator('iframe')
      .locator('.label:has-text("My Default Dashboard") + .text'),
  defaultDashboardMethodSelector: (page: Page): Locator =>
    page
      .getByRole('dialog', { name: 'User Preferences' })
      .frameLocator('iframe')
      .locator('.label:has-text("My Default Dashboard") + .data')
      .getByRole('listbox'),
  defaultDashboardSelector: (page: Page): Locator =>
    page
      .getByRole('dialog', { name: 'User Preferences' })
      .frameLocator('iframe')
      .locator('[data-dashboard-row]')
      .getByRole('listbox'),
  optionByName:
    (name: string) =>
    (page: Page): Locator =>
      page.getByRole('dialog', { name: 'User Preferences' }).frameLocator('iframe').getByRole('option', { name }),
  saveButton: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'User Preferences' }).getByRole('button', { name: 'Save' }),
  cancelButton: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'User Preferences' }).getByRole('button', { name: 'Cancel' }),
};

export const AdminTileTargets = {
  appTileLink: (page: Page): Locator =>
    page.locator('.landing-list-item-container .image-link', {
      has: page.locator('.title:has-text("Apps")'),
    }),
  appTileCreateButton: (page: Page): Locator => page.locator('#card-create-button-Apps'),

  securityTileLink: (page: Page): Locator =>
    page.locator('.landing-list-item-container .image-link', {
      has: page.locator('.title:has-text("Security")'),
    }),
  securityTileCreateButton: (page: Page): Locator => page.locator('#card-create-button-Security'),
  securityCreateMenu: (page: Page): Locator => page.locator('[data-create-menu-for="card-create-button-Security"]'),
  securityMenuOption:
    (name: string) =>
    (page: Page): Locator =>
      page.locator('[data-create-menu-for="card-create-button-Security"]').getByText(name),

  listTileLink: (page: Page): Locator =>
    page.locator('.landing-list-item-container .image-link', {
      has: page.locator('.title:has-text("Lists")'),
    }),
  listTileCreateButton: (page: Page): Locator => page.locator('#card-create-button-Lists'),

  dashboardTileLink: (page: Page): Locator =>
    page.locator('.landing-list-item-container .image-link', {
      has: page.locator('.title:has-text("Dashboards")'),
    }),
  dashboardTileCreateButton: (page: Page): Locator => page.locator('#card-create-button-Dashboards'),
  dashboardCreateMenu: (page: Page): Locator => page.locator('[data-create-menu-for="card-create-button-Dashboards"]'),
  dashboardMenuOption:
    (name: string) =>
    (page: Page): Locator =>
      page.locator('[data-create-menu-for="card-create-button-Dashboards"]').getByText(name),

  messagingTileLink: (page: Page): Locator =>
    page.locator('.landing-list-item-container .image-link', {
      has: page.locator('.title:has-text("Messaging")'),
    }),
  messagingTileCreateButton: (page: Page): Locator => page.locator('#card-create-button-Messaging'),
  messagingCreateMenu: (page: Page): Locator => page.locator('[data-create-menu-for="card-create-button-Messaging"]'),
  messagingMenuOption:
    (name: string) =>
    (page: Page): Locator =>
      page.locator('[data-create-menu-for="card-create-button-Messaging"]').getByText(name),

  instanceTileLink: (page: Page): Locator =>
    page.locator('.landing-list-item-container .image-link', {
      has: page.locator('.title:has-text("Instance")'),
    }),
  instanceTileCreateButton: (page: Page): Locator => page.locator('#card-create-button-InstanceConfig'),
  instanceCreateMenu: (page: Page): Locator =>
    page.locator('[data-create-menu-for="card-create-button-InstanceConfig"]'),
  instanceMenuOption:
    (name: string) =>
    (page: Page): Locator =>
      page.locator('[data-create-menu-for="card-create-button-InstanceConfig"]').getByText(name),

  integrationTileLink: (page: Page): Locator =>
    page.locator('.landing-list-item-container .image-link', {
      has: page.locator('.title:has-text("Integration")'),
    }),
  integrationTileCreateButton: (page: Page): Locator => page.locator('#card-create-button-Integration'),
  integrationCreateMenu: (page: Page): Locator =>
    page.locator('[data-create-menu-for="card-create-button-Integration"]'),
  integrationMenuOption:
    (name: string) =>
    (page: Page): Locator =>
      page.locator('[data-create-menu-for="card-create-button-Integration"]').getByText(name),
};
