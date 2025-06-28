import { Locator, Page } from '@playwright/test';
import { DatePicker } from './datePicker';

type TimeOption =
  | '12:00 AM'
  | '12:30 AM'
  | '01:00 AM'
  | '01:30 AM'
  | '02:00 AM'
  | '02:30 AM'
  | '03:00 AM'
  | '03:30 AM'
  | '04:00 AM'
  | '04:30 AM'
  | '05:00 AM'
  | '05:30 AM'
  | '06:00 AM'
  | '06:30 AM'
  | '07:00 AM'
  | '07:30 AM'
  | '08:00 AM'
  | '08:30 AM'
  | '09:00 AM'
  | '09:30 AM'
  | '10:00 AM'
  | '10:30 AM'
  | '11:00 AM'
  | '11:30 AM'
  | '12:00 PM'
  | '12:30 PM'
  | '01:00 PM'
  | '01:30 PM'
  | '02:00 PM'
  | '02:30 PM'
  | '03:00 PM'
  | '03:30 PM'
  | '04:00 PM'
  | '04:30 PM'
  | '05:00 PM'
  | '05:30 PM'
  | '06:00 PM'
  | '06:30 PM'
  | '07:00 PM'
  | '07:30 PM'
  | '08:00 PM'
  | '08:30 PM'
  | '09:00 PM'
  | '09:30 PM'
  | '10:00 PM'
  | '10:30 PM'
  | '11:00 PM'
  | '11:30 PM';

export class DateFieldControl {
  private readonly page: Page;
  private readonly timeSelect: Locator;
  private readonly datePicker: DatePicker;
  readonly control: Locator;
  readonly input: Locator;
  readonly calendarButton: Locator;
  readonly clockButton: Locator;

  constructor(control: Locator) {
    this.control = control;
    this.page = this.control.page();
    this.timeSelect = this.page.locator('div.timepicker-list-container:visible').first();
    this.datePicker = new DatePicker(this.page);
    this.input = this.control.locator('input');
    this.calendarButton = this.control.locator('.k-link-date');
    this.clockButton = this.control.locator('.k-link-time');
  }

  private async selectTime(time: TimeOption) {
    return await this.timeSelect.getByRole('option', { name: time }).click();
  }

  private async selectTimeUsingClock(time: TimeOption) {
    await this.clockButton.click();
    await this.selectTime(time);
  }

  async selectDateUsingCalendar(year: number, month: number, day: number) {
    await this.calendarButton.click();
    await this.datePicker.selectDate(year, month, day);
  }

  async selectDateAndTimeUsingCalendar(year: number, month: number, day: number, time: TimeOption) {
    await this.selectDateUsingCalendar(year, month, day);
    await this.selectTimeUsingClock(time);
  }

  private formatDate(date: Date) {
    const locale = 'en-US';
    const options = { timeZone: 'America/Chicago' };
    const dateString = date.toLocaleDateString(locale, options);
    const timeString = date.toLocaleTimeString(locale, options);
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':');
    return `${dateString} ${hours}:${minutes} ${period}`;
  }

  async enterDate(date: Date) {
    const formattedDate = this.formatDate(date);
    await this.input.fill(formattedDate);
    await this.input.blur();
  }

  async clearDate() {
    await this.input.fill('');
    await this.input.blur();
  }
}
