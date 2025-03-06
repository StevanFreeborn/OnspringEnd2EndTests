import { Locator, Page } from '@playwright/test';
import { CreateApiKeyDialog } from '../../componentObjectModels/dialogs/createApiKeyDialog';
import { DeleteApiKeyDialog } from '../../componentObjectModels/dialogs/deleteApiKeyDialog';
import { TEST_API_KEY_NAME } from '../../factories/fakeDataFactory';
import { BaseAdminPage } from '../baseAdminPage';

export class ApiKeysAdminPage extends BaseAdminPage {
  private readonly getApiKeysPath: string;
  readonly path: string;
  private readonly deleteApiKeyPathRegex: RegExp;
  readonly createApiKeyButton: Locator;
  readonly apiKeyGrid: Locator;
  readonly createApiKeyDialog: CreateApiKeyDialog;
  readonly deleteApiKeyDialog: DeleteApiKeyDialog;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Security/ApiKey';
    this.deleteApiKeyPathRegex = /\/Admin\/Security\/ApiKey\/\d+\/Delete/;
    this.getApiKeysPath = '/Admin/Security/ApiKey/GetListPage';
    this.createApiKeyButton = page.getByRole('button', { name: 'Create API Key' });
    this.apiKeyGrid = page.locator('#grid');
    this.createApiKeyDialog = new CreateApiKeyDialog(page);
    this.deleteApiKeyDialog = new DeleteApiKeyDialog(page);
  }

  async goto() {
    const getApiKeysResponse = this.page.waitForResponse(this.getApiKeysPath);
    await this.page.goto(this.path);
    await getApiKeysResponse;
  }

  async createApiKey(apiKeyName: string) {
    await this.createApiKeyButton.click();
    await this.createApiKeyDialog.nameInput.waitFor();
    await this.createApiKeyDialog.nameInput.fill(apiKeyName);
    await this.createApiKeyDialog.saveButton.click();
  }

  async deleteAllTestApiKeys() {
    await this.goto();

    const apiKeyRow = this.apiKeyGrid.getByRole('row', { name: new RegExp(TEST_API_KEY_NAME, 'i') }).first();
    let isVisible = await apiKeyRow.isVisible();

    while (isVisible) {
      await apiKeyRow.hover();
      await apiKeyRow.getByTitle('Delete API Key').click();

      const deleteResponse = this.page.waitForResponse(this.deleteApiKeyPathRegex);

      await this.deleteApiKeyDialog.deleteButton.click();

      await deleteResponse;

      isVisible = await apiKeyRow.isVisible();
    }
  }

  async deleteApiKeys(apiKeysToDelete: string[]) {
    await this.goto();

    for (const apiKey of apiKeysToDelete) {
      const apiKeyRow = this.apiKeyGrid.getByRole('row', { name: apiKey }).first();
      const rowElement = await apiKeyRow.elementHandle();

      if (rowElement === null) {
        continue;
      }

      await apiKeyRow.hover();
      await apiKeyRow.getByTitle('Delete API Key').click();
      await this.deleteApiKeyDialog.deleteButton.click();
      await this.deleteApiKeyDialog.waitForDialogToBeDismissed();
      await rowElement.waitForElementState('hidden');
    }
  }
}
