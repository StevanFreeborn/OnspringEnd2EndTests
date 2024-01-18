import { Locator, Page } from '@playwright/test';
import { ApiKeyGeneralTab } from '../../componentObjectModels/tabs/apiKeyGeneralTab';
import { BaseAdminPage } from '../baseAdminPage';

export class ApiKeyAdminPage extends BaseAdminPage {
  readonly pathRegex: RegExp;
  readonly closeButton: Locator;
  readonly saveButton: Locator;
  readonly saveAndCloseButton: Locator;
  readonly cancelButton: Locator;
  readonly generalTabButton: Locator;
  readonly devInfoTabButton: Locator;
  readonly generalTab: ApiKeyGeneralTab;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/Security\/ApiKey\/\d+\/Edit/;
    this.closeButton = page.getByRole('link', { name: 'Close' });
    this.saveButton = page.getByRole('link', { name: 'Save Changes' });
    this.saveAndCloseButton = page.getByRole('link', { name: 'Save & Close' });
    this.cancelButton = page.getByRole('link', { name: 'Cancel' });
    this.generalTabButton = page.locator('#tab-strip').getByText('General');
    this.devInfoTabButton = page.locator('#tab-strip').getByText('Developer Information');
    this.generalTab = new ApiKeyGeneralTab(page);
  }

  async goto(apiKeyId: number) {
    const path = `/Admin/Security/ApiKey/${apiKeyId}/Edit`;
    await this.page.goto(path);
  }

  async getIdFromUrl() {
    if (this.page.url().match(this.pathRegex) === null) {
      throw new Error('The current page is not an api key admin page.');
    }

    const url = this.page.url();
    const urlParts = url.split('/');
    const apiKeyId = urlParts[urlParts.length - 2];
    return parseInt(apiKeyId);
  }
}
