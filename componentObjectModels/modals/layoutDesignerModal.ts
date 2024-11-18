import { FrameLocator, Locator, Page } from '@playwright/test';
import { BASE_URL } from '../../playwright.config';
import { LayoutItemCreator } from '../creators/layoutItemCreator';
import { LayoutCanvasSection } from '../sections/layoutCanvasSection';
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

type AddSectionParams = {
  tabName: string;
  sectionName: string;
  placementIndex?: number;
};

export class LayoutDesignerModal extends LayoutItemCreator {
  private readonly designer: Locator;
  private readonly frame: FrameLocator;
  private readonly saveLayoutPathRegex: RegExp;
  readonly editLayoutPropertiesLink: Locator;
  readonly editLayoutPropertiesModal: EditLayoutPropertiesModal;
  readonly layoutItemsSection: LayoutItemsSection;
  readonly canvasSection: LayoutCanvasSection;
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
    this.canvasSection = new LayoutCanvasSection(this.frame);
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

  private async ensureFieldsTabSelected() {
    const fieldsTabButtonSelected = await this.layoutItemsSection.fieldsTabButton.getAttribute('aria-selected');
    const isFieldsTabSelected = fieldsTabButtonSelected === 'true';

    if (isFieldsTabSelected === false) {
      await this.layoutItemsSection.fieldsTabButton.click();
    }
  }

  /**
   * Drag a field from the field bank and drop it onto the layout. The section column and row are zero-based indexes.
   * @param params - The parameters for dragging and dropping the field
   * @returns A promise that resolves to the field and dropzone elements
   */
  async dragFieldOnToLayout(params: DragFieldParams) {
    await this.ensureFieldsTabSelected();

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

  private async ensureObjectTabSelected() {
    const objectTabButtonSelected = await this.layoutItemsSection.objectsTabButton.getAttribute('aria-selected');
    const isObjectTabSelected = objectTabButtonSelected === 'true';

    if (isObjectTabSelected === false) {
      await this.layoutItemsSection.objectsTabButton.click();
    }
  }

  async dragObjectOnToLayout(params: DragObjectParams) {
    await this.ensureObjectTabSelected();

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

  async addSection(params: AddSectionParams) {
    await this.ensureObjectTabSelected();

    const { tabName, sectionName, placementIndex } = params;
    const object = this.layoutItemsSection.objectsTab.getObjectFromBank('New Section');

    const dropzone = await this.canvasSection.getSectionDropzone({ tabName, placementIndex });

    await object.hover();
    await this.page.mouse.down();
    await dropzone.hover();
    await this.canvasSection.sectionDropzone.waitFor({ state: 'visible' });
    await this.page.mouse.up();
    const initialSectionName = await this.frame.locator('#name-editor input').inputValue();

    const tab = await this.canvasSection.getTab(tabName);
    const section = tab.getSection(initialSectionName);

    await section.updateName(sectionName);
  }
}
