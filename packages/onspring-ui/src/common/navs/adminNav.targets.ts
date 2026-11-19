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
  adminGearIcon: (page: Page): Locator => page.locator('#admin-tab'),
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
};
