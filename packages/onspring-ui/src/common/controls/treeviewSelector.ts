import { Page } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { FrameOwner, resolveFrameOwner } from './frameOwner.js';

const treeviewTargets = {
  option:
    (option: string, frameOwner?: FrameOwner): Target =>
    (page: Page) =>
      resolveFrameOwner(page, frameOwner).getByRole('treeitem', { name: option }).getByText(option),
};

export const TreeviewSelectorTasks = {
  selectOption:
    (selectorTarget: Target, option: string, frameOwner?: FrameOwner): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(selectorTarget);
      await actor.browse().click(treeviewTargets.option(option, frameOwner));
    },
};
