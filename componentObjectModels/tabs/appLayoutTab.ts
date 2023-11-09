import { Locator, Page } from '@playwright/test';
import { FormulaField } from '../../models/formulaField';
import { LayoutItem } from '../../models/layoutItem';
import { ListField } from '../../models/listField';
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

  private async addLayoutItem(item: LayoutItem, frameNumber: number = 0) {
    switch (item.type) {
      case 'Formatted Text Block':
        break;
      case 'Image': {
        const addFieldModal = this.getLayoutItemModal(item.type, frameNumber);
        await addFieldModal.generalTab.fillOutGeneralTab(item);
        break;
      }
      case 'Formula': {
        const addFieldModal = this.getLayoutItemModal(item.type, frameNumber);
        await addFieldModal.generalTab.fillOutGeneralTab(item as FormulaField);
        break;
      }
      case 'Time Span': {
        const addFieldModal = this.getLayoutItemModal(item.type, frameNumber);
        await addFieldModal.generalTab.fillOutGeneralTab(item);
        break;
      }
      case 'List': {
        const addFieldModal = this.getLayoutItemModal(item.type, frameNumber);
        await addFieldModal.generalTab.fillOutGeneralTab(item as ListField);
        break;
      }
      case 'Date/Time': {
        const addFieldModal = this.getLayoutItemModal(item.type, frameNumber);
        await addFieldModal.generalTab.fillOutGeneralTab(item);
        break;
      }
      case 'Number': {
        const addFieldModal = this.getLayoutItemModal(item.type, frameNumber);
        await addFieldModal.generalTab.fillOutGeneralTab(item);
        break;
      }
      case 'Text': {
        const addFieldModal = this.getLayoutItemModal(item.type, frameNumber);
        await addFieldModal.generalTab.fillOutGeneralTab(item);
        break;
      }
      default:
        break;
    }

    const modal = this.getLayoutItemModal(item.type, frameNumber);
    await modal.securityTabButton.click();
    await modal.securityTab.setPermissions(item.permissions);

    await modal.saveButton.click();
    await this.page.waitForLoadState('networkidle');
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

    await this.addLayoutItem(item);
  }

  async addLayoutItemFromLayoutDesigner(item: LayoutItem) {
    const fieldTab = this.layoutDesignerModal.layoutItemsSection.fieldsTab;

    if ((await fieldTab.addFieldButton.isVisible()) === false) {
      await this.layoutDesignerModal.layoutItemsSection.fieldsTabButton.click();
    }

    await fieldTab.addFieldButton.click();
    await fieldTab.addFieldMenu.selectItem(item.type as FieldType);
    await this.addLayoutItemDialog.continueButton.click();

    await this.addLayoutItem(item, 1);
  }
}
