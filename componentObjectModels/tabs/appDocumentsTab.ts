import { Locator, Page } from '@playwright/test';
import { CreateDynamicDocumentDialog } from '../dialogs/createDynamicDocumentDialog';
import { DeleteDocumentDialog } from '../dialogs/deleteDocumentDialog';

export class AppDocumentsTab {
  private readonly addDocumentLink: Locator;
  private readonly createDocumentDialog: CreateDynamicDocumentDialog;
  readonly documentsGrid: Locator;
  readonly deleteDocumentDialog: DeleteDocumentDialog;

  constructor(page: Page) {
    this.addDocumentLink = page.getByRole('link', { name: 'Add Document' });
    this.documentsGrid = page.locator('#grid-documents');
    this.createDocumentDialog = new CreateDynamicDocumentDialog(page);
    this.deleteDocumentDialog = new DeleteDocumentDialog(page);
  }

  async createDocument(name: string) {
    await this.addDocumentLink.click();

    await this.createDocumentDialog.nameInput.fill(name);
    await this.createDocumentDialog.saveButton.click();
  }

  async createDocumentCopy(documentToCopy: string, name: string) {
    await this.addDocumentLink.click();

    await this.createDocumentDialog.copyFromRadioButton.click();
    await this.createDocumentDialog.copyFromDropdown.click();
    await this.createDocumentDialog.getDocumentToCopy(documentToCopy).click();
    await this.createDocumentDialog.nameInput.fill(name);
    await this.createDocumentDialog.saveButton.click();
  }
}
