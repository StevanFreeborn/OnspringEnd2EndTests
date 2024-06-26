import { FrameLocator, Locator } from '@playwright/test';

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

export class CanvasSection {
  private readonly section: Locator;
  readonly layoutItemDropzone: Locator;
  readonly sectionDropzone: Locator;

  // TODO: Need to account for canvas having vertical tab orientation
  constructor(frame: FrameLocator) {
    this.section = frame.locator('.canvas-section').first();
    this.layoutItemDropzone = this.section.locator('#dropLocation');
    this.sectionDropzone = this.section.locator('.sectionDropArea.ui-droppable-hover');
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

class LayoutSection {
  private readonly section: Locator;
  private readonly editSectionNameButton: Locator;
  private readonly editSectionButton: Locator;
  private readonly deleteSectionButton: Locator;

  constructor(section: Locator) {
    this.section = section;
    this.editSectionNameButton = section.getByTitle('Edit Section Name');
    this.editSectionButton = section.getByRole('link', { name: 'Edit' });
    this.deleteSectionButton = section.getByRole('link', { name: 'Delete' });
  }

  private getLayoutZones() {
    return this.section.locator('.rendered-item');
  }

  private async getNumberOfColumns() {
    const layoutZones = await this.getLayoutZones().all();

    let maxColumn = -1;

    for (const zone of layoutZones) {
      const column = await zone.getAttribute('data-column');

      if (column === null) {
        continue;
      }

      const columnNumber = parseInt(column);

      if (columnNumber > maxColumn) {
        maxColumn = columnNumber;
      }
    }

    return maxColumn;
  }

  private async getNumberOfRows(column: number) {
    const layoutZones = await this.getLayoutZones().all();

    let count = -1;

    for (const zone of layoutZones) {
      const columnAttr = await zone.getAttribute('data-column');
      const rowAttr = await zone.getAttribute('data-row');

      if (columnAttr === null) {
        continue;
      }

      const columnNumber = parseInt(columnAttr);

      if (columnNumber === column && rowAttr !== null) {
        count += 1;
      }
    }

    return count;
  }

  async getDropzone(column: number, row: number) {
    const numberOfColumns = await this.getNumberOfColumns();
    const numberOfRows = await this.getNumberOfRows(column);

    if (numberOfColumns < 0) {
      throw new Error('Invalid column number');
    }

    if (numberOfRows < 0) {
      throw new Error('Invalid row number');
    }

    if (column > numberOfColumns) {
      column = numberOfColumns;
    }

    if (row > numberOfRows) {
      row = numberOfRows;
    }

    return this.section.locator(`.rendered-item[data-column="${column}"][data-row="${row}"]`).first();
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
}
