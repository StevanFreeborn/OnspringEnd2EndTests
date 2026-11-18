import { Locator } from '@playwright/test';

export const ReferenceFieldGridControl = {
  selectRecord: async (
    controlLocator: Locator,
    searchTerm: string,
    controlType: 'checkbox' | 'radio' = 'checkbox'
  ): Promise<void> => {
    const page = controlLocator.page();
    const filterInput = controlLocator.getByPlaceholder('Select Related');
    const searchResults = page.locator('.grid-search-results:visible');
    const editReferenceSearchListPathRegex = /\/Content\/[0-9]+\/[0-9]+\/EditReferenceSearchList/;

    const clickResponse = page.waitForResponse(editReferenceSearchListPathRegex);
    await filterInput.click();
    await clickResponse;

    const searchResponse = page.waitForResponse(editReferenceSearchListPathRegex);
    await filterInput.pressSequentially(searchTerm, { delay: 125 });
    await searchResponse;

    const searchResultRow = searchResults.getByRole('row', { name: searchTerm });
    const scrollableElement = searchResults.locator('.k-grid-content.k-auto-scrollable').first();

    let isVisible = await searchResultRow.isVisible();
    while (!isVisible) {
      await scrollableElement.evaluate(el => (el.scrollTop = el.scrollHeight));
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await page.waitForTimeout(500);
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
