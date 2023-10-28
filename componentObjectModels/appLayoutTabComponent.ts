import { Locator, Page } from '@playwright/test';
import { AddFieldDialog } from './addFieldDialog';
import { AddFieldModal } from './addFieldModal';
import { AddLayoutItemMenu } from './addLayoutItemMenu';

export class AppLayoutTabComponent {
  readonly addFieldButton: Locator;
  readonly addLayoutItemMenu: AddLayoutItemMenu;
  readonly addFieldDialog: AddFieldDialog;
  readonly addFieldModal: AddFieldModal;
  readonly fieldsAndObjectsGrid: Locator;

  constructor(page: Page) {
    this.addFieldButton = page.getByText('Add Field');
    this.addLayoutItemMenu = new AddLayoutItemMenu(page);
    this.addFieldDialog = new AddFieldDialog(page);
    this.addFieldModal = new AddFieldModal(page);
    this.fieldsAndObjectsGrid = page.locator('#grid-layout-items').first();
  }
}
