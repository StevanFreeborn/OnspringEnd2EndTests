import { FrameLocator, Locator } from '@playwright/test';
import { AddFieldTypeMenu } from '../menus/addFieldTypeMenu';
import { BaseDesignerTab } from './baseDesignerTab';

export class LayoutDesignerFieldsTab extends BaseDesignerTab {
  readonly addFieldButton: Locator;
  readonly fieldsFilterInput: Locator;
  readonly addFieldMenu: AddFieldTypeMenu;
  readonly fieldsBank: Locator;

  constructor(frame: FrameLocator) {
    super(frame);
    this.addFieldButton = this.getAddButton('Add Field');
    this.fieldsFilterInput = this.getFilterInput('Filter Fields');
    this.addFieldMenu = new AddFieldTypeMenu(frame);
    this.fieldsBank = frame.locator('[data-tab-content="field"]');
  }

  getFieldFromBank(fieldName: string) {
    return this.fieldsBank.locator('div.layoutItem').filter({ hasText: fieldName }).first();
  }
}
