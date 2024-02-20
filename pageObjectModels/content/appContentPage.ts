import { Page } from '@playwright/test';
import { AppContentToolbar } from '../../componentObjectModels/toolbars/appContentToolbar';
import { BasePage } from '../basePage';

export class AppContentPage extends BasePage {
  readonly toolbar: AppContentToolbar;

  constructor(page: Page) {
    super(page);
    this.toolbar = new AppContentToolbar(page);
  }

  async goto(appId: number) {
    await this.page.goto(`/Content/${appId}/App`);
  }
}
