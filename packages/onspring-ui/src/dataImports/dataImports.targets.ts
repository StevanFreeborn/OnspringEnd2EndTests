import { Locator, Page } from '@playwright/test';

function mappingRowByField(fieldName: string) {
  return (page: Page): Locator =>
    page
      .locator('.mappable-items')
      .getByRole('row')
      .filter({ has: page.locator(`.field-cell:has-text("${fieldName}")`) });
}

function gridRow(name: string | RegExp) {
  return (page: Page): Locator =>
    typeof name === 'string'
      ? page
          .locator('#grid')
          .getByRole('row')
          .filter({ has: page.getByRole('gridcell', { name, exact: true }) })
          .first()
      : page.locator('#grid').getByRole('row', { name }).first();
}

export const DataImportsPageTargets = {
  route: '/Admin/Integration/Import',
  getImportsPath: '/Admin/Integration/Import/ImportList',
  deleteImportPathRegex: /\/Admin\/Integration\/Import\/\d+\/Delete/,
  createImportButton: (page: Page): Locator => page.getByRole('button', { name: 'Create Import Configuration' }),
  grid: (page: Page): Locator => page.locator('#grid'),
  rowByName: gridRow,
  deleteButtonInRow:
    (name: string | RegExp) =>
    (page: Page): Locator =>
      gridRow(name)(page).getByTitle('Delete Import Configuration'),
};

export const EditDataImportPageTargets = {
  route: (id: number): string => `/Admin/Integration/Import/${id}/Edit`,
  pathRegex: /\/Admin\/Integration\/Import\/\d+\/Edit/,
  saveImportFilePath: '/Admin/Integration/Import/SaveImportFiles',
  saveChangesLink: (page: Page): Locator => page.getByRole('link', { name: 'Save Changes', exact: true }),
  saveChangesAndRunLink: (page: Page): Locator => page.getByRole('link', { name: 'Save Changes & Run' }),
  runImportConfirmButton: (page: Page): Locator => page.getByRole('button', { name: 'Run' }),
  importProcessingMessage: (page: Page): Locator => page.locator('.processing-message'),
  optionByName:
    (name: string) =>
    (page: Page): Locator =>
      page.getByRole('option', { name }),
  dataFileTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Data File' }),
  dataMappingTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Data Mapping' }),

  dataFileTab: {
    nameInput: (page: Page): Locator => page.getByLabel('Name'),
    targetAppSelect: (page: Page): Locator => page.getByRole('listbox', { name: 'App/Survey' }),
    addNewFileLink: (page: Page): Locator => page.locator('.k-upload-button').first(),
  },

  dataMappingTab: {
    mappingsGrid: (page: Page): Locator => page.locator('.mappable-items'),
    appFieldByName:
      (fieldName: string) =>
      (page: Page): Locator =>
        mappingRowByField(fieldName)(page).locator('.field-cell'),
    mappedFieldByName:
      (fieldName: string) =>
      (page: Page): Locator =>
        mappingRowByField(fieldName)(page).locator('.map-item-container'),
  },
};
