import { FrameLocator, Locator } from '@playwright/test';
import { AddObjectTypeMenu } from './../menus/addObjectTypeMenu';
import { BaseDesignerTab } from './baseDesignerTab';

export class LayoutDesignerObjectsTab extends BaseDesignerTab {
  readonly addObjectButton: Locator;
  readonly objectsFilterInput: Locator;
  readonly addObjectMenu: AddObjectTypeMenu;

  constructor(frame: FrameLocator) {
    super(frame);
    this.addObjectButton = this.getAddButton('Add Object');
    this.objectsFilterInput = this.getFilterInput('Filter Objects');
    this.addObjectMenu = new AddObjectTypeMenu(frame);
  }

  getObjectFromBank(objectName: string) {
    return this.getItemFromBank('object', objectName);
  }
}
