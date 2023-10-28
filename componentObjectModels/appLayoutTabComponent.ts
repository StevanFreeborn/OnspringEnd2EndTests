import { Locator, Page } from '@playwright/test';
import { AddLayoutItemDialog } from './addLayoutItemDialog';
import { AddLayoutItemMenu } from './addLayoutItemMenu';
import { AddLayoutItemModal } from './addLayoutItemModal';

export class AppLayoutTabComponent {
  private readonly page: Page;
  readonly addFieldButton: Locator;
  readonly addLayoutItemMenu: AddLayoutItemMenu;
  readonly addLayoutItemDialog: AddLayoutItemDialog;
  readonly addLayoutItemModal: AddLayoutItemModal;
  readonly fieldsAndObjectsGrid: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addFieldButton = page.getByText('Add Field');
    this.addLayoutItemMenu = new AddLayoutItemMenu(page);
    this.addLayoutItemDialog = new AddLayoutItemDialog(page);
    this.addLayoutItemModal = new AddLayoutItemModal(page);
    this.fieldsAndObjectsGrid = page.locator('#grid-layout-items').first();
  }

  async addLayoutItem(itemType: string, itemName: string) {
    await this.addFieldButton.click();
    await this.addLayoutItemMenu.selectItem(itemType);
    await this.addLayoutItemDialog.continueButton.click();
    await this.addLayoutItemModal.nameInput.fill(itemName);
    await this.addLayoutItemModal.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
