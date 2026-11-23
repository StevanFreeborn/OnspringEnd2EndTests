import { Page } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { FrameOwner, resolveFrameOwner } from './frameOwner.js';

const activePopupSelector = '.tabbed-color-popup:visible:not([aria-hidden="true"])';

const tabbedColorPickerTargets = {
  popup:
    (frameOwner?: FrameOwner): Target =>
    (page: Page) =>
      resolveFrameOwner(page, frameOwner).locator(activePopupSelector),
  customTab:
    (frameOwner?: FrameOwner): Target =>
    (page: Page) =>
      resolveFrameOwner(page, frameOwner).locator(activePopupSelector).getByRole('tab', { name: 'Custom' }),
  colorInput:
    (frameOwner?: FrameOwner): Target =>
    (page: Page) =>
      resolveFrameOwner(page, frameOwner).locator(activePopupSelector).locator('.k-color-value'),
  closeButton:
    (frameOwner?: FrameOwner): Target =>
    (page: Page) =>
      resolveFrameOwner(page, frameOwner).locator(activePopupSelector).locator('.popup-close'),
};

export const TabbedColorPickerTasks = {
  selectColor:
    (controlTarget: Target, color: string, frameOwner?: FrameOwner): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const popup = tabbedColorPickerTargets.popup(frameOwner);
      await actor.browse().click(controlTarget);
      await actor.browse().waitForState(popup, 'visible');
      await actor.browse().waitForTimeout(1000);
      await actor.browse().click(tabbedColorPickerTargets.customTab(frameOwner));
      await actor.browse().type(tabbedColorPickerTargets.colorInput(frameOwner), color, {
        delay: 150,
        clear: true,
      });
      await actor.browse().click(tabbedColorPickerTargets.closeButton(frameOwner));
      await actor.browse().waitForState(popup, 'hidden');
    },
};
