import { Page } from '@playwright/test';
import { ContentLandingToolbar } from '../../componentObjectModels/toolbars/contentLandingToolbar';
import { BasePage } from '../basePage';

export class ContentHomePage extends BasePage {
  readonly path: string;
  readonly toolbar: ContentLandingToolbar;

  constructor(page: Page) {
    super(page);
    this.path = '/Content';
    this.toolbar = new ContentLandingToolbar(page);
  }

  async goto() {
    await this.page.goto(this.path);
  }
}
