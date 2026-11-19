import { Page } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { resolveTarget, Target, WebActor } from '@stevanfreeborn/screenplay-playwright';

export interface SelectReferenceGridRecordOptions {
  gridTarget: Target;
  searchTerm: string;
  controlType?: 'checkbox' | 'radio';
}

const referenceFieldGridTargets = {
  editReferenceSearchListPathRegex: /\/Content\/[0-9]+\/[0-9]+\/EditReferenceSearchList/,
  filterInput:
    (gridTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, gridTarget).getByPlaceholder('Select Related'),
  searchResultRow:
    (searchTerm: string): Target =>
    (page: Page) =>
      page.locator('.grid-search-results:visible').getByRole('row', { name: searchTerm }),
  scrollableContent: (page: Page) =>
    page.locator('.grid-search-results:visible').locator('.k-grid-content.k-auto-scrollable').first(),
  rowControl:
    (searchTerm: string, controlType: 'checkbox' | 'radio'): Target =>
    (page: Page) =>
      page.locator('.grid-search-results:visible').getByRole('row', { name: searchTerm }).getByRole(controlType),
  loadingIndicator: (page: Page) =>
    page
      .locator('.grid-search-results:visible')
      .locator('div')
      .filter({ hasText: /^Loading\.\.\.$/ }),
  selectButton: (page: Page) => page.locator('.grid-search-results:visible').getByRole('button', { name: 'Select' }),
};

export const ReferenceFieldGrid = {
  selectRecord:
    ({ gridTarget, searchTerm, controlType = 'checkbox' }: SelectReferenceGridRecordOptions): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const filterInput = referenceFieldGridTargets.filterInput(gridTarget);

      const clickResponse = actor.browse().waitForResponse(referenceFieldGridTargets.editReferenceSearchListPathRegex);
      await actor.browse().click(filterInput);
      await clickResponse;

      const searchResponse = actor.browse().waitForResponse(referenceFieldGridTargets.editReferenceSearchListPathRegex);
      await actor.browse().type(filterInput, searchTerm, { delay: 125, clear: false });
      await searchResponse;

      const searchResultRow = referenceFieldGridTargets.searchResultRow(searchTerm);
      let isVisible = await actor.browse().isVisible(searchResultRow);

      while (!isVisible) {
        await actor.browse().scrollToBottom(referenceFieldGridTargets.scrollableContent);
        await actor.browse().waitForTimeout(500);
        isVisible = await actor.browse().isVisible(searchResultRow);
      }

      const control = referenceFieldGridTargets.rowControl(searchTerm, controlType);
      await actor.browse().waitForState(referenceFieldGridTargets.loadingIndicator, 'hidden');
      await actor.browse().waitForState(control, 'visible');
      await actor.browse().click(control);
      await actor.browse().click(referenceFieldGridTargets.selectButton);
    },
};
