import { FrameLocator, Locator, Page } from '@playwright/test';

type MonthName =
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

const monthMap = new Map<number, MonthName>([
  [1, 'January'],
  [2, 'February'],
  [3, 'March'],
  [4, 'April'],
  [5, 'May'],
  [6, 'June'],
  [7, 'July'],
  [8, 'August'],
  [9, 'September'],
  [10, 'October'],
  [11, 'November'],
  [12, 'December'],
]);

export class DatePicker {
  private readonly context: Page | FrameLocator;
  private readonly calendarModal: Locator;
  private readonly previousMonthButton: Locator;
  private readonly fastNavButton: Locator;
  private readonly nextMonthButton: Locator;
  private readonly datesTable: Locator;

  constructor(context: Page | FrameLocator) {
    this.context = context;
    this.calendarModal = this.context.locator('div.k-calendar:visible').first();
    this.previousMonthButton = this.calendarModal.getByRole('button', { name: 'Previous' });
    this.nextMonthButton = this.calendarModal.getByRole('button', { name: 'Next' });
    this.fastNavButton = this.calendarModal.locator('a.k-nav-fast').first();
    this.datesTable = this.context.locator('div.k-calendar-view:visible').first();
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

  private validateDate(year: number, month: MonthName | undefined, day: number) {
    if (year < 1800 || year > 2099) {
      throw new Error('Year must be between 1800 and 2099.');
    }

    if (day < 1) {
      throw new Error('Day must be greater than 0.');
    }

    switch (month) {
      case 'January':
      case 'March':
      case 'May':
      case 'July':
      case 'August':
      case 'October':
      case 'December':
        if (day > 31) {
          throw new Error('Day must be less than or equal to 31.');
        }
        break;
      case 'April':
      case 'June':
      case 'September':
      case 'November':
        if (day > 30) {
          throw new Error('Day must be less than or equal to 30.');
        }
        break;
      case 'February': {
        // Check for leap year
        // leap year if evenly divisible by 4 and not evenly divisible by 100
        // leap year if evenly divisible by 400
        const isLeapYear = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
        if (isLeapYear && day > 29) {
          throw new Error('Day must be less than or equal to 29.');
        }

        if (isLeapYear === false && day > 28) {
          throw new Error('Day must be less than or equal to 28.');
        }
        break;
      }
      default:
        throw new Error('Invalid month.');
    }
  }

  private async selectDay(day: number) {
    return await this.datesTable
      .locator('td:not(.k-other-month)>a.k-link')
      .filter({ hasText: day.toString() })
      .first()
      .click();
  }

  private getMonthNumber(month: string) {
    for (const [key, value] of monthMap) {
      if (value === month) {
        return key;
      }
    }

    throw new Error('Invalid month name.');
  }

  async selectDate(year: number, month: number, day: number) {
    const monthName = monthMap.get(month);
    this.validateDate(year, monthName, day);

    let currentYear = await this.getYear();
    let currentMonth = await this.getMonth();

    const targetValue = year * 12 + month;
    let currentValue = currentYear * 12 + this.getMonthNumber(currentMonth);

    while (currentValue !== targetValue) {
      if (currentValue > targetValue) {
        await this.previousMonthButton.click();
      } else {
        await this.nextMonthButton.click();
      }

      currentYear = await this.getYear();
      currentMonth = await this.getMonth();
      currentValue = currentYear * 12 + this.getMonthNumber(currentMonth);
    }

    await this.selectDay(day);
  }
}
