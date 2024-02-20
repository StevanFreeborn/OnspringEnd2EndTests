import { Page } from '@playwright/test';
import { ContentToolbar } from '../../componentObjectModels/toolbars/contentToolbar';
import { BasePage } from '../basePage';

export class ContentHomePage extends BasePage {
  private readonly path: string;
  readonly toolbar: ContentToolbar;

  constructor(page: Page) {
    super(page);
    this.path = '/Content';
    this.toolbar = new ContentToolbar(page);
  }

  async goto() {
    await this.page.goto(this.path);
  }
}
