import { Locator, Page } from '@playwright/test';
import { FormattedTextBlock } from '../../models/formattedTextBlock';
import { FormulaField } from '../../models/formulaField';
import { LayoutItem } from '../../models/layoutItem';
import { ListField } from '../../models/listField';
import { ReferenceField } from '../../models/referenceField';
import { LayoutItemCreator } from '../creators/layoutItemCreator';
import { AddLayoutItemDialog } from '../dialogs/addLayoutItemDialog';
import { DeleteLayoutItemDialog } from '../dialogs/deleteLayoutItemDialog';
import { FieldType } from '../menus/addFieldTypeMenu';
import { AddLayoutItemMenu } from '../menus/addLayoutItemMenu';
import { LayoutDesignerModal } from '../modals/layoutDesignerModal';

export class BaseLayoutTab extends LayoutItemCreator {
  private readonly addItemPathRegex: RegExp;
  readonly layoutsGrid: Locator;
  readonly layoutDesignerModal: LayoutDesignerModal;
  readonly addFieldButton: Locator;
  readonly addLayoutItemMenu: AddLayoutItemMenu;
  readonly addLayoutItemDialog: AddLayoutItemDialog;
  readonly deleteLayoutItemDialog: DeleteLayoutItemDialog;
  readonly fieldsAndObjectsGrid: Locator;

  constructor(page: Page) {
    super(page);
    this.addItemPathRegex = /\/Admin\/App\/\d+\/(LayoutObject|Field)\/Add(TextObject|UsingSettings)/;
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
      case 'Formatted Text Block': {
        const addTextBlockModal = this.getLayoutItemModal(item.type, frameNumber);
        await addTextBlockModal.generalTab.fillOutGeneralTab(item as FormattedTextBlock);
        break;
      }
      case 'Reference': {
        const addFieldModal = this.getLayoutItemModal(item.type, frameNumber);
        await addFieldModal.generalTab.fillOutGeneralTab(item as ReferenceField);
        break;
      }
      case 'Attachment': {
        const addFieldModal = this.getLayoutItemModal(item.type, frameNumber);
        await addFieldModal.generalTab.fillOutGeneralTab(item);
        break;
      }
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

    await modal.save();
  }

  /**
   * Opens the specified layout.
   * @param layoutName - The name of the layout to open. Defaults to 'Default Layout'.
   * @returns A promise that resolves when the layout is opened.
   */
  async openLayout(layoutName: string = 'Default Layout') {
    await this.layoutsGrid.getByRole('row', { name: layoutName }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async addLayoutItemFromFieldsAndObjectsGrid(item: LayoutItem) {
    await this.addFieldButton.click();
    await this.addLayoutItemMenu.selectItem(item.type);
    const addItemResponse = this.page.waitForResponse(this.addItemPathRegex);
    await this.addLayoutItemDialog.continueButton.click();
    await addItemResponse;
    await this.addLayoutItem(item);
  }

  /**
   * Adds a layout item to the layout from the layout designer. This method does NOT open the layout designer.
   * @param item - The layout item to add to the layout.
   * @returns A promise that resolves when the layout item is added to the layout.
   */
  async addLayoutItemFromLayoutDesigner(item: LayoutItem) {
    const fieldTab = this.layoutDesignerModal.layoutItemsSection.fieldsTab;
    const objectTab = this.layoutDesignerModal.layoutItemsSection.objectsTab;

    switch (item.type) {
      case 'Formatted Text Block': {
        if ((await objectTab.addObjectButton.isVisible()) === false) {
          await this.layoutDesignerModal.layoutItemsSection.objectsTabButton.click();
        }
        await objectTab.addObjectButton.waitFor();
        await objectTab.addObjectButton.click();
        await objectTab.addObjectMenu.selectItem(item.type);
        break;
      }
      default: {
        if ((await fieldTab.addFieldButton.isVisible()) === false) {
          await this.layoutDesignerModal.layoutItemsSection.fieldsTabButton.click();
        }
        await fieldTab.addFieldButton.waitFor();
        await fieldTab.addFieldButton.click();
        await fieldTab.addFieldMenu.selectItem(item.type as FieldType);
        break;
      }
    }

    const addItemResponse = this.page.waitForResponse(this.addItemPathRegex);
    await this.addLayoutItemDialog.continueButton.click();
    await addItemResponse;
    await this.addLayoutItem(item, 1);
  }
}
