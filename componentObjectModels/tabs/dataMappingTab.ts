import { Locator, Page } from '@playwright/test';

export class DataMappingTab {
  readonly mappings: Locator;

  constructor(page: Page) {
    this.mappings = page.locator('.mappable-items');
  }

  getFieldMapping(field: string) {
    const page = this.mappings.page();

    const row = this.mappings.getByRole('row').filter({ has: page.locator(`.field-cell:has-text("${field}")`) });

    const appField = row.locator('.field-cell');
    const mappedField = row.locator('.map-item-container');

    return {
      appField,
      mappedField,
    };
  }
}
