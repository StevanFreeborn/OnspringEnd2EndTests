import { Page } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { resolveTarget, Retry, Target, WebActor } from '@stevanfreeborn/screenplay-playwright';

export type SelectReferenceGridRecordOptions = {
  gridTarget: Target;
  searchTerm: string;
  controlType?: 'checkbox' | 'radio';
  searchResultsContainer?: Target;
  searchPathRegex?: RegExp;
  filterPlaceholder?: string;
};

const defaultSearchPathRegex = /\/Content\/[0-9]+\/[0-9]+\/EditReferenceSearchList/;
const defaultSearchResultsContainer: Target = (page: Page) => page.locator('.grid-search-results:visible');

const referenceFieldGridTargets = {
  filterInput:
    (gridTarget: Target, filterPlaceholder: string): Target =>
    (page: Page) =>
      resolveTarget(page, gridTarget).getByPlaceholder(filterPlaceholder),
  searchResultRow:
    (searchResultsContainer: Target, searchTerm: string): Target =>
    (page: Page) =>
      resolveTarget(page, searchResultsContainer).getByRole('row', { name: searchTerm }),
  scrollableContent:
    (searchResultsContainer: Target): Target =>
    (page: Page) =>
      resolveTarget(page, searchResultsContainer).locator('.k-grid-content.k-auto-scrollable').first(),
  rowControl:
    (searchResultsContainer: Target, searchTerm: string, controlType: 'checkbox' | 'radio'): Target =>
    (page: Page) =>
      resolveTarget(page, searchResultsContainer).getByRole('row', { name: searchTerm }).getByRole(controlType),
  loadingIndicator:
    (searchResultsContainer: Target): Target =>
    (page: Page) =>
      resolveTarget(page, searchResultsContainer)
        .locator('div')
        .filter({ hasText: /^Loading\.\.\.$/ }),
  selectButton:
    (searchResultsContainer: Target): Target =>
    (page: Page) =>
      resolveTarget(page, searchResultsContainer).getByRole('button', { name: 'Select' }),
};

export const ReferenceFieldGrid = {
  selectRecord:
    ({
      gridTarget,
      searchTerm,
      controlType = 'checkbox',
      searchResultsContainer = defaultSearchResultsContainer,
      searchPathRegex = defaultSearchPathRegex,
      filterPlaceholder = 'Select Related',
    }: SelectReferenceGridRecordOptions): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const filterInput = referenceFieldGridTargets.filterInput(gridTarget, filterPlaceholder);
      const scrollableContent = referenceFieldGridTargets.scrollableContent(searchResultsContainer);

      await actor.attemptsTo(
        Retry.until(
          async a => {
            if (await a.browse().isVisible(searchResultsContainer)) {
              return;
            }

            const clickResponse = a
              .browse()
              .waitForResponse(searchPathRegex, { timeout: 3000 })
              .catch(() => null);
            await a.browse().click(filterInput);
            const response = await clickResponse;

            if (!response && !(await a.browse().isVisible(searchResultsContainer))) {
              await a.browse().blur(filterInput);
              throw new Error('Reference field grid search popup did not open yet.');
            }
          },
          { intervals: [500, 1000], timeout: 30_000 }
        )
      );
      await actor.browse().waitForTimeout(1000);

      const searchResponse = actor.browse().waitForResponse(searchPathRegex);
      await actor.browse().type(filterInput, searchTerm, { delay: 125, clear: false });
      await searchResponse;

      const searchResultRow = referenceFieldGridTargets.searchResultRow(searchResultsContainer, searchTerm);
      let isVisible = await actor.browse().isVisible(searchResultRow);

      while (!isVisible) {
        if (!(await actor.browse().canScrollDown(scrollableContent))) {
          break;
        }
        await actor.browse().scrollToBottom(scrollableContent);
        await actor.browse().waitForTimeout(500);
        isVisible = await actor.browse().isVisible(searchResultRow);
      }

      const control = referenceFieldGridTargets.rowControl(searchResultsContainer, searchTerm, controlType);
      await actor.browse().waitForState(referenceFieldGridTargets.loadingIndicator(searchResultsContainer), 'hidden');
      await actor.browse().waitForState(control, 'visible');
      await actor.browse().click(control);
      await actor.browse().click(referenceFieldGridTargets.selectButton(searchResultsContainer));
    },
};
