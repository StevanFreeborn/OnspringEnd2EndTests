import { Locator, Page } from '@playwright/test';
import { AddLayoutItemDialog } from '../dialogs/addLayoutItemDialog';
import { AddLayoutItemMenu, LayoutItemType } from '../menus/addLayoutItemMenu';
import { LayoutDesignerModal } from '../modals/LayoutDesignerModal';
import { AddTextFieldModal } from '../modals/addTextFieldModal';
import { AddLayoutItemModal } from './../modals/addLayoutItemModal';

export class AppLayoutTab {
  private readonly page: Page;
  readonly layoutsGrid: Locator;
  readonly layoutDesignerModal: LayoutDesignerModal;
  readonly addFieldButton: Locator;
  readonly addLayoutItemMenu: AddLayoutItemMenu;
  readonly addLayoutItemDialog: AddLayoutItemDialog;
  readonly fieldsAndObjectsGrid: Locator;

  constructor(page: Page) {
    this.page = page;
    this.layoutsGrid = page.locator('#grid-layouts').first();
    this.layoutDesignerModal = new LayoutDesignerModal(page);
    this.addFieldButton = page.getByText('Add Field');
    this.addLayoutItemMenu = new AddLayoutItemMenu(page);
    this.addLayoutItemDialog = new AddLayoutItemDialog(page);
    this.fieldsAndObjectsGrid = page.locator('#grid-layout-items').first();
  }

  async addLayoutItem(itemType: LayoutItemType, itemName: string) {
    await this.addFieldButton.click();
    await this.addLayoutItemMenu.selectItem(itemType);
    await this.addLayoutItemDialog.continueButton.click();

    switch (itemType) {
      case 'Text':
        {
          const modal = this.getLayoutItemModal(itemType);
          await modal.fieldInput.fill(itemName);
        }
        break;
      default:
        break;
    }

    await this.getLayoutItemModal(itemType).saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  getLayoutItemModal(itemType: 'Text'): AddTextFieldModal;
  getLayoutItemModal(itemType: LayoutItemType): AddLayoutItemModal;
  getLayoutItemModal(itemType: LayoutItemType) {
    switch (itemType) {
      case 'Date/Time':
      case 'List':
      case 'Number':
      case 'Text':
        return new AddTextFieldModal(this.page);
      case 'Attachment':
      case 'Image':
      case 'Reference':
      case 'Time Span':
      case 'Formula':
      case 'Formatted Text Block':
      default:
        return new AddLayoutItemModal(this.page);
    }
  }
}
