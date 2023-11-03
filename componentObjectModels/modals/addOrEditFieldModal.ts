import { Locator, Page } from '@playwright/test';
import { AddOrEditLayoutItemModal } from './addOrEditLayoutItemModal';

export class AddOrEditFieldModal extends AddOrEditLayoutItemModal {
  readonly fieldInput: Locator;

  constructor(page: Page) {
    super(page);
    this.fieldInput = page.getByRole('dialog').frameLocator('iframe').getByLabel('Field', { exact: true });
  }
}
