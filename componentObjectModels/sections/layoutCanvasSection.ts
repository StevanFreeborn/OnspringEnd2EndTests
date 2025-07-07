import { FrameLocator, Locator } from '@playwright/test';
import { BaseCanvasSection } from './baseCanvasSection';
import { BaseLayoutSection } from './baseLayoutSection';

type FieldDropzoneParams = {
  tabName: string | undefined;
  sectionName: string;
  column: number;
  row: number;
};

type SectionDropzoneParams = {
  tabName: string;
  placementIndex?: number;
};

export class LayoutCanvasSection extends BaseCanvasSection {
  readonly sectionDropzone: Locator;
  readonly tabDropzone: Locator;

  // TODO: Need to account for canvas having vertical tab orientation
  constructor(frame: FrameLocator) {
    super(frame);
    this.sectionDropzone = this.section.locator('.sectionDropArea.ui-droppable-hover');
    this.tabDropzone = this.section.locator('.tabDropArea.ui-droppable-hover');
  }

  async getItemDropzone(params: FieldDropzoneParams) {
    const { tabName, sectionName, column, row } = params;
    const tab = await this.getTab(tabName);
    const section = tab.getSection(sectionName);
    return section.getDropzone(column, row);
  }

  async getSectionDropzone(params: SectionDropzoneParams) {
    const { tabName, placementIndex } = params;
    const tab = await this.getTab(tabName);
    const dropzone = await tab.getSectionDropzone(placementIndex);
    return dropzone;
  }

  async getHorizontalTabDropzone(index?: number) {
    if (index === undefined) {
      return this.section.locator('.k-tabstrip-items').locator('.tabDropArea').last();
    }

    const numOfAreas = await this.section.locator('.k-tabstrip-items').locator('.tabDropArea').count();
    const maxIndex = numOfAreas - 1;

    if (index > maxIndex) {
      index = maxIndex;
    }

    return this.section.locator('.k-tabstrip-items').locator('.tabDropArea').nth(index);
  }

  async getActiveTabName() {
    return this.section.locator('.k-tabstrip-items').locator('div.k-state-active').first();
  }

  getTabButton(tabName: string) {
    return this.section.locator('.k-tabstrip-items').locator('div.k-item').filter({ hasText: tabName }).first();
  }

  async getTab(tabName: string | undefined) {
    if (tabName === undefined) {
      const tab = this.section.locator('[data-tab-body]').first();
      return new LayoutTab(tab);
    }

    const tabButton = this.getTabButton(tabName);
    const tabId = await tabButton.getAttribute('data-canvas-tab');
    const tab = this.section.locator(`[data-tab-body="${tabId}"]`).first();
    return new LayoutTab(tab);
  }

  async ensureTabSelected(tabName: string) {
    const tab = this.section.locator('.k-tabstrip-items').getByText(tabName).first();
    await tab.click();
  }
}

class LayoutTab {
  private readonly tab: Locator;

  constructor(tab: Locator) {
    this.tab = tab;
  }

  getSection(sectionName: string) {
    const section = this.tab.locator('section').filter({ hasText: sectionName }).first();
    return new LayoutSection(section);
  }

  async getSectionDropzone(placementIndex?: number) {
    if (placementIndex === undefined) {
      return this.tab.locator('.sectionDropArea').last();
    }

    const numOfAreas = await this.tab.locator('.sectionDropArea').count();
    const maxIndex = numOfAreas - 1;

    if (placementIndex > maxIndex) {
      placementIndex = maxIndex;
    }

    return this.tab.locator('.sectionDropArea').nth(placementIndex);
  }
}

class LayoutSection extends BaseLayoutSection {
  private readonly editSectionNameButton: Locator;
  private readonly editSectionLink: Locator;
  private readonly deleteSectionLink: Locator;

  constructor(section: Locator) {
    super(section);
    this.editSectionNameButton = this.section.getByTitle('Edit Section Name');
    this.editSectionLink = this.section.getByRole('link', { name: 'Edit' });
    this.deleteSectionLink = this.section.getByRole('link', { name: 'Delete' });
  }

  async updateName(newName: string) {
    const page = this.section.page();
    const frame = page.frameLocator('iframe').first();
    const nameEditor = frame.locator('#name-editor');
    const input = nameEditor.locator('input');
    const applyButton = nameEditor.getByTitle('Apply');

    const isNameEditorVisible = await nameEditor.isVisible();

    if (isNameEditorVisible) {
      await applyButton.click();
    }

    await this.section.locator('h1').hover();
    await this.editSectionNameButton.click();

    await input.fill(newName);
    await applyButton.click();
  }

  async updateColumnCount(columnCount: number) {
    if (columnCount < 1 || columnCount > 12) {
      throw new Error('Column count must be between 1 and 12');
    }

    const page = this.section.page();
    const frame = page.frameLocator('iframe').first();
    const columnSelector = this.section.locator('#columns-container').getByRole('listbox');

    await columnSelector.click();
    await frame.getByRole('option', { name: columnCount.toString() }).click();
  }

  async delete() {
    const page = this.section.page();
    const dialog = page.getByRole('dialog', { name: 'Delete Section' });

    await page.addLocatorHandler(dialog, async l => {
      await l.getByRole('button', { name: 'Delete' }).click();
    });

    await this.deleteSectionLink.click();
  }
}
