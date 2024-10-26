import { FrameLocator, Locator } from '@playwright/test';
import { DateField } from '../../models/dateField';
import { FieldGeneralTab } from './fieldGeneralTab';

export class DateFieldGeneralTab extends FieldGeneralTab {
  private displaySelector: Locator;

  constructor(frame: FrameLocator) {
    super(frame);
    this.displaySelector = this.frame.locator('.label:has-text("Display") + .data').getByRole('listbox');
  }

  private async selectDisplay(display: string) {
    await this.displaySelector.click();
    await this.frame.getByRole('option', { name: display, exact: true }).click();
  }

  async fillOutGeneralTab(dateField: DateField) {
    await this.fieldInput.fill(dateField.name);
    await this.selectDisplay(dateField.display);
  }
}
