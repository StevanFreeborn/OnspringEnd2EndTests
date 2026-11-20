import { Page } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';

const colorPickerTargets = {
  colorInput:
    (frameSelector?: string): Target =>
    (page: Page) =>
      (frameSelector ? page.frameLocator(frameSelector) : page)
        .locator('div:visible[data-role="colorpicker"]')
        .getByPlaceholder('no color'),
};

export const ColorPickerControlTasks = {
  pickColor:
    (pickerTarget: Target, color: string, frameSelector?: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(pickerTarget);
      await actor.browse().waitForTimeout(1000);
      await actor.browse().type(colorPickerTargets.colorInput(frameSelector), color, { delay: 150 });
      await actor.browse().click(pickerTarget);
    },
};
