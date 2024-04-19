import { parse } from 'node-xlsx';

type Sheet = {
  name: string;
  data: Record<string, unknown>[];
};

export class SheetParser {
  /**
   * Parses a workbook file and returns an array of sheets.
   * @param filePath - The path to the workbook file.
   * @param hasHeaders - Whether the workbook has headers. Defaults to true.
   * @returns An array of sheets.
   * @example With headers
   * ```ts
   * const sheetParser = new SheetParser();
   * const sheets = sheetParser.parseFile('path/to/workbook.xlsx');
   * console.log(sheets);
   * // Output: [{ name: 'Sheet1', data: [{ header1: 'value1', header2: 'value2' }, { header1: 'value3', header2: 'value4' }] }]
   * ```
   * @example Without headers
   * ```ts
   * const sheetParser = new SheetParser();
   * const sheets = sheetParser.parseFile('path/to/workbook.xlsx', false);
   * console.log(sheets);
   * // Output: [{ name: 'Sheet1', data: [{ 0: 'value1', 1: 'value2' }, { 0: 'value3', 1: 'value4' }] }]
   * ```
   */
  parseFile(filePath: string, hasHeaders: boolean = true): Sheet[] {
    const parsedData = parse(filePath, { cellDates: true });
    return parsedData.map(sheet => {
      let sheetData: Record<string, unknown>[];

      if (hasHeaders) {
        sheetData = sheet.data.slice(1).map(row => {
          const rowData: Record<string, unknown> = {};
          sheet.data[0].forEach((header, index) => {
            rowData[header] = row[index];
          });
          return rowData;
        });
      } else {
        sheetData = sheet.data.map(row => {
          const rowData: Record<string, unknown> = {};
          row.forEach((cell, index) => {
            rowData[index] = cell;
          });
          return rowData;
        });
      }

      return {
        name: sheet.name,
        data: sheetData,
      };
    });
  }
}
