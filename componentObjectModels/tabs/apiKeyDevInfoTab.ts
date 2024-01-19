import { Locator, Page } from '@playwright/test';

export class ApiKeyDevInfoTab {
  readonly apiUrl: Locator;
  readonly apiKey: Locator;

  constructor(page: Page) {
    this.apiUrl = page.locator('td:nth-match(td:has-text("API URL") + td, 1)');
    this.apiKey = page.locator('td:nth-match(td:has-text("X-ApiKey Header") + td, 1)');
  }
}
