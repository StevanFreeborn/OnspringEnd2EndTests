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
};
