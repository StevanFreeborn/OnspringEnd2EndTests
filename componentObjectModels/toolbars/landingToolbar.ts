import { Locator, Page } from '@playwright/test';

export abstract class LandingToolbar {
  protected readonly cardModeButton: Locator;
  protected readonly listModeButton: Locator;
  protected readonly sortBySelect: Locator;
  protected readonly filterByInput: Locator;
  protected readonly createMenu: Locator;

  protected constructor(page: Page) {
    this.cardModeButton = page.locator('#card-mode');
    this.listModeButton = page.locator('#list-mode');
    this.sortBySelect = page.locator('#apps-view-sort');
    this.filterByInput = page.locator('#apps-view-filter-input');
    this.createMenu = page.locator('#create-menu');
  }
}
