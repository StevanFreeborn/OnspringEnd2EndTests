import { Locator, Page } from '@playwright/test';
import { CreateDocumentDialog } from '../dialogs/createDocumentDialog';

export class AppDocumentsTab {
  private readonly addDocumentLink: Locator;
  private readonly createDocumentDialog: CreateDocumentDialog;
  readonly documentsGrid: Locator;

  constructor(page: Page) {
    this.addDocumentLink = page.getByRole('link', { name: 'Add Document' });
    this.documentsGrid = page.locator('#grid-documents');
    this.createDocumentDialog = new CreateDocumentDialog(page);
  }

  async addDocument(name: string) {
    await this.addDocumentLink.click();

    await this.createDocumentDialog.nameInput.fill(name);
    await this.createDocumentDialog.saveButton.click();
  }
}
