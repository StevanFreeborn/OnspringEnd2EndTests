import { Locator, Page } from '@playwright/test';
import { BASE_URL } from '../../playwright.config';

export class ReferenceFieldGrid {
  private readonly page: Page;
  private readonly pathRegex: RegExp;
  readonly control: Locator;
  readonly filterInput: Locator;
  readonly searchResults: Locator;
  readonly createNewButton: Locator;
  readonly quickAddButton: Locator;
  readonly gridTable: Locator;

  constructor(control: Locator) {
    this.page = control.page();
    this.pathRegex = new RegExp(`${BASE_URL}/Content/[0-9]+/[0-9]+/EditReferenceSearchList`);
    this.control = control;
    this.filterInput = this.control.getByPlaceholder('Select Related');
    this.searchResults = this.page.locator('div.grid-search-results:visible');
    this.createNewButton = this.control.getByTitle('Create New');
    this.quickAddButton = this.control.getByRole('button', { name: 'Quick Add' });
    this.gridTable = this.control.getByRole('grid');
  }

  async openCreateNewRecordModal() {
    await this.createNewButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async isGridEmpty() {
    const rowCount = await this.gridTable.locator('tbody > tr').count();
    return rowCount === 0;
  }

  /**
   * Searches for a record in the reference field grid and selects it. This method
   * will scroll the search results until the record is visible and then select it.
   * @param searchTerm The search term to use to search for the record.
   * @returns A promise that resolves when the record is selected.
   */
  async searchForAndSelectRecord(searchTerm: string) {
    const searchResultRow = this.searchResults.getByRole('row', { name: searchTerm });
    const scrollableElement = this.searchResults.locator('.k-grid-content.k-auto-scrollable').first();

    // Reference field grid search requests are debounced, so we need to simulate typing
    // in the filter input with a delay between each character to ensure that the search
    // request is sent.
    await this.filterInput.pressSequentially(searchTerm, { delay: 125 });
    await this.page.waitForResponse(this.pathRegex);

    let isVisible = await searchResultRow.isVisible();

    // If the search result row is not visible, then it is not in the current view of the
    // search results. We need to scroll the search results until the row is visible.
    while (isVisible === false) {
      await scrollableElement.evaluate(el => (el.scrollTop = el.scrollHeight));
      isVisible = await searchResultRow.isVisible();
    }

    await searchResultRow.getByRole('checkbox').click();
    await this.searchResults.getByRole('button', { name: 'Select' }).click();
  }
}
