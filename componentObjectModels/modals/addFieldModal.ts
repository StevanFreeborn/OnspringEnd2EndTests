import { Locator, Page } from '@playwright/test';
import { AddLayoutItemModal } from './addLayoutItemModal';

export class AddFieldModal extends AddLayoutItemModal {
  readonly fieldInput: Locator;

  constructor(page: Page) {
    super(page);
    this.fieldInput = page
      .getByLabel(/Add\s+\w+\s+Field/)
      .frameLocator('iframe')
      .getByLabel('Field', { exact: true });
  }
}
