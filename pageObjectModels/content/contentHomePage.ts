import { Page } from '@playwright/test';
import { ContentLandingToolbar } from '../../componentObjectModels/toolbars/contentToolbar';
import { BasePage } from '../basePage';

export class ContentHomePage extends BasePage {
  private readonly path: string;
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
