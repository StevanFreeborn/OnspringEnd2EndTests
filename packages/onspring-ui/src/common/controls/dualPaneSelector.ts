import { FrameLocator, Page } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { resolveTarget, Target, WebActor } from '@stevanfreeborn/screenplay-playwright';

const dualPaneTargets = {
  selectList:
    (containerTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, containerTarget).locator('.selector-select-list, .selector-selected-list'),
  selectedList:
    (containerTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, containerTarget).locator('.selector-selected-list'),
  popup: (frame?: FrameLocator): Target =>
    frame ? frame.locator('.selector-control:visible') : (page: Page) => page.locator('.selector-control:visible'),
  unselectedOption:
    (option: string, frame?: FrameLocator): Target =>
    (page: Page) =>
      resolveTarget(page, dualPaneTargets.popup(frame)).locator('.unselected-pane').getByText(option, { exact: true }),
  selectedOption:
    (option: string, frame?: FrameLocator): Target =>
    (page: Page) =>
      resolveTarget(page, dualPaneTargets.popup(frame)).locator('.selected-pane').getByText(option, { exact: true }),
  closeButton:
    (frame?: FrameLocator): Target =>
    (page: Page) =>
      resolveTarget(page, dualPaneTargets.popup(frame)).getByTitle('Close'),
};

export const DualPaneSelector = {
  selectOption:
    (containerTarget: Target, option: string, frame?: FrameLocator): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const selectedText = await actor.browse().getText(dualPaneTargets.selectList(containerTarget));

      if (!selectedText.includes(option)) {
        await actor.browse().click(containerTarget);
        await actor.browse().click(dualPaneTargets.unselectedOption(option, frame));
        await actor.browse().click(dualPaneTargets.closeButton(frame));
      }
    },

  unselectOption:
    (containerTarget: Target, option: string, frame?: FrameLocator): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const selectedText = await actor.browse().getText(dualPaneTargets.selectedList(containerTarget));

      if (selectedText.includes(option)) {
        await actor.browse().click(containerTarget);
        await actor.browse().click(dualPaneTargets.selectedOption(option, frame));
        await actor.browse().click(dualPaneTargets.closeButton(frame));
      }
    },
};
