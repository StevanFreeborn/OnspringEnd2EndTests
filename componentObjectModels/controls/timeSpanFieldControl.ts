import { Locator } from '@playwright/test';

export enum Units {
  Seconds = 'Second(s)',
  Minutes = 'Minute(s)',
  Hours = 'Hour(s)',
  Days = 'Day(s)',
  Weeks = 'Week(s)',
  Months = 'Month(s)',
  Years = 'Year(s)',
}

export type Unit = keyof typeof Units;

export class TimeSpanFieldControl {
  readonly control: Locator;
  readonly quantityInput: Locator;
  readonly unitSelect: Locator;

  constructor(control: Locator) {
    this.control = control;
    this.quantityInput = control.locator('input[data-field-type="number"]');
    this.unitSelect = control.getByRole('listbox');
  }

  async selectUnit(unit: Unit) {
    const unitValue = Units[unit];
    await this.unitSelect.click();
    await this.control.page().getByRole('option', { name: unitValue }).click();
  }
}
