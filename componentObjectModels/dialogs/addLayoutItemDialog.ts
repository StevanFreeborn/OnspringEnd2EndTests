import { Locator, Page } from '@playwright/test';
import { BaseCreateOrAddDialog } from './baseCreateOrAddDialog';

export class AddLayoutItemDialog extends BaseCreateOrAddDialog {
  readonly selectDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.selectDropdown = page.getByRole('listbox').first();
  }

  getLayoutItemToCopy(itemName: string) {
    return this.getItemToCopy(itemName);
  }
}
