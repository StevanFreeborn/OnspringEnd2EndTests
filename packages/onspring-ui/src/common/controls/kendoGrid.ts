import { Page, Response } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { resolveTarget, Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DeleteDialogTargets } from '../dialogs/dialogs.targets.js';

export type ScrollKendoGridOptions = {
  grid: Target;
  getListPagePath: string;
};

export type DeleteAllMatchingGridRowsOptions = {
  grid: Target;
  rowName: string | RegExp;
  deleteButtonTitle: string;
  deleteResponseMatcher: (url: string) => boolean;
  pick?: 'first' | 'last';
  getListPagePath?: string;
  confirmText?: string;
  confirmDialog?: {
    input?: Target;
    deleteButton: Target;
    dialog: Target;
    overlay?: Target;
  };
  afterDeleteWaitMs?: number;
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
  matchingRow:
    (grid: Target, rowName: string | RegExp, pick: 'first' | 'last'): Target =>
    (page: Page) => {
      const rows = resolveTarget(page, grid).getByRole('row', { name: rowName });
      return pick === 'first' ? rows.first() : rows.last();
    },
  deleteButtonInMatchingRow:
    (matchingRow: Target, deleteButtonTitle: string): Target =>
    (page: Page) =>
      resolveTarget(page, matchingRow).getByTitle(deleteButtonTitle),
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

  deleteAllMatchingRows:
    ({
      grid,
      rowName,
      deleteButtonTitle,
      deleteResponseMatcher,
      pick = 'last',
      getListPagePath,
      confirmText,
      confirmDialog = {
        deleteButton: DeleteDialogTargets.deleteButton,
        dialog: DeleteDialogTargets.dialog,
        overlay: DeleteDialogTargets.overlay,
      },
      afterDeleteWaitMs,
    }: DeleteAllMatchingGridRowsOptions): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      if (getListPagePath) {
        await actor.attemptsTo(KendoGridTasks.scrollAllIntoView({ grid, getListPagePath }));
      }

      const matchingRow = kendoGridTargets.matchingRow(grid, rowName, pick);
      const deleteButton = kendoGridTargets.deleteButtonInMatchingRow(matchingRow, deleteButtonTitle);

      while (await actor.browse().isVisible(matchingRow)) {
        await actor.browse().hover(matchingRow);
        await actor.browse().click(deleteButton);

        if (confirmText && confirmDialog.input) {
          await actor.browse().type(confirmDialog.input, confirmText);
        }

        await actor.browse().check(confirmDialog.deleteButton).isVisible();

        const deleteResponse = actor
          .browse()
          .waitForResponse((r: Response) => deleteResponseMatcher(r.url()) && r.status() === 200);
        await actor.browse().click(confirmDialog.deleteButton);
        await deleteResponse;

        const detachTargets = confirmDialog.overlay
          ? [confirmDialog.dialog, confirmDialog.overlay]
          : [confirmDialog.dialog];
        await actor.browse().waitForDetached(...detachTargets);

        if (afterDeleteWaitMs) {
          await actor.browse().waitForTimeout(afterDeleteWaitMs);
        }
      }
    },
};
