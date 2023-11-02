import { Locator, Page } from '@playwright/test';
import { AddLayoutItemDialog } from '../dialogs/addLayoutItemDialog';
import { AddLayoutItemMenu, LayoutItemType } from '../menus/addLayoutItemMenu';
import { AddTextFieldModal } from '../modals/addTextFieldModal';
import { AddLayoutItemModal } from './../modals/addLayoutItemModal';

export class AppLayoutTab {
  private readonly page: Page;
  readonly addFieldButton: Locator;
  readonly addLayoutItemMenu: AddLayoutItemMenu;
  readonly addLayoutItemDialog: AddLayoutItemDialog;
  readonly fieldsAndObjectsGrid: Locator;

  constructor(page: Page) {
    this.page = page;
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
      case LayoutItemType.TextField:
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

  getLayoutItemModal(itemType: LayoutItemType.TextField): AddTextFieldModal;
  getLayoutItemModal(itemType: LayoutItemType): AddLayoutItemModal;
  getLayoutItemModal(itemType: LayoutItemType) {
    switch (itemType) {
      case LayoutItemType.DateField:
      case LayoutItemType.ListField:
      case LayoutItemType.NumberField:
      case LayoutItemType.TextField:
        return new AddTextFieldModal(this.page);
      case LayoutItemType.AttachmentField:
      case LayoutItemType.ImageField:
      case LayoutItemType.ReferenceField:
      case LayoutItemType.TimeSpanField:
      case LayoutItemType.FormulaField:
      case LayoutItemType.TextBlock:
      default:
        return new AddLayoutItemModal(this.page);
    }
  }
}
