import { FrameLocator, Locator } from '@playwright/test';
import { AddObjectTypeMenu } from './../menus/addObjectTypeMenu';
import { BaseDesignerTab } from './baseDesignerTab';

export class LayoutDesignerObjectsTab extends BaseDesignerTab {
  readonly addObjectButton: Locator;
  readonly objectsFilterInput: Locator;
  readonly addObjectMenu: AddObjectTypeMenu;
  readonly objectsBank: Locator;

  constructor(frame: FrameLocator) {
    super(frame);
    this.addObjectButton = this.getAddButton('Add Object');
    this.objectsFilterInput = this.getFilterInput('Filter Objects');
    this.objectsBank = frame.locator('[data-tab-content="object"]');
    this.addObjectMenu = new AddObjectTypeMenu(frame);
  }

  getObjectFromBank(objectName: string) {
    return this.objectsBank.locator('div.layoutItem').filter({ hasText: objectName }).first();
  }
}
