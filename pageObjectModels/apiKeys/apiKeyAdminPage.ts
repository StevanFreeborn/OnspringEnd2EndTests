import { Locator, Page } from '@playwright/test';
import { ApiKeyGeneralTab } from '../../componentObjectModels/tabs/apiKeyGeneralTab';
import { BaseAdminPage } from '../baseAdminPage';
import { ApiKeyDevInfoTab } from '../../componentObjectModels/tabs/apiKeyDevInfoTab';

export class ApiKeyAdminPage extends BaseAdminPage {
  readonly pathRegex: RegExp;
  readonly closeButton: Locator;
  private readonly saveApiKeyPathRegex: RegExp;
  private readonly saveButton: Locator;
  private readonly saveAndCloseButton: Locator;
  readonly cancelButton: Locator;
  readonly generalTabButton: Locator;
  readonly devInfoTabButton: Locator;
  readonly generalTab: ApiKeyGeneralTab;
  readonly devInfoTab: ApiKeyDevInfoTab;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/Security\/ApiKey\/\d+\/Edit/;
    this.closeButton = page.getByRole('link', { name: 'Close' });
    this.saveApiKeyPathRegex = /\/Admin\/Security\/ApiKey\/\d+\/Edit/;
    this.saveButton = page.getByRole('link', { name: 'Save Changes' });
    this.saveAndCloseButton = page.getByRole('link', { name: 'Save & Close' });
    this.cancelButton = page.getByRole('link', { name: 'Cancel' });
    this.generalTabButton = page.locator('#tab-strip').getByText('General');
    this.devInfoTabButton = page.locator('#tab-strip').getByText('Developer Information');
    this.generalTab = new ApiKeyGeneralTab(page);
    this.devInfoTab = new ApiKeyDevInfoTab(page);
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

  async save() {
    const saveResponsePromise = this.page.waitForResponse(
      r => r.url().match(this.saveApiKeyPathRegex) !== null && r.request().method() === 'POST'
    );
    await this.saveButton.click();
    await saveResponsePromise;
  }
}
