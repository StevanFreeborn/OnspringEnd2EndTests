import { parse } from 'node-xlsx';

export type Sheet = {
  name: string;
  data: Record<string, unknown>[];
};

export class SheetParser {
  /**
   * Parses a workbook file and returns an array of sheets.
   * @param filePath - The path to the workbook file.
   * @param hasHeaders - Whether the workbook has headers. Defaults to true.
   * @returns An array of sheets.
   */
  parseFile(filePath: string, hasHeaders: boolean = true): Sheet[] {
    const parsedData = parse(filePath, { cellDates: true });
    return parsedData.map(sheet => {
      if (hasHeaders) {
        if (sheet.data.length === 0) {
          return {
            name: sheet.name,
            data: [],
          };
        }

        const headers = sheet.data[0];
        const sheetData = sheet.data.slice(1).map(row => {
          const rowData: Record<string, unknown> = {};
          headers.forEach((header, index) => {
            rowData[header] = row[index];
          });
          return rowData;
        });

        return {
          name: sheet.name,
          data: sheetData,
        };
      }

      const sheetData = sheet.data.map(row => {
        const rowData: Record<string, unknown> = {};
        row.forEach((cell, index) => {
          rowData[index] = cell;
        });
        return rowData;
      });

      return {
        name: sheet.name,
        data: sheetData,
      };
    });
  }
}
