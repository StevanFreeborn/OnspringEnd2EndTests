import { Locator, Page } from '../../fixtures';
import { ReferenceFieldGrid } from '../controls/referenceFieldGrid';

export class SelectARecordModal {
  private readonly modal: Locator;
  private readonly referenceField: ReferenceFieldGrid;
  private readonly okButton: Locator;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: 'Select a Record' });
    this.referenceField = new ReferenceFieldGrid(
      this.modal.frameLocator('iframe').locator('.onx-reference-grid'),
      this.modal.frameLocator('iframe'),
      /Content\/ReferenceGrid\/SelectorForAppSearch/,
      'Search'
    );
    this.okButton = this.modal.getByRole('button', { name: 'OK' });
  }

  async selectRecord(recordName: string) {
    await this.referenceField.searchForAndSelectRecord(recordName);
    await this.okButton.click();
  }
}
