import { Locator, Page } from '@playwright/test';
import { BaseDesignerTab } from './baseDesignerTab';
import { AddFieldTypeMenu } from '../menus/addFieldTypeMenu';

export class LayoutDesignerFieldsTab extends BaseDesignerTab {
  readonly addFieldButton: Locator;
  readonly fieldsFilterInput: Locator;
  readonly addFieldMenu: AddFieldTypeMenu;

  constructor(page: Page) {
    super(page);
    this.addFieldButton = this.getAddButton('Add Field');
    this.fieldsFilterInput = this.getFilterInput('Filter Fields');
    this.addFieldMenu = new AddFieldTypeMenu(page);
  }
}
