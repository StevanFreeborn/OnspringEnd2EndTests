import { Locator, Page } from '@playwright/test';
import { Orientation } from '../../utils';
import { BasePrintModal } from './basePrintModal';

type PrintAction = 'Print to a printer' | 'Print to a PDF and download';
type ContentVisibility = 'Include content in collapsed tabs' | 'Exclude content in collapsed tabs';

export class PrintContentRecordModal extends BasePrintModal {
  private readonly printActionSelect: Locator;
  private readonly orientationSelect: Locator;
  private readonly contentVisibilitySelect: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page, 'Print Content Record');
    this.printActionSelect = this.modal.getByRole('listbox', { name: 'Print Action' });
    this.orientationSelect = this.modal.getByRole('listbox', { name: 'Orientation' });
    this.contentVisibilitySelect = this.modal.getByRole('listbox', { name: 'Content Visibility' });
    this.cancelButton = this.modal.getByRole('button', { name: 'Cancel' });
  }

  async selectPrintAction(action: PrintAction) {
    await this.printActionSelect.click();
    await this.printActionSelect.page().getByRole('option', { name: action }).click();
  }

  async selectOrientation(orientation: Orientation) {
    await this.orientationSelect.click();
    await this.orientationSelect.page().getByRole('option', { name: orientation }).click();
  }

  async selectContentVisibility(visibility: ContentVisibility) {
    await this.contentVisibilitySelect.click();
    await this.contentVisibilitySelect.page().getByRole('option', { name: visibility }).click();
  }
}
