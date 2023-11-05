import { FrameLocator, Locator, Page } from '@playwright/test';
import { BASE_URL } from '../../playwright.config';
import { LayoutItemCreator } from '../creators/layoutItemCreator';
import { CanvasSection } from '../sections/canvasSection';
import { LayoutItemsSection } from '../sections/layoutItemsSection';

type DragFieldParams = {
  tabName: string;
  sectionName: string;
  sectionColumn: number;
  sectionRow: number;
  fieldName: string;
};

export class LayoutDesignerModal extends LayoutItemCreator {
  private readonly designer: Locator;
  private readonly frame: FrameLocator;
  private readonly pathRegex: RegExp;
  readonly layoutItemsSection: LayoutItemsSection;
  readonly canvasSection: CanvasSection;
  readonly saveButton: Locator;
  readonly saveAndCloseButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.designer = page.getByRole('dialog');
    this.frame = this.designer.frameLocator('iframe').first();
    this.pathRegex = new RegExp(`${BASE_URL}/Admin/App/[0-9]+/Layout/[0-9]+/Save`);
    this.layoutItemsSection = new LayoutItemsSection(this.frame);
    this.canvasSection = new CanvasSection(this.frame);
    this.saveButton = this.designer.getByRole('button', { name: 'Save' });
    this.saveAndCloseButton = this.designer.getByRole('button', { name: 'Save & Close' });
    this.closeButton = this.designer.getByRole('button', { name: 'Close' });
  }

  async saveLayout() {
    const saveResponse = this.page.waitForResponse(this.pathRegex);
    await this.saveButton.click();
    await saveResponse;
  }

  async saveAndCloseLayout() {
    const saveResponse = this.page.waitForResponse(this.pathRegex);
    await this.saveAndCloseButton.click();
    await saveResponse;
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

    await field.hover();
    await this.page.mouse.down();
    await dropzone.hover();
    await this.canvasSection.layoutItemDropzone.waitFor({ state: 'visible' });
    await this.page.mouse.up();

    return { field, dropzone };
  }
}
