import { Locator, Page } from '@playwright/test';
import { CreateDynamicDocumentDialogForApp } from '../../componentObjectModels/dialogs/createDynamicDocumentDialog';
import { BaseAdminPage } from '../baseAdminPage';

export class DocumentAdminPage extends BaseAdminPage {
  readonly path: string;
  readonly documentsGrid: Locator;
  private readonly createDocumentButton: Locator;
  private readonly createDocumentDialog: CreateDynamicDocumentDialogForApp;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Document';
    this.documentsGrid = page.locator('#grid');
    this.createDocumentButton = page.getByRole('button', { name: 'Create Document' });
    this.createDocumentDialog = new CreateDynamicDocumentDialogForApp(page);
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
}
