import { Locator, Page } from '@playwright/test';
import { BaseDesignerTab } from './baseDesignerTab';

export class LayoutDesignerObjectsTab extends BaseDesignerTab {
  readonly addObjectButton: Locator;
  readonly objectsFilterInput: Locator;

  constructor(page: Page) {
    super(page);
    this.addObjectButton = this.getAddButton('Add Object');
    this.objectsFilterInput = this.getFilterInput('Filter Objects');
  }
}
