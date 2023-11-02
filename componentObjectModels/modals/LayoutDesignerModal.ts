import { FrameLocator, Locator, Page } from '@playwright/test';
import { CanvasSection } from '../sections/canvasSection';
import { LayoutItemsSection } from '../sections/layoutItemsSection';
import { AddFieldModal } from './addFieldModal';

type DragFieldParams = {
  tabName: string;
  sectionName: string;
  sectionColumn: number;
  sectionRow: number;
  fieldName: string;
};

export class LayoutDesignerModal {
  private readonly designer: Locator;
  readonly frame: FrameLocator;
  readonly layoutItemsSection: LayoutItemsSection;
  readonly canvasSection: CanvasSection;
  readonly addFieldModal: AddFieldModal;
  readonly saveButton: Locator;
  readonly saveAndCloseButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.designer = page.getByRole('dialog');
    this.frame = this.designer.frameLocator('iframe').first();
    this.layoutItemsSection = new LayoutItemsSection(this.frame);
    this.canvasSection = new CanvasSection(this.frame);
    this.addFieldModal = new AddFieldModal(page);
    this.saveButton = this.designer.getByRole('button', { name: 'Save' });
    this.saveAndCloseButton = this.designer.getByRole('button', { name: 'Save & Close' });
    this.closeButton = this.designer.getByRole('button', { name: 'Close' });
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

    return [field, dropzone];
  }
}
