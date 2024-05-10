import { Locator, Page } from '@playwright/test';
import { PrintContentRecordOutcome } from '../../models/printContentRecordOutcome';
import { EditOutcomeModal } from './editOutcomeModal';

export class EditPrintContentRecordOutcomeModal extends EditOutcomeModal {
  private readonly layoutSelector: Locator;
  private readonly orientationSelector: Locator;
  private readonly contentVisibilitySelector: Locator;
  private readonly attachmentFieldSelector: Locator;

  constructor(page: Page) {
    super(page);
    this.layoutSelector = this.modal.locator('.label:has-text("Layout") + .data').getByRole('listbox');
    this.orientationSelector = this.modal.locator('.label:has-text("Orientation") + .data').getByRole('listbox');
    this.contentVisibilitySelector = this.modal
      .locator('.label:has-text("Content Visibility") + .data')
      .getByRole('listbox');
    this.attachmentFieldSelector = this.modal
      .locator('.label:has-text("Attachment Field") + .data')
      .getByRole('listbox');
  }

  async fillOutForm(outcome: PrintContentRecordOutcome) {
    await super.fillOutForm(outcome);

    const page = this.modal.page();

    await this.layoutSelector.click();
    await page.getByRole('option', { name: outcome.layout }).click();

    await this.orientationSelector.click();
    await page.getByRole('option', { name: outcome.orientation }).click();

    await this.contentVisibilitySelector.click();
    await page.getByRole('option', { name: outcome.contentVisibility }).click();

    await this.attachmentFieldSelector.click();
    await page.getByRole('option', { name: outcome.attachmentField }).click();
  }
}
