import { Locator, Page } from '@playwright/test';
import { LandingToolbar } from './landingToolbar';

export class ContentLandingToolbar extends LandingToolbar {
  private readonly createContentButton: Locator;

  constructor(page: Page) {
    super(page);
    this.createContentButton = page.getByRole('button', { name: 'Create Content' });
  }

  async createRecord(name: string) {
    await this.createContentButton.click();
    await this.createMenu.getByText(name).click();
  }
}
