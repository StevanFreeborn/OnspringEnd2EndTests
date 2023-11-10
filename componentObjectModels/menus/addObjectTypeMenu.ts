import { FrameLocator, Locator } from '@playwright/test';
import { ObjectType } from './addLayoutItemMenu';

export class AddObjectTypeMenu {
  private readonly menu: Locator;

  constructor(frame: FrameLocator) {
    this.menu = frame.locator(`[data-add-menu="object"]`).first();
  }

  async selectItem(itemType: ObjectType) {
    await this.menu.getByText(itemType, { exact: true }).click();
  }
}
