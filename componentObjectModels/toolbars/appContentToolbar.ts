import { Locator, Page } from '@playwright/test';

export class AppContentToolbar {
  private readonly searchInput: Locator;
  readonly createContentButton: Locator;

  constructor(page: Page) {
    this.searchInput = page.locator('#app-content-search');
    this.createContentButton = page.getByRole('button', { name: 'Create Content' });
  }
}
