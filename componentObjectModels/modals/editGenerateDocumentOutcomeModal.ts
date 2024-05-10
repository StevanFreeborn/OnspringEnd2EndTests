import { Locator, Page } from '@playwright/test';
import { GenerateDocumentOutcome } from '../../models/generateDocumentOutcome';
import { EditOutcomeModal } from './editOutcomeModal';

export class EditGenerateDocumentOutcomeModal extends EditOutcomeModal {
  private readonly documentSelector: Locator;
  private readonly fileTypeSelector: Locator;
  private readonly attachmentFieldSelector: Locator;

  constructor(page: Page) {
    super(page);
    this.documentSelector = this.modal.locator('.label:has-text("Document") + .data').getByRole('listbox');
    this.fileTypeSelector = this.modal.locator('.label:has-text("File Type") + .data').getByRole('listbox');
    this.attachmentFieldSelector = this.modal
      .locator('.label:has-text("Attachment Field") + .data')
      .getByRole('listbox');
  }

  async fillOutForm(outcome: GenerateDocumentOutcome) {
    await super.fillOutForm(outcome);

    const page = this.modal.page();

    await this.documentSelector.click();
    await page.getByRole('option', { name: outcome.document }).click();

    await this.fileTypeSelector.click();
    await page.getByRole('option', { name: outcome.fileType }).click();

    await this.attachmentFieldSelector.click();
    await page.getByRole('option', { name: outcome.attachmentField }).click();
  }
}
