import { Page } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { resolveTarget, Target, WebActor } from '@stevanfreeborn/screenplay-playwright';

export const TimeSpanUnits = {
  Seconds: 'Second(s)',
  Minutes: 'Minute(s)',
  Hours: 'Hour(s)',
  Days: 'Day(s)',
  Weeks: 'Week(s)',
  Months: 'Month(s)',
  Years: 'Year(s)',
} as const;

export type TimeSpanUnit = keyof typeof TimeSpanUnits;

const timeSpanFieldTargets = {
  quantityInput:
    (controlTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, controlTarget).locator('input[data-field-type="number"]'),
  unitSelect:
    (controlTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, controlTarget).getByRole('listbox'),
  unitOption:
    (unitValue: string): Target =>
    (page: Page) =>
      page.getByRole('option', { name: unitValue }),
};

export const TimeSpanFieldControlTasks = {
  fill:
    (controlTarget: Target, quantity: string, unit: TimeSpanUnit): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().fill(timeSpanFieldTargets.quantityInput(controlTarget), quantity);
      await actor.browse().click(timeSpanFieldTargets.unitSelect(controlTarget));
      await actor.browse().click(timeSpanFieldTargets.unitOption(TimeSpanUnits[unit]));
    },
};
