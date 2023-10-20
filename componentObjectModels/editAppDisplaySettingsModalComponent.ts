import { Locator, Page } from '@playwright/test';

export class EditAppDisplaySettingsModalComponent {
  private readonly page: Page;
  readonly displayLinkSelect: Locator;
  readonly integrationLinkSelect: Locator;
  readonly displayFieldsSelect: Locator;
  readonly primarySortSelect: Locator;
  readonly primarySortDirectionSelect: Locator;
  readonly secondarySortSelect: Locator;
  readonly secondarySortDirectionSelect: Locator;
  readonly saveButton: Locator;

  getDisplayFieldOption(field: string) {
    return this.page.locator(
      `.selector-control .unselected-pane li:has-text("${field}")`
    );
  }

  constructor(page: Page) {
    this.page = page;
    this.displayLinkSelect = page.getByRole('listbox', {
      name: 'Display Link Field',
    });
    this.integrationLinkSelect = page.getByRole('listbox', {
      name: 'Integration Link Field',
    });
    this.displayFieldsSelect = page.locator('.selector-select-list');
    this.primarySortSelect = page
      .locator('td.label:has-text("Primary Sort") + td>div')
      .first();
    this.primarySortDirectionSelect = page
      .locator('td.label:has-text("Primary Sort") + td>div>span:nth-child(2)')
      .first();
    this.secondarySortSelect = page
      .locator('td.label:has-text("Secondary Sort") + td>div')
      .first();
    this.secondarySortDirectionSelect = page
      .locator('td.label:has-text("Secondary Sort") + td>div>span:nth-child(2)')
      .first();
    this.saveButton = page.getByRole('button', {
      name: 'Save',
    });
  }

  async selectDisplayLinkField(field: string) {
    await this.displayFieldsSelect.click();
    await this.getDisplayFieldOption(field).click();
    await this.displayFieldsSelect.click();
  }

  async selectPrimarySortField(field: string) {
    await this.primarySortSelect.click();
    await this.page.getByRole('option', { name: field }).click();
  }
}
