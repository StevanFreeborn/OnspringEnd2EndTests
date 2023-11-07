import { Locator } from '@playwright/test';

export class TimeSpanFieldControl {
  readonly control: Locator;
  readonly quantityInput: Locator;
  readonly unitSelect: Locator;

  constructor(control: Locator) {
    this.control = control;
    this.quantityInput = control.locator('input[data-field-type="number"]');
    this.unitSelect = control.getByRole('listbox');
  }
}
