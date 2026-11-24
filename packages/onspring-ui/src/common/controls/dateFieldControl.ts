import { Page } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { resolveTarget, Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DatePickerTasks } from './datePicker.js';

const dateFieldTargets = {
  input:
    (controlTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, controlTarget).locator('input'),
  calendarButton:
    (controlTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, controlTarget).locator('.k-link-date'),
};

function formatDate(date: Date): string {
  const locale = 'en-US';
  const options = { timeZone: 'America/Chicago' };
  const dateString = date.toLocaleDateString(locale, options);
  const timeString = date.toLocaleTimeString(locale, options);
  const [time, period] = timeString.split(' ');
  const [hours, minutes] = time.split(':');
  return `${dateString} ${hours}:${minutes} ${period}`;
}

export const DateFieldControlTasks = {
  enterDate:
    (controlTarget: Target, date: Date): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const input = dateFieldTargets.input(controlTarget);
      await actor.browse().fill(input, formatDate(date));
      await actor.browse().blur(input);
    },

  clearDate:
    (controlTarget: Target): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const input = dateFieldTargets.input(controlTarget);
      await actor.browse().fill(input, '');
      await actor.browse().blur(input);
    },

  selectDateUsingCalendar:
    (controlTarget: Target, year: number, month: number, day: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(dateFieldTargets.calendarButton(controlTarget));
      await actor.attemptsTo(DatePickerTasks.selectDate(year, month, day));
    },
};
