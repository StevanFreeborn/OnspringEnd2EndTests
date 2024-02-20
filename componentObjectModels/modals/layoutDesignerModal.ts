import { FrameLocator, Locator, Page } from '@playwright/test';
import { BASE_URL } from '../../playwright.config';
import { LayoutItemCreator } from '../creators/layoutItemCreator';
import { CanvasSection } from '../sections/canvasSection';
import { LayoutItemsSection } from '../sections/layoutItemsSection';
import { EditLayoutPropertiesModal } from './editLayoutPropertiesModal';

type DragItemsParams = {
  tabName: string | undefined;
  sectionName: string;
  sectionColumn: number;
  sectionRow: number;
};

type DragFieldParams = DragItemsParams & {
  fieldName: string;
};

type DragObjectParams = DragItemsParams & {
  objectName: string;
};

export class LayoutDesignerModal extends LayoutItemCreator {
  private readonly designer: Locator;
  private readonly frame: FrameLocator;
  private readonly saveLayoutPathRegex: RegExp;
  readonly editLayoutPropertiesLink: Locator;
  readonly editLayoutPropertiesModal: EditLayoutPropertiesModal;
  readonly layoutItemsSection: LayoutItemsSection;
  readonly canvasSection: CanvasSection;
  readonly saveButton: Locator;
  readonly saveAndCloseButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.designer = page.getByRole('dialog');
    this.frame = this.designer.frameLocator('iframe').first();
    this.editLayoutPropertiesModal = new EditLayoutPropertiesModal(this.frame);
    this.editLayoutPropertiesLink = this.frame.getByRole('link', { name: 'Edit Layout Properties' });
    this.saveLayoutPathRegex = new RegExp(`${BASE_URL}/Admin/App/[0-9]+/Layout/[0-9]+/Save`);
    this.layoutItemsSection = new LayoutItemsSection(this.frame);
    this.canvasSection = new CanvasSection(this.frame);
    this.saveButton = this.designer.getByRole('button', { name: 'Save', exact: true });
    this.saveAndCloseButton = this.designer.getByRole('button', { name: 'Save & Close' });
    this.closeButton = this.designer.getByRole('button', { name: 'Close' });
  }

  async saveLayout() {
    const saveResponse = this.page.waitForResponse(this.saveLayoutPathRegex);
    await this.saveButton.click();
    await saveResponse;
  }

  async saveAndCloseLayout() {
    const saveResponse = this.page.waitForResponse(this.saveLayoutPathRegex);
    await this.saveAndCloseButton.click();
    await saveResponse;
  }

  /**
   * Drag a field from the field bank and drop it onto the layout. The section column and row are zero-based indexes.
   * @param params - The parameters for dragging and dropping the field
   * @returns A promise that resolves to the field and dropzone elements
   */
  async dragFieldOnToLayout(params: DragFieldParams) {
    const { tabName, sectionName, sectionColumn, sectionRow, fieldName } = params;
    const field = this.layoutItemsSection.fieldsTab.getFieldFromBank(fieldName);

    const dropzone = await this.canvasSection.getItemDropzone({
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

  async dragObjectOnToLayout(params: DragObjectParams) {
    const { tabName, sectionName, sectionColumn, sectionRow, objectName } = params;
    const object = this.layoutItemsSection.objectsTab.getObjectFromBank(objectName);

    const dropzone = await this.canvasSection.getItemDropzone({
      tabName: tabName,
      sectionName: sectionName,
      column: sectionColumn,
      row: sectionRow,
    });

    await object.hover();
    await this.page.mouse.down();
    await dropzone.hover();
    await this.canvasSection.layoutItemDropzone.waitFor({ state: 'visible' });
    await this.page.mouse.up();

    return { object, dropzone };
  }
}
