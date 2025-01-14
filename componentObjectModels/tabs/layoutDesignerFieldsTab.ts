import { FrameLocator, Locator } from '@playwright/test';
import { AddFieldTypeMenu } from '../menus/addFieldTypeMenu';
import { BaseDesignerTab } from './baseDesignerTab';

export class LayoutDesignerFieldsTab extends BaseDesignerTab {
  readonly addFieldButton: Locator;
  readonly fieldsFilterInput: Locator;
  readonly addFieldMenu: AddFieldTypeMenu;

  constructor(frame: FrameLocator) {
    super(frame);
    this.addFieldButton = this.getAddButton('Add Field');
    this.fieldsFilterInput = this.getFilterInput('Filter Fields');
    this.addFieldMenu = new AddFieldTypeMenu(frame);
  }

  getFieldFromBank(fieldName: string) {
    return this.getItemFromBank('field', fieldName);
  }
}
