import { Locator, Page } from '@playwright/test';
import { CreateDynamicDocumentDialogForApp } from '../../componentObjectModels/dialogs/createDynamicDocumentDialog';
import { BaseAdminPage } from '../baseAdminPage';
import { DeleteDocumentDialog } from '../../componentObjectModels/dialogs/deleteDocumentDialog';

export class DocumentAdminPage extends BaseAdminPage {
  readonly path: string;
  readonly documentsGrid: Locator;
  private readonly createDocumentButton: Locator;
  private readonly createDocumentDialog: CreateDynamicDocumentDialogForApp;
  readonly deleteDocumentDialog: DeleteDocumentDialog;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Document';
    this.documentsGrid = page.locator('#grid');
    this.createDocumentButton = page.getByRole('button', { name: 'Create Document' });
    this.createDocumentDialog = new CreateDynamicDocumentDialogForApp(page);
    this.deleteDocumentDialog = new DeleteDocumentDialog(page);
  }

  async goto() {
    await this.page.goto(this.path, { waitUntil: 'networkidle' });
  }

  async createDocument(appName: string, documentName: string) {
    await this.createDocumentButton.click();
    await this.createDocumentDialog.selectApp(appName);
    await this.createDocumentDialog.nameInput.fill(documentName);
    await this.createDocumentDialog.saveButton.click();
  }

  async createDocumentCopy(appName: string, documentToCopy: string, documentName: string) {
    await this.createDocumentButton.click();
    await this.createDocumentDialog.selectApp(appName);
    await this.createDocumentDialog.copyFromRadioButton.click();
    await this.createDocumentDialog.copyFromDropdown.click();
    await this.createDocumentDialog.getDocumentToCopy(documentToCopy).click();
    await this.createDocumentDialog.nameInput.fill(documentName);
    await this.createDocumentDialog.saveButton.click();
  }
}
