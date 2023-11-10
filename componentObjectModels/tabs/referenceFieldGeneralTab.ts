import { FrameLocator, Locator } from '@playwright/test';
import { ReferenceField } from '../../models/referenceField';
import { FieldGeneralTab } from './fieldGeneralTab';

export class ReferenceFieldGeneralTab extends FieldGeneralTab {
  readonly referenceSelect: Locator;

  constructor(frame: FrameLocator) {
    super(frame);
    this.referenceSelect = this.frame.getByRole('listbox', { name: 'Reference' });
  }

  async selectReference(reference: string) {
    await this.referenceSelect.click();
    await this.frame.getByRole('option', { name: reference }).click();
  }

  async fillOutGeneralTab(referenceField: ReferenceField) {
    await this.fieldInput.fill(referenceField.name);
    await this.selectReference(referenceField.reference);
  }
}
