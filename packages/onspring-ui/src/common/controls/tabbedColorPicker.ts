import { Page } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';

const colorPopupOwner = (page: Page, frameSelector?: string) =>
  frameSelector ? page.frameLocator(frameSelector) : page;

const tabbedColorPickerTargets = {
  popup:
    (frameSelector?: string): Target =>
    (page: Page) =>
      colorPopupOwner(page, frameSelector).locator('.tabbed-color-popup:visible'),
  customTab:
    (frameSelector?: string): Target =>
    (page: Page) =>
      colorPopupOwner(page, frameSelector).locator('.tabbed-color-popup:visible').getByRole('tab', { name: 'Custom' }),
  colorInput:
    (frameSelector?: string): Target =>
    (page: Page) =>
      colorPopupOwner(page, frameSelector).locator('.tabbed-color-popup:visible').locator('.k-color-value'),
  closeButton:
    (frameSelector?: string): Target =>
    (page: Page) =>
      colorPopupOwner(page, frameSelector).locator('.tabbed-color-popup:visible').locator('.popup-close'),
};

export const TabbedColorPickerTasks = {
  selectColor:
    (controlTarget: Target, color: string, frameSelector?: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const popup = tabbedColorPickerTargets.popup(frameSelector);
      await actor.browse().click(controlTarget);
      await actor.browse().waitForState(popup, 'visible');
      await actor.browse().waitForTimeout(1000);
      await actor.browse().click(tabbedColorPickerTargets.customTab(frameSelector));
      await actor.browse().type(tabbedColorPickerTargets.colorInput(frameSelector), color, {
        delay: 150,
        clear: true,
      });
      await actor.browse().click(tabbedColorPickerTargets.closeButton(frameSelector));
    },
};
