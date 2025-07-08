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
  tabName?: string;
  placementIndex?: number;
};

export class LayoutCanvasSection extends BaseCanvasSection {
  readonly hoveredStandAloneSectionDropzones: Locator;
  readonly hoveredSectionDropzone: Locator;
  readonly hoveredTabDropzone: Locator;

  // TODO: Need to account for canvas having vertical tab orientation
  constructor(frame: FrameLocator) {
    super(frame);
    this.hoveredStandAloneSectionDropzones = this.section.locator('.standaloneSectionDropArea.ui-droppable-hover');
    this.hoveredSectionDropzone = this.section.locator('.sectionDropArea.ui-droppable-hover');
    this.hoveredTabDropzone = this.section.locator('.tabDropArea.ui-droppable-hover');
  }

  async getItemDropzone(params: FieldDropzoneParams) {
    const { tabName, sectionName, column, row } = params;

    if (tabName === undefined) {
      const section = this.getStandAloneSection(sectionName);
      return section.getDropzone(column, row);
    }

    const tabStrip = this.section.locator('.k-tabstrip-items');
    const hasTabsDisplayed = await tabStrip.isVisible();

    if (!hasTabsDisplayed) {
      const section = this.section.locator('section.section').filter({ hasText: sectionName }).first();
      const sectionInstance = new LayoutSection(section);
      return sectionInstance.getDropzone(column, row);
    }

    await this.ensureTabSelected(tabName);
    const tab = await this.getTab(tabName);
    const section = tab.getSection(sectionName);
    return section.getDropzone(column, row);
  }

  async getSectionDropzone(params: SectionDropzoneParams) {
    const tabName = params.tabName ?? undefined;
    let placementIndex = params.placementIndex;

    if (tabName === undefined) {
      const numOfStandAloneDropzones = await this.section.locator('.standaloneSectionDropArea').count();
      const maxIndex = numOfStandAloneDropzones - 1;

      if (placementIndex === undefined || placementIndex > maxIndex) {
        placementIndex = maxIndex;
      }

      return this.section.locator('.standaloneSectionDropArea').nth(placementIndex);
    }

    const tab = await this.getTab(tabName);
    const dropzone = await tab.getSectionDropzone(placementIndex);
    return dropzone;
  }

  async getSectionHandle({ tabName, sectionName }: { tabName?: string; sectionName: string }) {
    if (tabName === undefined) {
      return this.getStandAloneSection(sectionName).getHandle();
    }

    await this.ensureTabSelected(tabName);
    const tab = await this.getTab(tabName);
    const section = tab.getSection(sectionName);
    return section.getHandle();
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

  getStandAloneSection(sectionName: string) {
    const section = this.section.locator('.mainContainer > .section').filter({ hasText: sectionName }).first();
    return new LayoutSection(section);
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

  getHandle() {
    return this.section.locator('[data-section-header]');
  }
}
