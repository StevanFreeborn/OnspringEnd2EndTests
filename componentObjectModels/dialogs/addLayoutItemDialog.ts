import { Locator, Page } from '@playwright/test';
import { BaseCreateOrAddDialog } from './baseCreateOrAddDialog';

export class AddLayoutItemDialog extends BaseCreateOrAddDialog {
  readonly selectFieldDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.selectFieldDropdown = this.getSelectDropdown('Add Text Field', 'Select a field');
  }

  getFieldToCopy(fieldName: string) {
    return this.getItemToCopy(fieldName);
  }
}
