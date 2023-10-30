import { Locator, Page } from '@playwright/test';

export class ReferenceFieldGrid {
  private readonly page: Page;
  private readonly control: Locator;
  readonly filterInput: Locator;
  readonly searchResults: Locator;
  readonly createNewButton: Locator;
  readonly quickAddButton: Locator;
  readonly gridTable: Locator;

  constructor(page: Page, controlLocator: string) {
    this.page = page;
    this.control = page.locator(controlLocator);
    this.filterInput = this.control.getByPlaceholder('Select Related');
    this.searchResults = page.locator('div.grid-search-results:visible');
    this.createNewButton = this.control.getByRole('button', { name: 'Create New' });
    this.quickAddButton = this.control.getByRole('button', { name: 'Quick Add' });
    this.gridTable = this.control.getByRole('grid');
  }

  async isGridEmpty() {
    const rowCount = await this.gridTable.locator('tbody > tr').count();
    return rowCount === 0;
  }

  async selectSearchResult(searchResult: string) {
    const searchResultRow = this.searchResults.getByRole('row', { name: searchResult });
    const scrollableElement = this.searchResults.locator('.k-grid-content.k-auto-scrollable').first();

    await this.filterInput.fill(searchResult);

    const initialScrollTop = await scrollableElement.evaluate(el => el.scrollTop);
    let newScrollTop = 0;

    while ((await searchResultRow.isVisible()) === false || initialScrollTop !== newScrollTop) {
      await scrollableElement.evaluate(el => (el.scrollTop = el.scrollHeight));
      await this.page.waitForLoadState('networkidle');
      newScrollTop = await scrollableElement.evaluate(el => el.scrollTop);
    }

    await searchResultRow.getByRole('checkbox').click();
    await this.searchResults.getByRole('button', { name: 'Select' }).click();
  }
}
