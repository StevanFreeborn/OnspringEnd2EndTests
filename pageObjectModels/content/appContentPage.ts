import { Page } from '@playwright/test';
import { QuickContentAddForm } from '../../componentObjectModels/forms/quickContentAddForm';
import { AppContentToolbar } from '../../componentObjectModels/toolbars/appContentToolbar';
import { BasePage } from '../basePage';

export class AppContentPage extends BasePage {
  readonly toolbar: AppContentToolbar;
  readonly quickContentAddForm: QuickContentAddForm;

  constructor(page: Page) {
    super(page);
    this.toolbar = new AppContentToolbar(page);
    this.quickContentAddForm = new QuickContentAddForm(page.locator('form', { hasText: 'Quick Content Add' }));
  }

  async goto(appId: number) {
    await this.page.goto(`/Content/${appId}/App`);
  }
}
