import { FrameLocator, Locator, Page } from '@playwright/test';
import { BASE_URL } from '../../playwright.config';
import { CanvasSection } from '../sections/canvasSection';
import { LayoutItemsSection } from '../sections/layoutItemsSection';
import { AddOrEditFieldModal } from './addOrEditFieldModal';

type DragFieldParams = {
  tabName: string;
  sectionName: string;
  sectionColumn: number;
  sectionRow: number;
  fieldName: string;
};

export class LayoutDesignerModal {
  private readonly page: Page;
  private readonly designer: Locator;
  private readonly frame: FrameLocator;
  private readonly pathRegex: RegExp;
  readonly layoutItemsSection: LayoutItemsSection;
  readonly canvasSection: CanvasSection;
  readonly addFieldModal: AddOrEditFieldModal;
  readonly saveButton: Locator;
  readonly saveAndCloseButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.designer = page.getByRole('dialog');
    this.frame = this.designer.frameLocator('iframe').first();
    this.pathRegex = new RegExp(`${BASE_URL}/Admin/App/[0-9]+/Layout/[0-9]+/Save`);
    this.layoutItemsSection = new LayoutItemsSection(this.frame);
    this.canvasSection = new CanvasSection(this.frame);
    this.addFieldModal = new AddOrEditFieldModal(page);
    this.saveButton = this.designer.getByRole('button', { name: 'Save' });
    this.saveAndCloseButton = this.designer.getByRole('button', { name: 'Save & Close' });
    this.closeButton = this.designer.getByRole('button', { name: 'Close' });
  }

  async saveLayout() {
    await this.saveButton.click();
    await this.page.waitForResponse(this.pathRegex);
  }

  async saveAndCloseLayout() {
    await this.saveAndCloseButton.click();
    await this.page.waitForResponse(this.pathRegex);
  }

  async dragFieldOnToLayout(params: DragFieldParams) {
    const { tabName, sectionName, sectionColumn, sectionRow, fieldName } = params;
    const field = this.layoutItemsSection.fieldsTab.getFieldFromBank(fieldName);

    const dropzone = await this.canvasSection.getFieldDropzone({
      tabName: tabName,
      sectionName: sectionName,
      column: sectionColumn,
      row: sectionRow,
    });

    await field.dragTo(dropzone);

    return { field, dropzone };
  }
}
