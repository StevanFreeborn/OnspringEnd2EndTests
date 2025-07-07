import { FrameLocator, Locator, Page } from '@playwright/test';
import { BASE_URL } from '../../playwright.config';
import { LayoutItemCreator } from '../creators/layoutItemCreator';
import { LayoutCanvasSection } from '../sections/layoutCanvasSection';
import { LayoutItemsSection } from '../sections/layoutItemsSection';
import { EditLayoutPropertiesModal } from './editLayoutPropertiesModal';
import { EditTabSetModal } from './editTabSetModal';

type DragItemsParams = {
  tabName?: string;
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
  tabName?: string;
  sectionName: string;
  placementIndex?: number;
};

type AddTabParams = {
  name: string;
  index?: number;
};

export class LayoutDesignerModal extends LayoutItemCreator {
  private readonly designer: Locator;
  private readonly frame: FrameLocator;
  private readonly saveLayoutPathRegex: RegExp;
  private readonly tabOrientationContainer: Locator;
  readonly editLayoutPropertiesLink: Locator;
  readonly editLayoutPropertiesModal: EditLayoutPropertiesModal;
  readonly configureTabSetLink: Locator;
  readonly configureTabSetModal: EditTabSetModal;
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
    this.tabOrientationContainer = this.frame.locator('#canvas-orientation');
    this.layoutItemsSection = new LayoutItemsSection(this.frame);
    this.canvasSection = new LayoutCanvasSection(this.frame);
    this.configureTabSetLink = this.frame.getByRole('link', { name: 'Configure Tab Set' });
    this.configureTabSetModal = new EditTabSetModal(this.frame);
    this.saveButton = this.designer.getByRole('button', { name: 'Save', exact: true });
    this.saveAndCloseButton = this.designer.getByRole('button', { name: 'Save & Close' });
    this.closeButton = this.designer.getByRole('button', { name: 'Close' });
  }

  async closeLayout() {
    await this.closeButton.click();
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

    if (tabName !== undefined) {
      await this.canvasSection.ensureTabSelected(tabName);
    }

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

    if (tabName !== undefined) {
      await this.canvasSection.ensureTabSelected(tabName);
    }

    const object = this.layoutItemsSection.objectsTab.getObjectFromBank('New Section');

    const dropzone = await this.canvasSection.getSectionDropzone({ tabName, placementIndex });

    await object.hover();
    await this.page.mouse.down();
    await dropzone.hover();

    if (tabName === undefined) {
      await this.canvasSection.hoveredStandAloneSectionDropzones.waitFor({ state: 'visible' });
    } else {
      await this.canvasSection.hoveredSectionDropzone.waitFor({ state: 'visible' });
    }

    await this.page.mouse.up();
    const initialSectionName = await this.frame.locator('#name-editor input').inputValue();

    if (tabName === undefined) {
      const section = this.canvasSection.getStandAloneSection(initialSectionName);
      await section.updateName(sectionName);
    } else {
      const tab = await this.canvasSection.getTab(tabName);
      const section = tab.getSection(initialSectionName);

      await section.updateName(sectionName);
    }
  }

  async updateSectionName(params: { tabName?: string; sectionName: string; newSectionName: string }) {
    const { tabName, sectionName, newSectionName } = params;

    if (tabName === undefined) {
      const section = this.canvasSection.getStandAloneSection(sectionName);
      await section.updateName(newSectionName);
      return;
    }

    await this.canvasSection.ensureTabSelected(tabName);
    const tab = await this.canvasSection.getTab(tabName);
    const section = tab.getSection(sectionName);

    await section.updateName(newSectionName);
  }

  async updateSectionColumnCount(params: { tabName?: string; sectionName: string; columnCount: number }) {
    const { tabName, sectionName, columnCount } = params;

    if (tabName === undefined) {
      const section = this.canvasSection.getStandAloneSection(sectionName);
      await section.updateColumnCount(columnCount);
      return;
    }

    await this.canvasSection.ensureTabSelected(tabName);
    const tab = await this.canvasSection.getTab(tabName);
    const section = tab.getSection(sectionName);
    await section.updateColumnCount(columnCount);
  }

  async deleteSection({ tabName, sectionName }: { tabName?: string; sectionName: string }) {
    if (tabName === undefined) {
      const section = this.canvasSection.getStandAloneSection(sectionName);
      await section.delete();
      return;
    }

    await this.canvasSection.ensureTabSelected(tabName);
    const tab = await this.canvasSection.getTab(tabName);
    const section = tab.getSection(sectionName);
    await section.delete();
  }

  private async getTabOrientation() {
    const selected = this.tabOrientationContainer.locator('.selected');
    const orientation = await selected.textContent();

    if (orientation === null) {
      throw new Error('Tab orientation not found');
    }

    const normalizedOrientation = orientation.trim().toLowerCase();
    return normalizedOrientation === 'horizontal' ? 'horizontal' : 'vertical';
  }

  async addTab(params: AddTabParams) {
    const orientation = await this.getTabOrientation();

    await this.ensureObjectTabSelected();

    if (orientation === 'horizontal') {
      const newTabItem = this.layoutItemsSection.objectsTab.getObjectFromBank('New Tab');
      const tabDropzone = await this.canvasSection.getHorizontalTabDropzone(params.index);
      const tabNameEditor = this.frame.locator('#name-editor input');
      const tabNameApplyButton = this.frame.locator('#name-editor').getByTitle('Apply');

      await newTabItem.hover();
      await this.page.mouse.down();
      await tabDropzone.hover();
      await this.canvasSection.hoveredTabDropzone.waitFor({ state: 'visible' });
      await this.page.mouse.up();
      await tabNameEditor.fill(params.name);
      await tabNameApplyButton.click();
      return;
    }

    throw new Error('Support for vertical tabs is not implemented yet');
  }

  async updateTabName({ currentName, newName }: { currentName: string; newName: string }) {
    const tab = this.canvasSection.getTabButton(currentName);

    await tab.hover();
    await tab.locator('[title="Edit Tab Name"]').click();
    await this.frame.locator('#name-editor input').fill(newName);
    await this.frame.locator('#name-editor').getByTitle('Apply').click();
  }

  async dragTab({ tabName, index }: { tabName: string; index: number }) {
    const orientation = await this.getTabOrientation();

    if (orientation === 'horizontal') {
      const tab = this.canvasSection.getTabButton(tabName);

      await tab.hover();
      await this.page.mouse.down();
      await this.page.mouse.move(0, 0);
      const tabDropzone = await this.canvasSection.getHorizontalTabDropzone(index);
      await tabDropzone.hover();
      await this.canvasSection.hoveredTabDropzone.waitFor({ state: 'visible' });
      await this.page.mouse.up();
      return;
    }

    throw new Error('Support for vertical tabs is not implemented yet');
  }
}
