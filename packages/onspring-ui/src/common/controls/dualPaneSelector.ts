import { Page } from '@playwright/test';
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
  popup:
    (frameSelector?: string): Target =>
    (page: Page) =>
      frameSelector
        ? page.frameLocator(frameSelector).locator('.selector-control:visible')
        : page.locator('.selector-control:visible'),
  unselectedOption:
    (option: string, frameSelector?: string): Target =>
    (page: Page) =>
      resolveTarget(page, dualPaneTargets.popup(frameSelector))
        .locator('.unselected-pane')
        .getByText(option, { exact: true }),
  selectedOption:
    (option: string, frameSelector?: string): Target =>
    (page: Page) =>
      resolveTarget(page, dualPaneTargets.popup(frameSelector))
        .locator('.selected-pane')
        .getByText(option, { exact: true }),
  closeButton:
    (frameSelector?: string): Target =>
    (page: Page) =>
      resolveTarget(page, dualPaneTargets.popup(frameSelector)).getByTitle('Close'),
};

export const DualPaneSelector = {
  selectOption:
    (containerTarget: Target, option: string, frameSelector?: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const selectedText = await actor.browse().getText(dualPaneTargets.selectList(containerTarget));

      if (!selectedText.includes(option)) {
        await actor.browse().click(containerTarget);
        await actor.browse().click(dualPaneTargets.unselectedOption(option, frameSelector));
        await actor.browse().click(dualPaneTargets.closeButton(frameSelector));
      }
    },

  selectOptions:
    (containerTarget: Target, options: string[], frameSelector?: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      for (const option of options) {
        await actor.attemptsTo(DualPaneSelector.selectOption(containerTarget, option, frameSelector));
      }
    },

  unselectOption:
    (containerTarget: Target, option: string, frameSelector?: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const selectedText = await actor.browse().getText(dualPaneTargets.selectedList(containerTarget));

      if (selectedText.includes(option)) {
        await actor.browse().click(containerTarget);
        await actor.browse().click(dualPaneTargets.selectedOption(option, frameSelector));
        await actor.browse().click(dualPaneTargets.closeButton(frameSelector));
      }
    },
};
