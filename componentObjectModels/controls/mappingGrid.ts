import { Locator } from '@playwright/test';

export class MappingGrid {
  private readonly container: Locator;
  private readonly sourceFields: Locator;
  private readonly mappings: Locator;

  constructor(container: Locator) {
    this.container = container;
    this.sourceFields = container.locator('.drag-items-container');
    this.mappings = container.locator('.mappable-items');
  }

  async performMapping(mappings: Record<string, string>[]) {
    const page = this.container.page();

    for (const mapping of mappings) {
      for (const [key, value] of Object.entries(mapping)) {
        if (!value) {
          continue;
        }

        const targetRow = this.mappings.locator('tr', {
          has: page.locator(`.field-cell:has-text("${value}")`),
        });

        const targetRowMappedItem = targetRow.locator('.map-item-container');
        const mappedItemText = await targetRowMappedItem.textContent();
        const isMappedCorrectly = mappedItemText === key;

        if (isMappedCorrectly) {
          continue;
        }

        const sourceField = this.sourceFields.locator(`.draggable:has-text("${key}")`);
        const targetField = targetRow.locator('.drag-and-drop-cell');

        await targetField.scrollIntoViewIfNeeded();
        await sourceField.dragTo(targetField);
      }
    }
  }
}
