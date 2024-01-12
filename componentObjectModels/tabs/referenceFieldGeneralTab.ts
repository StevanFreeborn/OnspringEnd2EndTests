import { FrameLocator, Locator } from '@playwright/test';
import { ReferenceField } from '../../models/referenceField';
import { FieldGeneralTab } from './fieldGeneralTab';

export class ReferenceFieldGeneralTab extends FieldGeneralTab {
  readonly referenceSelect: Locator;
  readonly gridFieldsSelect: Locator;
  private readonly referenceDisplayFieldsPathRegex: RegExp;

  constructor(frame: FrameLocator) {
    super(frame);
    this.referenceSelect = this.frame.getByRole('listbox', { name: 'Reference' });
    this.gridFieldsSelect = this.frame.locator('td:has-text("Grid Fields") + td div.onx-selector');
    this.referenceDisplayFieldsPathRegex = /\/Admin\/App\/\d+\/Field\/ReferenceDisplayFields/;
  }

  async selectReference(reference: string) {
    const displayFieldResponse = this.referenceSelect.page().waitForResponse(this.referenceDisplayFieldsPathRegex);

    await this.referenceSelect.click();
    await this.frame.getByRole('option', { name: reference }).click();
    await displayFieldResponse;
  }

  async fillOutGeneralTab(referenceField: ReferenceField) {
    await this.fieldInput.fill(referenceField.name);
    await this.selectReference(referenceField.reference);
  }
}
