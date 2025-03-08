import { Locator, Page } from '@playwright/test';

export class ReferenceFieldGrid {
  private readonly page: Page;
  private readonly popupPathRegex: RegExp;
  private readonly editReferenceSearchListPathRegex: RegExp;
  readonly control: Locator;
  readonly filterInput: Locator;
  readonly searchResults: Locator;
  readonly createNewButton: Locator;
  readonly quickAddButton: Locator;
  readonly gridTable: Locator;

  constructor(control: Locator) {
    this.page = control.page();
    this.popupPathRegex = /\/Content\/\d+\/PopupAdd/;
    this.editReferenceSearchListPathRegex = /\/Content\/[0-9]+\/[0-9]+\/EditReferenceSearchList/;
    this.control = control;
    this.filterInput = this.control.getByPlaceholder('Select Related');
    this.searchResults = this.page.locator('div.grid-search-results:visible');
    this.createNewButton = this.control.getByTitle('Create New');
    this.quickAddButton = this.control.getByRole('button', { name: 'Quick Add' });
    this.gridTable = this.control.getByRole('grid');
  }

  async openCreateNewRecordModal() {
    const popupResponse = this.page.waitForResponse(this.popupPathRegex);
    await this.createNewButton.click();
    await popupResponse;
  }

  async isGridEmpty() {
    const rowCount = await this.gridTable.locator('tbody > tr').count();
    return rowCount === 0;
  }

  private async selectRecord(searchTerm: string, control: 'checkbox' | 'radio') {
    const searchResultRow = this.searchResults.getByRole('row', { name: searchTerm });
    const scrollableElement = this.searchResults.locator('.k-grid-content.k-auto-scrollable').first();

    const clickResponse = this.page.waitForResponse(this.editReferenceSearchListPathRegex);
    await this.filterInput.click();
    await clickResponse;
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(2000);

    // Reference field grid search requests are debounced, so we need to simulate typing
    // in the filter input with a delay between each character to ensure that the search
    // request is sent.
    const searchResponse = this.page.waitForResponse(this.editReferenceSearchListPathRegex);
    await this.filterInput.pressSequentially(searchTerm, { delay: 125 });
    await searchResponse;

    let isVisible = await searchResultRow.isVisible();

    // If the search result row is not visible, then it is not in the current view of the
    // search results. We need to scroll the search results until the row is visible.
    while (isVisible === false) {
      await scrollableElement.evaluate(el => (el.scrollTop = el.scrollHeight));
      isVisible = await searchResultRow.isVisible();
    }
    
    const controlLocator = searchResultRow.getByRole(control);
    const loadingIndicator = this.searchResults.locator('div').filter({ hasText: /^Loading\.\.\.$/ });
    
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(2000);
    await loadingIndicator.waitFor({ state: 'hidden' });
    await controlLocator.waitFor();
    await controlLocator.click();
    await this.searchResults.getByRole('button', { name: 'Select' }).click();
  }

  /**
   * Searches for a record in a multi select reference field grid and selects it based on each
   * search term given. This method will scroll the search results until the record
   * is visible and then select it. Repeat this process for each search term given.
   * @param searchTerms The search terms to use to search for the records.
   * @returns A promise that resolves when the records are selected.
   */
  async searchForAndSelectRecords(searchTerms: string[]) {
    for (const searchTerm of searchTerms) {
      await this.selectRecord(searchTerm, 'checkbox');
    }
  }

  /**
   * Searches for a record in a single select reference field grid and selects it based on the
   * search term given. This method will scroll the search results until the record
   * is visible and then select it.
   * @param searchTerm The search term to use to search for the record.
   * @returns A promise that resolves when the record is selected.
   */
  async searchForAndSelectRecord(searchTerm: string) {
    await this.selectRecord(searchTerm, 'radio');
  }
}
