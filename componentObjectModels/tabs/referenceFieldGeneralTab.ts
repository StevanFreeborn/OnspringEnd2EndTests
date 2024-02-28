import { FrameLocator, Locator } from '@playwright/test';
import { ReferenceField } from '../../models/referenceField';
import { FieldGeneralTab } from './fieldGeneralTab';

export class ReferenceFieldGeneralTab extends FieldGeneralTab {
  readonly referenceSelect: Locator;
  readonly gridFieldsSelect: Locator;
  readonly selectedGridFields: Locator;
  private readonly referenceDisplayFieldsPathRegex: RegExp;

  constructor(frame: FrameLocator) {
    super(frame);
    this.referenceSelect = this.frame.getByRole('listbox', { name: 'Reference' });
    this.gridFieldsSelect = this.frame.locator('td:has-text("Grid Fields") + td div.onx-selector');
    this.selectedGridFields = this.gridFieldsSelect.locator('.selector-select-list li');
    this.referenceDisplayFieldsPathRegex = /\/Admin\/App\/\d+\/Field\/ReferenceDisplayFields/;
  }

  async selectReference(reference: string) {
    // This is convoluted because every time the
    // the reference is changed, the display fields are fetched
    // however the first time the reference is clicked it
    // automatically selects the first option and fetches the display fields
    // its possible then that the reference we want to select
    // is already selected and we don't need to wait for the display fields
    // a second time hence the early return.
    const initialDisplayFieldResponse = this.referenceSelect
      .page()
      .waitForResponse(this.referenceDisplayFieldsPathRegex);
    await this.referenceSelect.click();
    await initialDisplayFieldResponse;

    const referenceSelectText = await this.referenceSelect.innerText();

    if (referenceSelectText.includes(reference)) {
      return await this.frame.getByRole('option', { name: reference }).click();
    }
    const displayFieldResponse = this.referenceSelect.page().waitForResponse(this.referenceDisplayFieldsPathRegex);
    await this.frame.getByRole('option', { name: reference }).click();
    await displayFieldResponse;
  }

  async fillOutGeneralTab(referenceField: ReferenceField) {
    await this.fieldInput.fill(referenceField.name);
    await this.selectReference(referenceField.reference);
    await this.selectedGridFields.waitFor();
  }
}
