import { Locator, Page } from '@playwright/test';
import { AttachmentField } from '../../models/attachmentField';
import { DateField } from '../../models/dateField';
import { FormattedTextBlock } from '../../models/formattedTextBlock';
import { FormulaField } from '../../models/formulaField';
import { LayoutItem } from '../../models/layoutItem';
import { ListField } from '../../models/listField';
import { NumberField } from '../../models/numberField';
import { ReferenceField } from '../../models/referenceField';
import { TextField } from '../../models/textField';
import { TimeSpanField } from '../../models/timeSpanField';
import { LayoutItemCreator } from '../creators/layoutItemCreator';
import { AddLayoutItemDialog } from '../dialogs/addLayoutItemDialog';
import { DeleteLayoutItemDialog } from '../dialogs/deleteLayoutItemDialog';
import { FieldType } from '../menus/addFieldTypeMenu';
import { AddLayoutItemMenu } from '../menus/addLayoutItemMenu';
import { LayoutDesignerModal } from '../modals/layoutDesignerModal';
import {
  ExportFieldsAndObjectsReportModal,
  ExportFieldsAndObjectsReportOptions,
} from './../modals/exportFieldsAndObjectsReportModal';

export class BaseLayoutTab extends LayoutItemCreator {
  private readonly getLayoutDesignPathRegex: RegExp;
  private readonly addItemPathRegex: RegExp;
  private readonly getLayoutItemPathRegex: RegExp;
  private readonly filterFieldsInput: Locator;
  readonly layoutsGrid: Locator;
  readonly layoutDesignerModal: LayoutDesignerModal;
  readonly addFieldButton: Locator;
  readonly addLayoutItemMenu: AddLayoutItemMenu;
  readonly addLayoutItemDialog: AddLayoutItemDialog;
  readonly deleteLayoutItemDialog: DeleteLayoutItemDialog;
  readonly fieldsAndObjectsGrid: Locator;
  readonly exportFieldsAndObjectsReportButton: Locator;
  readonly exportFieldsAndObjectsReportModal: ExportFieldsAndObjectsReportModal;

  constructor(page: Page) {
    super(page);
    this.getLayoutDesignPathRegex = /\/Admin\/App\/Layout\/\d+\/Design/;
    this.addItemPathRegex = /\/Admin\/App\/\d+\/(LayoutObject|Field)\/Add(TextObject|UsingSettings)/;
    this.getLayoutItemPathRegex = /Admin\/App\/\d+\/Layout\/ItemListPage/;
    this.filterFieldsInput = this.page.getByPlaceholder('Filter Fields');
    this.layoutsGrid = this.page.locator('#grid-layouts').first();
    this.layoutDesignerModal = new LayoutDesignerModal(this.page);
    this.addFieldButton = this.page.getByText('Add Field');
    this.addLayoutItemMenu = new AddLayoutItemMenu(this.page);
    this.addLayoutItemDialog = new AddLayoutItemDialog(this.page);
    this.deleteLayoutItemDialog = new DeleteLayoutItemDialog(this.page);
    this.fieldsAndObjectsGrid = this.page.locator('#grid-layout-items').first();
    this.exportFieldsAndObjectsReportButton = this.page.locator('#export-layout-items');
    this.exportFieldsAndObjectsReportModal = new ExportFieldsAndObjectsReportModal(this.page);
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
        await addFieldModal.generalTab.fillOutGeneralTab(item as AttachmentField);
        break;
      }
      case 'Image': {
        const addFieldModal = this.getLayoutItemModal(item.type, frameNumber);
        await addFieldModal.generalTab.fillOutGeneralTab(item as AttachmentField);
        break;
      }
      case 'Formula': {
        const addFieldModal = this.getLayoutItemModal(item.type, frameNumber);
        await addFieldModal.generalTab.fillOutGeneralTab(item as FormulaField);
        break;
      }
      case 'Time Span': {
        const addFieldModal = this.getLayoutItemModal(item.type, frameNumber);
        await addFieldModal.generalTab.fillOutGeneralTab(item as TimeSpanField);
        break;
      }
      case 'List': {
        const addFieldModal = this.getLayoutItemModal(item.type, frameNumber);
        await addFieldModal.generalTab.fillOutGeneralTab(item as ListField);
        break;
      }
      case 'Date/Time': {
        const addFieldModal = this.getLayoutItemModal(item.type, frameNumber);
        await addFieldModal.generalTab.fillOutGeneralTab(item as DateField);
        break;
      }
      case 'Number': {
        const addFieldModal = this.getLayoutItemModal(item.type, frameNumber);
        await addFieldModal.generalTab.fillOutGeneralTab(item as NumberField);
        break;
      }
      case 'Text': {
        const addFieldModal = this.getLayoutItemModal(item.type, frameNumber);
        await addFieldModal.generalTab.fillOutGeneralTab(item as TextField);
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
    const getLayoutDesignResponse = this.page.waitForResponse(this.getLayoutDesignPathRegex);
    await this.layoutsGrid.getByRole('row', { name: layoutName }).click();
    await getLayoutDesignResponse;
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
        const isVisible = await fieldTab.addFieldButton.isVisible();

        if (isVisible) {
          await this.layoutDesignerModal.layoutItemsSection.objectsTabButton.click();
        }

        await objectTab.addObjectButton.waitFor();
        await objectTab.addObjectButton.click();
        await objectTab.addObjectMenu.selectItem(item.type);
        break;
      }
      default: {
        const isVisible = await objectTab.addObjectButton.isVisible();

        if (isVisible) {
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

  async getFieldIdFromFieldsAndObjectsGrid(field: LayoutItem) {
    if (field instanceof FormattedTextBlock) {
      throw new Error('Formatted Text Blocks do not have field IDs.');
    }

    const columnHeaders = await this.fieldsAndObjectsGrid.locator('th').all();
    let columnHeaderIndex = -1;

    for (const [index, header] of columnHeaders.entries()) {
      const headerText = await header.textContent();

      if (headerText === 'Field ID') {
        columnHeaderIndex = index;
        break;
      }
    }

    if (columnHeaderIndex === -1) {
      throw new Error('The Field ID column header was not found.');
    }

    const fieldRow = this.fieldsAndObjectsGrid.getByRole('row', { name: new RegExp(field.name, 'i') }).first();
    const fieldIdCell = fieldRow.locator('td').nth(columnHeaderIndex);
    const fieldId = await fieldIdCell.textContent();

    if (fieldId === null) {
      throw new Error(`The field ID for the field "${field.name}" was not found.`);
    }

    const fieldIdNumber = parseInt(fieldId);

    return fieldIdNumber;
  }

  async searchFieldsAndObjectsReport(searchTerm: string) {
    const searchResponse = this.page.waitForResponse(res => {
      const isCorrectPath = res.url().match(this.getLayoutItemPathRegex) !== null;
      const isCorrectMethod = res.request().method() === 'POST';
      const requestBody = res.request().postDataJSON();
      const isCorrectSearchTerm = requestBody.searchTerm === searchTerm;
      return isCorrectPath && isCorrectMethod && isCorrectSearchTerm;
    });
    await this.filterFieldsInput.fill(searchTerm);
    await searchResponse;
  }

  async exportFieldsAndObjectsReport(options: ExportFieldsAndObjectsReportOptions) {
    await this.exportFieldsAndObjectsReportButton.click();
    await this.exportFieldsAndObjectsReportModal.exportReport(options);
  }
}
