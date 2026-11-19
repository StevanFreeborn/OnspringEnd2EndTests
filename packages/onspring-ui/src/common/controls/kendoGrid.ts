import { Page, Response } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { resolveTarget, Target, WebActor } from '@stevanfreeborn/screenplay-playwright';

export interface ScrollKendoGridOptions {
  grid: Target;
  getListPagePath: string;
}

const kendoGridTargets = {
  pagerInfo:
    (grid: Target): Target =>
    (page: Page) =>
      resolveTarget(page, grid).locator('.k-pager-info').first(),
  scrollableContent:
    (grid: Target): Target =>
    (page: Page) =>
      resolveTarget(page, grid).locator('.k-grid-content.k-auto-scrollable').first(),
  rows:
    (grid: Target): Target =>
    (page: Page) =>
      resolveTarget(page, grid).getByRole('row'),
};

export const KendoGridTasks = {
  scrollAllIntoView:
    ({ grid, getListPagePath }: ScrollKendoGridOptions): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const pagerInfo = kendoGridTargets.pagerInfo(grid);
      const isPagerVisible = await actor.browse().isVisible(pagerInfo);

      if (!isPagerVisible) {
        return;
      }

      const pagerInfoText = await actor.browse().getText(pagerInfo);
      const totalNumOfItems = parseInt(pagerInfoText.split(' ')[0], 10);

      if (Number.isNaN(totalNumOfItems)) {
        return;
      }

      const rows = kendoGridTargets.rows(grid);
      const scrollableContent = kendoGridTargets.scrollableContent(grid);
      let itemRowsCount = await actor.browse().count(rows);

      while (itemRowsCount < totalNumOfItems) {
        const scrollResponse = actor
          .browse()
          .waitForResponse((r: Response) => r.url().includes(getListPagePath) && r.status() === 200);
        await actor.browse().scrollToBottom(scrollableContent);
        await scrollResponse;
        itemRowsCount = await actor.browse().count(rows);
      }
    },
};
