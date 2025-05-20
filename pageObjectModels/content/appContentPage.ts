import { Locator, Page } from '@playwright/test';
import { QuickContentAddForm } from '../../componentObjectModels/forms/quickContentAddForm';
import { AppContentToolbar } from '../../componentObjectModels/toolbars/appContentToolbar';
import { BasePage } from '../basePage';

export class AppContentPage extends BasePage {
  private readonly searchResults: Locator;
  readonly pathRegex: RegExp;
  readonly toolbar: AppContentToolbar;
  readonly quickContentAddForm: QuickContentAddForm;

  constructor(page: Page) {
    super(page);

    this.pathRegex = /\/Content\/\d+\/App/;
    this.toolbar = new AppContentToolbar(page);
    this.quickContentAddForm = new QuickContentAddForm(page.locator('form', { hasText: 'Quick Content Add' }));
    this.searchResults = this.page.locator('#app-search-results');
  }

  async goto(appId: number) {
    await this.page.goto(`/Content/${appId}/App`);
  }

  getAppIdFromUrl() {
    const url = this.page.url();
    const match = url.match(this.pathRegex);
   
    if (match === null) {
      throw new Error('The current page is not an app content page.');
    }

    const urlParts = url.split('/');
    const appId = urlParts[urlParts.length - 2];
    return parseInt(appId);
  }

  getSearchResultByRecordId(recordId: number) {
    const appId = this.getAppIdFromUrl();
    return this.searchResults.locator(`a[href="/Content/${appId}/${recordId}"]`);
  }
}
