import { Locator, Page } from '@playwright/test';
import { AddLayoutItemModal } from './addLayoutItemModal';

export class AddFieldModal extends AddLayoutItemModal {
  readonly fieldInput: Locator;

  constructor(page: Page) {
    super(page);
    this.fieldInput = page.frameLocator('iframe').getByLabel('Field', { exact: true });
  }
}
