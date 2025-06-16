import { Locator } from '@playwright/test';
import { GenerateDocumentOutcome } from '../../models/generateDocumentOutcome';

export class GenerateDocumentCreationSettingsTab {
  private readonly creationTypeSection: Locator;
  private readonly creationConfigurationSection: Locator;
  private readonly documentTypeSelector: Locator;
  private readonly documentSelector: Locator;
  private readonly fileTypeSelector: Locator;
  private readonly attachmentFieldSelector: Locator;

  constructor(modal: Locator) {
    this.creationTypeSection = modal.locator('.section', {
      has: modal.page().getByRole('heading', { name: 'Creation Type' }),
    });

    this.creationConfigurationSection = modal.locator('.section', {
      has: modal.page().getByRole('heading', { name: 'Creation Configuration' }),
    });

    this.documentTypeSelector = this.creationTypeSection
      .locator('.label:has-text("Document Type") + .data')
      .getByRole('listbox');

    this.documentSelector = this.creationConfigurationSection
      .locator('.label:has-text("Document") + .data')
      .getByRole('listbox');

    this.fileTypeSelector = this.creationConfigurationSection
      .locator('.label:has-text("File Type") + .data')
      .getByRole('listbox');

    this.attachmentFieldSelector = this.creationConfigurationSection
      .locator('.label:has-text("Attachment Field") + .data')
      .getByRole('listbox');
  }

  private async selectDocumentType(documentType: string) {
    await this.documentTypeSelector.click();
    await this.documentTypeSelector.page().getByRole('option', { name: documentType }).click();
  }

  private async selectDocument(document: string) {
    await this.documentSelector.click();
    await this.documentSelector.page().getByRole('option', { name: document }).click();
  }

  private async selectFileType(fileType: string) {
    await this.fileTypeSelector.click();
    await this.fileTypeSelector.page().getByRole('option', { name: fileType }).click();
  }

  private async selectAttachmentField(attachmentField: string) {
    await this.attachmentFieldSelector.click();
    await this.attachmentFieldSelector.page().getByRole('option', { name: attachmentField }).click();
  }

  async fillOutForm(outcome: GenerateDocumentOutcome) {
    await this.selectDocumentType(outcome.documentType);

    if (outcome.documentType === 'Generate Document') {
      await this.selectDocument(outcome.document);
      await this.selectFileType(outcome.fileType);
      await this.selectAttachmentField(outcome.attachmentField);
      return;
    }

    throw new Error(`Unsupported document type: ${outcome.constructor.name}`);
  }
}
