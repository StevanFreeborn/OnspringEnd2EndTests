import { Locator, Page } from '@playwright/test';
import { CreateApiKeyDialog } from '../../componentObjectModels/dialogs/createApiKeyDialog';
import { DeleteApiKeyDialog } from '../../componentObjectModels/dialogs/deleteApiKeyDialog';
import { BaseAdminPage } from '../baseAdminPage';

export class ApiKeysAdminPage extends BaseAdminPage {
  readonly path: string;
  readonly createApiKeyButton: Locator;
  readonly apiKeyGrid: Locator;
  readonly createApiKeyDialog: CreateApiKeyDialog;
  readonly deleteAppDialog: DeleteApiKeyDialog;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Security/ApiKey';
    this.createApiKeyButton = page.getByRole('button', { name: 'Create API Key' });
    this.apiKeyGrid = page.locator('#grid');
    this.createApiKeyDialog = new CreateApiKeyDialog(page);
    this.deleteAppDialog = new DeleteApiKeyDialog(page);
  }

  async goto() {
    await this.page.goto(this.path, { waitUntil: 'networkidle' });
  }

  async createApiKey(apiKeyName: string) {
    await this.createApiKeyButton.click();
    await this.createApiKeyDialog.nameInput.waitFor();
    await this.createApiKeyDialog.nameInput.fill(apiKeyName);
    await this.createApiKeyDialog.saveButton.click();
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
      await this.deleteAppDialog.deleteButton.click();
      await this.deleteAppDialog.waitForDialogToBeDismissed();
      await rowElement.waitForElementState('hidden');
    }
  }
}
