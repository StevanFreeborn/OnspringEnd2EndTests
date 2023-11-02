import { Locator, Page } from '@playwright/test';

export class CanvasSection {
  private readonly section: Locator;
  constructor(page: Page) {
    this.section = page.frameLocator('iframe').locator('.canvas-section').first();
  }
}
