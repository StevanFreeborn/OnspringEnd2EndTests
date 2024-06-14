import { Locator } from '@playwright/test';

export class MappingGrid {
  private readonly sourceFields: Locator;
  private readonly mappings: Locator;

  constructor(container: Locator) {
    this.sourceFields = container.locator('.drag-items-container');
    this.mappings = container.locator('.mappable-items');
  }

  async performMapping(mappings: Record<string, string>[]) {
    // for each mapping we need to check some things
    // 1. check if key is mapped
    //    1. if it is mapped
    //       1. Check if mapped to corresponding value
    //          1. if it is do nothing
    //          2. if it isn't move field to correct value
    //    2. if it is not mapped
    //       1. map it

    throw new Error(`Method not implemented: ${mappings}`);
  }
}
