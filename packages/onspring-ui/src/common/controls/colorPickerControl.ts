import { Page } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { FrameOwner, resolveFrameOwner } from './frameOwner.js';

const colorPickerTargets = {
  colorInput:
    (frameOwner?: FrameOwner): Target =>
    (page: Page) =>
      resolveFrameOwner(page, frameOwner).locator('div:visible[data-role="colorpicker"]').getByPlaceholder('no color'),
};

export const ColorPickerControlTasks = {
  pickColor:
    (pickerTarget: Target, color: string, frameOwner?: FrameOwner): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(pickerTarget);
      await actor.browse().waitForTimeout(1000);
      await actor.browse().type(colorPickerTargets.colorInput(frameOwner), color, { delay: 150 });
      await actor.browse().click(pickerTarget);
    },
};
