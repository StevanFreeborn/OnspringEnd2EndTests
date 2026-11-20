import { Page } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { resolveTarget, Target, WebActor } from '@stevanfreeborn/screenplay-playwright';

const dateFieldTargets = {
  input:
    (controlTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, controlTarget).locator('input'),
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
};
