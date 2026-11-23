import { Page } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { FrameOwner, resolveFrameOwner } from './frameOwner.js';

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

function getMonthNumber(month: string): number {
  for (const [key, value] of monthMap) {
    if (value === month) {
      return key;
    }
  }
  throw new Error('Invalid month name.');
}

function validateDate(year: number, month: MonthName | undefined, day: number): void {
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
      if (day > 31) throw new Error('Day must be less than or equal to 31.');
      break;
    case 'April':
    case 'June':
    case 'September':
    case 'November':
      if (day > 30) throw new Error('Day must be less than or equal to 30.');
      break;
    case 'February': {
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      if (isLeapYear && day > 29) throw new Error('Day must be less than or equal to 29.');
      if (!isLeapYear && day > 28) throw new Error('Day must be less than or equal to 28.');
      break;
    }
    default:
      throw new Error('Invalid month.');
  }
}

const datePickerTargets = {
  calendarModal:
    (frameOwner?: FrameOwner): Target =>
    (page: Page) =>
      resolveFrameOwner(page, frameOwner).locator('div.k-calendar:visible').first(),
  previousMonthButton:
    (frameOwner?: FrameOwner): Target =>
    (page: Page) =>
      resolveFrameOwner(page, frameOwner)
        .locator('div.k-calendar:visible')
        .first()
        .getByRole('button', { name: 'Previous' }),
  nextMonthButton:
    (frameOwner?: FrameOwner): Target =>
    (page: Page) =>
      resolveFrameOwner(page, frameOwner)
        .locator('div.k-calendar:visible')
        .first()
        .getByRole('button', { name: 'Next' }),
  fastNavButton:
    (frameOwner?: FrameOwner): Target =>
    (page: Page) =>
      resolveFrameOwner(page, frameOwner).locator('div.k-calendar:visible').first().locator('a.k-nav-fast').first(),
  dayLink:
    (day: number, frameOwner?: FrameOwner): Target =>
    (page: Page) =>
      resolveFrameOwner(page, frameOwner)
        .locator('div.k-calendar-view:visible')
        .first()
        .locator('td:not(.k-other-month)>a.k-link')
        .filter({ hasText: new RegExp(`^${day}$`) })
        .first(),
};

async function getMonthAndYear(actor: WebActor, frameOwner?: FrameOwner): Promise<{ month: string; year: number }> {
  const monthYearString = await actor.browse().textContent(datePickerTargets.fastNavButton(frameOwner));
  if (monthYearString === null) {
    throw new Error('Could not get month and year from date picker.');
  }
  const parts = monthYearString.trim().split(' ');
  return { month: parts[0], year: parseInt(parts[1], 10) };
}

export const DatePickerTasks = {
  selectDate:
    (year: number, month: number, day: number, frameOwner?: FrameOwner): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const monthName = monthMap.get(month);
      validateDate(year, monthName, day);

      let { month: currentMonth, year: currentYear } = await getMonthAndYear(actor, frameOwner);
      const targetValue = year * 12 + month;
      let currentValue = currentYear * 12 + getMonthNumber(currentMonth);

      while (currentValue !== targetValue) {
        if (currentValue > targetValue) {
          await actor.browse().click(datePickerTargets.previousMonthButton(frameOwner));
        } else {
          await actor.browse().click(datePickerTargets.nextMonthButton(frameOwner));
        }
        const updated = await getMonthAndYear(actor, frameOwner);
        currentMonth = updated.month;
        currentYear = updated.year;
        currentValue = currentYear * 12 + getMonthNumber(currentMonth);
      }

      await actor.browse().click(datePickerTargets.dayLink(day, frameOwner));
    },
};
