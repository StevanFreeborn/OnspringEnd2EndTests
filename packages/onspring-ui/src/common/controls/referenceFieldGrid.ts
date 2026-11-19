import { Task } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';

export interface SelectReferenceGridRecordOptions {
  gridTarget: Target;
  searchTerm: string;
  controlType?: 'checkbox' | 'radio';
}

export const ReferenceFieldGrid = {
  selectRecord:
    ({ gridTarget, searchTerm, controlType = 'checkbox' }: SelectReferenceGridRecordOptions): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const editReferenceSearchListPathRegex = /\/Content\/[0-9]+\/[0-9]+\/EditReferenceSearchList/;
      const gridLocator = actor.browse().locator(gridTarget);
      const filterInput = gridLocator.getByPlaceholder('Select Related');

      const clickResponse = actor.browse().waitForResponse(editReferenceSearchListPathRegex);
      await filterInput.click();
      await clickResponse;

      const searchResponse = actor.browse().waitForResponse(editReferenceSearchListPathRegex);
      await filterInput.pressSequentially(searchTerm, { delay: 125 });
      await searchResponse;

      const searchResults = actor.browse().locator(page => page.locator('.grid-search-results:visible'));
      const searchResultRow = searchResults.getByRole('row', { name: searchTerm });
      const scrollableElement = searchResults.locator('.k-grid-content.k-auto-scrollable').first();

      let isVisible = await searchResultRow.isVisible();
      while (!isVisible) {
        await scrollableElement.evaluate(el => (el.scrollTop = el.scrollHeight));
        await actor.browse().waitForTimeout(500);
        isVisible = await searchResultRow.isVisible();
      }

      const control = searchResultRow.getByRole(controlType);
      const loadingIndicator = searchResults.locator('div').filter({ hasText: /^Loading\.\.\.$/ });
      await loadingIndicator.waitFor({ state: 'hidden' });
      await control.waitFor({ state: 'visible' });
      await control.click();

      await searchResults.getByRole('button', { name: 'Select' }).click();
    },
};
