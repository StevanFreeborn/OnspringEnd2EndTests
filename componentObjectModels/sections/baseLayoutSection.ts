import { Locator } from '@playwright/test';

export class BaseLayoutSection {
  protected readonly section: Locator;

  constructor(section: Locator) {
    this.section = section;
  }

  protected getLayoutZones() {
    return this.section.locator('.rendered-item');
  }

  protected async getNumberOfColumns() {
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

  protected async getNumberOfRows(column: number) {
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
}
