import { FrameLocator } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';

export const DualPaneSelector = {
  selectOption:
    (containerTarget: Target, option: string, frame?: FrameLocator): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const container = actor.browse().locator(containerTarget);
      const selectedList = container.locator('.selector-select-list, .selector-selected-list');
      const isAlreadySelected = (await selectedList.innerText()).includes(option);
      if (!isAlreadySelected) {
        await container.click();
        const popup = frame
          ? frame.locator('.selector-control:visible')
          : actor.browse().locator(page => page.locator('.selector-control:visible'));
        await popup.locator('.unselected-pane').getByText(option, { exact: true }).click();
        await popup.getByTitle('Close').click();
      }
    },

  unselectOption:
    (containerTarget: Target, option: string, frame?: FrameLocator): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const container = actor.browse().locator(containerTarget);
      const selectedList = container.locator('.selector-selected-list');
      const isSelected = (await selectedList.innerText()).includes(option);
      if (isSelected) {
        await container.click();
        const popup = frame
          ? frame.locator('.selector-control:visible')
          : actor.browse().locator(page => page.locator('.selector-control:visible'));
        await popup.locator('.selected-pane').getByText(option, { exact: true }).click();
        await popup.getByTitle('Close').click();
      }
    },
};
