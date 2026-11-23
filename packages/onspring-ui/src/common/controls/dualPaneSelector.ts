import { Page } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { resolveTarget, Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { FrameOwner, resolveFrameOwner } from './frameOwner.js';

const dualPaneTargets = {
  selectList:
    (containerTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, containerTarget).locator('.selector-select-list, .selector-selected-list'),
  selectedList:
    (containerTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, containerTarget).locator('.selector-selected-list'),
  popup:
    (frameOwner?: FrameOwner): Target =>
    (page: Page) =>
      resolveFrameOwner(page, frameOwner).locator('.selector-control:visible'),
  unselectedOption:
    (option: string, frameOwner?: FrameOwner): Target =>
    (page: Page) =>
      resolveTarget(page, dualPaneTargets.popup(frameOwner))
        .locator('.unselected-pane')
        .getByText(option, { exact: true }),
  selectedOption:
    (option: string, frameOwner?: FrameOwner): Target =>
    (page: Page) =>
      resolveTarget(page, dualPaneTargets.popup(frameOwner))
        .locator('.selected-pane')
        .getByText(option, { exact: true }),
  closeButton:
    (frameOwner?: FrameOwner): Target =>
    (page: Page) =>
      resolveTarget(page, dualPaneTargets.popup(frameOwner)).getByTitle('Close'),
};

export const DualPaneSelector = {
  selectOption:
    (containerTarget: Target, option: string, frameOwner?: FrameOwner): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const selectedText = await actor.browse().getText(dualPaneTargets.selectList(containerTarget));

      if (!selectedText.includes(option)) {
        await actor.browse().click(containerTarget);
        await actor.browse().click(dualPaneTargets.unselectedOption(option, frameOwner));
        await actor.browse().click(dualPaneTargets.closeButton(frameOwner));
      }
    },

  selectOptions:
    (containerTarget: Target, options: string[], frameOwner?: FrameOwner): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      for (const option of options) {
        await actor.attemptsTo(DualPaneSelector.selectOption(containerTarget, option, frameOwner));
      }
    },

  unselectOption:
    (containerTarget: Target, option: string, frameOwner?: FrameOwner): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const selectedText = await actor.browse().getText(dualPaneTargets.selectedList(containerTarget));

      if (selectedText.includes(option)) {
        await actor.browse().click(containerTarget);
        await actor.browse().click(dualPaneTargets.selectedOption(option, frameOwner));
        await actor.browse().click(dualPaneTargets.closeButton(frameOwner));
      }
    },
};
