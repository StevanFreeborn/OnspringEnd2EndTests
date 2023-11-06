import { Locator, Page } from '@playwright/test';

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

type MonthOption =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

export class DateFieldControl {
  private readonly page: Page;
  private readonly calendarModal: Locator;
  private readonly previousMonthButton: Locator;
  private readonly fastNavButton: Locator;
  private readonly nextMonthButton: Locator;
  private readonly datesTable: Locator;
  private readonly timeSelect: Locator;
  readonly input: Locator;
  readonly calendarButton: Locator;
  readonly clockButton: Locator;

  constructor(dateTimePicker: Locator, page: Page) {
    this.page = page;
    this.calendarModal = page.locator('div.k-calendar:visible').first();
    this.previousMonthButton = this.calendarModal.getByRole('button', { name: 'Previous' });
    this.nextMonthButton = this.calendarModal.getByRole('button', { name: 'Next' });
    this.fastNavButton = this.calendarModal.locator('a.k-nav-fast').first();
    this.datesTable = page.locator('div.k-calendar-view:visible').first();
    this.timeSelect = page.locator('div.timepicker-list-container:visible').first();
    this.input = dateTimePicker.locator('input');
    this.calendarButton = dateTimePicker.locator('.k-link-date');
    this.clockButton = dateTimePicker.locator('.k-link-time');
  }

  private async getMonth() {
    const monthYearString = await this.fastNavButton.textContent();

    if (monthYearString === null) {
      throw new Error('Could not get month from date field control.');
    }

    return monthYearString.split(' ')[0];
  }

  private async getYear() {
    const monthYearString = await this.fastNavButton.textContent();

    if (monthYearString === null) {
      throw new Error('Could not get year from date field control.');
    }

    return parseInt(monthYearString.split(' ')[1]);
  }

  private async selectDay(day: number) {
    return await this.datesTable
      .locator('td:not(.k-other-month)>a.k-link')
      .filter({ hasText: day.toString() })
      .first()
      .click();
  }

  private async selectTime(time: TimeOption) {
    return await this.timeSelect.getByRole('option', { name: time }).click();
  }

  private async selectTimeUsingClock(time: TimeOption) {
    await this.clockButton.click();
    await this.selectTime(time);
  }

  async selectDateUsingCalendar(year: number, month: MonthOption, day: number) {
    await this.calendarButton.click();

    let currentYear = await this.getYear();
    let currentMonth = await this.getMonth();

    while (currentMonth !== month || currentYear !== year) {
      if (currentYear > year) {
        await this.previousMonthButton.click();
      } else {
        await this.nextMonthButton.click();
      }

      currentYear = await this.getYear();
      currentMonth = await this.getMonth();
    }

    await this.selectDay(day);
  }

  async selectDateAndTimeUsingCalendar(year: number, month: MonthOption, day: number, time: TimeOption) {
    await this.selectDateUsingCalendar(year, month, day);
    await this.selectTimeUsingClock(time);
  }
}
