import { Locator } from '@playwright/test';

export class MappingGrid {
  private readonly sourceFields: Locator;
  private readonly mappings: Locator;

  constructor(container: Locator) {
    this.sourceFields = container.locator('.drag-items-container');
    this.mappings = container.locator('.mappable-items');
  }

  async performMapping(mappings: Record<string, string>[]) {
    throw new Error(`Method not implemented: ${mappings}`);
  }
}
