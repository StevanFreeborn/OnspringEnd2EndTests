import { Page, Response } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { resolveTarget, Target, WebActor } from '@stevanfreeborn/screenplay-playwright';

export type ScrollKendoGridOptions = {
  grid: Target;
  getListPagePath: string;
};

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
      resolveTarget(page, grid).locator('.k-grid-content.k-auto-scrollable').first().getByRole('row'),
  firstRow:
    (grid: Target): Target =>
    (page: Page) =>
      resolveTarget(page, grid).locator('.k-grid-content.k-auto-scrollable').first().getByRole('row').first(),
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
      const totalNumOfItems = parseInt(pagerInfoText.split(' ')[0].replace(/,/g, ''), 10);

      if (Number.isNaN(totalNumOfItems) || totalNumOfItems === 0) {
        return;
      }

      await actor.browse().isVisibleWithin(kendoGridTargets.firstRow(grid), 5000);

      const rows = kendoGridTargets.rows(grid);
      const scrollableContent = kendoGridTargets.scrollableContent(grid);
      let itemRowsCount = await actor.browse().count(rows);

      while (itemRowsCount < totalNumOfItems) {
        if (!(await actor.browse().canScrollDown(scrollableContent))) {
          break;
        }

        const scrollResponse = actor
          .browse()
          .waitForResponse((r: Response) => r.url().includes(getListPagePath) && r.status() === 200, { timeout: 5000 })
          .catch(() => null);
        await actor.browse().scrollToBottom(scrollableContent);
        const response = await scrollResponse;

        if (!response) {
          break;
        }

        itemRowsCount = await actor.browse().count(rows);
      }
    },
};
