import { Locator, Page } from '@playwright/test';
import { DynamicDocument } from '../../models/dynamicDocument';

export class DocumentOutputTab {
  private readonly page: Page;
  private readonly emailSelector: Locator;
  private readonly fileTypeSelector: Locator;
  private readonly saveToFieldSelector: Locator;
  private readonly attachmentFieldSelector: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailSelector = page.locator('.label:has-text("Email") + .data').getByRole('listbox');
    this.fileTypeSelector = page.locator('.label:has-text("File Type") + .data').getByRole('listbox');
    this.saveToFieldSelector = page.locator('.label:has-text("Save To Field") + .data').getByRole('listbox');
    this.attachmentFieldSelector = page.locator('.label:has-text("Attachment Field") + .data').getByRole('listbox');
  }

  async fillOutTab(document: DynamicDocument) {
    await this.emailSelector.click();
    await this.page.getByRole('option', { name: document.emailAccess }).click();

    await this.fileTypeSelector.click();
    await this.page.getByRole('option', { name: document.fileType }).click();

    await this.saveToFieldSelector.click();
    await this.page.getByRole('option', { name: document.saveToFieldAccess, exact: true }).click();

    if (document.saveToFieldAccess == 'Allowed') {
      await this.attachmentFieldSelector.click();
      await this.page.getByRole('option', { name: document.attachmentField }).click();
    }
  }
}
