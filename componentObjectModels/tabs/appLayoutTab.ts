import { Locator, Page } from '@playwright/test';
import { LayoutItem } from '../../models/layoutItem';
import { LayoutItemCreator } from '../creators/layoutItemCreator';
import { AddLayoutItemDialog } from '../dialogs/addLayoutItemDialog';
import { DeleteLayoutItemDialog } from '../dialogs/deleteLayoutItemDialog';
import { FieldType } from '../menus/addFieldTypeMenu';
import { AddLayoutItemMenu } from '../menus/addLayoutItemMenu';
import { LayoutDesignerModal } from '../modals/layoutDesignerModal';

export class AppLayoutTab extends LayoutItemCreator {
  readonly layoutsGrid: Locator;
  readonly layoutDesignerModal: LayoutDesignerModal;
  readonly addFieldButton: Locator;
  readonly addLayoutItemMenu: AddLayoutItemMenu;
  readonly addLayoutItemDialog: AddLayoutItemDialog;
  readonly deleteLayoutItemDialog: DeleteLayoutItemDialog;
  readonly fieldsAndObjectsGrid: Locator;

  constructor(page: Page) {
    super(page);
    this.layoutsGrid = page.locator('#grid-layouts').first();
    this.layoutDesignerModal = new LayoutDesignerModal(page);
    this.addFieldButton = page.getByText('Add Field');
    this.addLayoutItemMenu = new AddLayoutItemMenu(page);
    this.addLayoutItemDialog = new AddLayoutItemDialog(page);
    this.deleteLayoutItemDialog = new DeleteLayoutItemDialog(page);
    this.fieldsAndObjectsGrid = page.locator('#grid-layout-items').first();
  }

  /**
   * Opens the specified layout.
   * @param layoutName - The name of the layout to open. Defaults to 'Default Layout'.
   * @returns A promise that resolves when the layout is opened.
   */
  async openLayout(layoutName: string = 'Default Layout') {
    await this.layoutsGrid.getByRole('row', { name: layoutName }).click();
  }

  async addLayoutItemFromFieldsAndObjectsGrid(item: LayoutItem) {
    await this.addFieldButton.click();
    await this.addLayoutItemMenu.selectItem(item.type);
    await this.addLayoutItemDialog.continueButton.click();

    switch (item.type) {
      case 'Text':
        {
          const modal = this.getLayoutItemModal(item.type);
          await modal.generalTab.fieldInput.fill(item.name);
        }
        break;
      case 'Number':
        {
          const modal = this.getLayoutItemModal(item.type);
          await modal.generalTab.fieldInput.fill(item.name);
        }
        break;
      default:
        break;
    }

    const modal = this.getLayoutItemModal(item.type, 0);
    await modal.securityTabButton.click();
    await modal.securityTab.setPermissions(item.permissions);

    await modal.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  private async openAddFieldModal(itemType: FieldType) {
    const fieldTab = this.layoutDesignerModal.layoutItemsSection.fieldsTab;

    await fieldTab.addFieldButton.click();
    await fieldTab.addFieldMenu.selectItem(itemType);
    await this.addLayoutItemDialog.continueButton.click();
  }

  async addLayoutItemFromLayoutDesigner(item: LayoutItem) {
    const fieldTab = this.layoutDesignerModal.layoutItemsSection.fieldsTab;

    switch (item.type) {
      case 'Formatted Text Block':
        break;
      case 'Number': {
        if ((await fieldTab.addFieldButton.isVisible()) === false) {
          await this.layoutDesignerModal.layoutItemsSection.fieldsTabButton.click();
        }
        await this.openAddFieldModal(item.type);
        const addFieldModal = this.layoutDesignerModal.getLayoutItemModal(item.type, 1);
        await addFieldModal.generalTab.fillOutGeneralTab(item);
        await addFieldModal.saveButton.click();
        break;
      }
      case 'Text': {
        if ((await fieldTab.addFieldButton.isVisible()) === false) {
          await this.layoutDesignerModal.layoutItemsSection.fieldsTabButton.click();
        }
        await this.openAddFieldModal(item.type);
        const addFieldModal = this.layoutDesignerModal.getLayoutItemModal(item.type, 1);
        await addFieldModal.generalTab.fillOutGeneralTab(item);
        await addFieldModal.saveButton.click();
        break;
      }
      default:
        break;
    }
  }
}
