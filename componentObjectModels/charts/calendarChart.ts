import { Locator } from '@playwright/test';
import { DatePicker } from '../controls/datePicker';

export class CalendarChart {
  private readonly container: Locator;
  private readonly shortDate: Locator;
  private readonly datePickerButton: Locator;
  private readonly datePicker: DatePicker;

  constructor(container: Locator) {
    this.container = container;
    this.shortDate = this.container.locator('.k-sm-date-format');
    this.datePickerButton = this.container.locator('a.k-nav-current');
    this.datePicker = new DatePicker(this.container.page());
  }

  async selectDate(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const shortDateString = `${month}/${day}/${year}`;
    const currentShortDate = await this.shortDate.textContent();

    if (currentShortDate === shortDateString) {
      return;
    }

    await this.datePickerButton.click();
    await this.datePicker.selectDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }
}
