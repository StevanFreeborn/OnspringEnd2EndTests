import { Page } from '@playwright/test';
import { FormulaOutputType } from '@stevanfreeborn/onspring-models';
import { Target } from '@stevanfreeborn/screenplay-playwright';

const fieldsGrid = (page: Page) => page.locator('#grid-layout-items').first();
const modalFrame = (page: Page, frameNumber: number = 0) => page.frameLocator('iframe').nth(frameNumber);

export const FieldTargets = {
  grid: fieldsGrid,
  headerCells: (page: Page) => fieldsGrid(page).locator('th'),
  rowByName:
    (name: string | RegExp): Target =>
    (page: Page) =>
      fieldsGrid(page).getByRole('row', { name }),
  rowCellAt:
    (fieldName: string, columnIndex: number): Target =>
    (page: Page) =>
      fieldsGrid(page)
        .getByRole('row', { name: new RegExp(fieldName, 'i') })
        .first()
        .locator('td')
        .nth(columnIndex),
  copyButtonInRow:
    (fieldName: string): Target =>
    (page: Page) =>
      fieldsGrid(page).getByRole('row', { name: fieldName }).first().getByTitle('Copy'),
  editButtonInRow:
    (fieldName: string): Target =>
    (page: Page) =>
      fieldsGrid(page).getByRole('row', { name: fieldName }).first().getByTitle('Edit'),
  deleteButtonInRow:
    (fieldName: string): Target =>
    (page: Page) =>
      fieldsGrid(page).getByRole('row', { name: fieldName }).first().getByTitle('Delete'),
  addFieldButton: (page: Page) => page.getByText('Add Field'),
  addLayoutItemMenuOption:
    (itemType: string): Target =>
    (page: Page) =>
      page.locator('[data-add-menu="layout-item"]').first().getByText(itemType, { exact: true }),
  addItemPathRegex: /\/Admin\/App\/\d+\/(LayoutObject|Field)\/Add(TextObject|UsingSettings|LabelObject)/,
  addOrEditFieldPathRegex: /\/Admin\/App\/\d+\/Field\/(AddUsingSettings|\d+\/Edit)/,
  deleteLayoutItemPathRegex: /\/Admin\/App\/\d+\/Layout\/DeleteItem/,

  addLayoutItemDialog: {
    copyFromRadioButton: (page: Page) => page.getByText('Copy from'),
    copyFromDropdown: (page: Page) => page.locator('.copy-from-dropdown'),
    copyFromOption:
      (itemName: string): Target =>
      (page: Page) =>
        page.getByRole('option', { name: itemName }),
    continueButton: (page: Page) => page.getByRole('button', { name: 'Continue' }),
  },

  modal: {
    frame:
      (frameNumber: number = 0) =>
      (page: Page) =>
        modalFrame(page, frameNumber),
    generalSettingsTabButton:
      (frameNumber: number = 0): Target =>
      (page: Page) =>
        modalFrame(page, frameNumber).getByRole('tab', { name: 'General Settings' }),
    securityTabButton:
      (frameNumber: number = 0): Target =>
      (page: Page) =>
        modalFrame(page, frameNumber).getByRole('tab', { name: 'Security' }),
    usageTabButton:
      (frameNumber: number = 0): Target =>
      (page: Page) =>
        modalFrame(page, frameNumber).getByRole('tab', { name: 'Usage' }),
    nameInput:
      (frameNumber: number = 0): Target =>
      (page: Page) =>
        modalFrame(page, frameNumber).getByLabel('Field', { exact: true }),
    statusButton:
      (status: 'Enabled' | 'Disabled' | 'Invalid', frameNumber: number = 0): Target =>
      (page: Page) =>
        modalFrame(page, frameNumber)
          .locator('.label:has-text("Status") + .data .button-status-container')
          .getByRole('button', { name: status }),
    listValuesGrid: {
      addValueButton:
        (frameNumber: number = 0): Target =>
        (page: Page) =>
          modalFrame(page, frameNumber).locator('.list-values').first().getByRole('button', { name: 'Add Value' }),
      lastRowValueInput:
        (frameNumber: number = 0): Target =>
        (page: Page) =>
          modalFrame(page, frameNumber)
            .locator('.list-values')
            .first()
            .locator('div.k-grid-content')
            .getByRole('row')
            .last()
            .locator('td[data-field="name"] input'),
      lastRowNumericValueInput:
        (frameNumber: number = 0): Target =>
        (page: Page) =>
          modalFrame(page, frameNumber)
            .locator('.list-values')
            .first()
            .locator('div.k-grid-content')
            .getByRole('row')
            .last()
            .locator('td[data-field="numericValue"] input.k-formatted-value'),
      lastRowColorPicker:
        (frameNumber: number = 0): Target =>
        (page: Page) =>
          modalFrame(page, frameNumber)
            .locator('.list-values')
            .first()
            .locator('div.k-grid-content')
            .getByRole('row')
            .last()
            .locator('td[data-field="color"] span.k-colorpicker'),
    },
    dateDisplaySelect:
      (frameNumber: number = 0): Target =>
      (page: Page) =>
        modalFrame(page, frameNumber).locator('.label:has-text("Display") + .data').getByRole('listbox'),
    dateDisplayOption:
      (display: string, frameNumber: number = 0): Target =>
      (page: Page) =>
        modalFrame(page, frameNumber).getByRole('option', { name: display, exact: true }),
    referenceDisplayFieldsPathRegex: /\/Admin\/App\/\d+\/Field\/ReferenceDisplayFields/,
    referenceSelect:
      (frameNumber: number = 0): Target =>
      (page: Page) =>
        modalFrame(page, frameNumber).getByRole('listbox', { name: 'Reference' }),
    referenceOption:
      (reference: string, frameNumber: number = 0): Target =>
      (page: Page) =>
        modalFrame(page, frameNumber).getByRole('option', { name: reference }),
    selectedGridFields:
      (frameNumber: number = 0): Target =>
      (page: Page) =>
        modalFrame(page, frameNumber)
          .locator('td:has-text("Grid Fields") + td div.onx-selector')
          .locator('.selector-select-list li')
          .first(),
    formulaOutputTypeSelect:
      (frameNumber: number = 0): Target =>
      (page: Page) =>
        modalFrame(page, frameNumber).getByRole('listbox', { name: 'Output Type' }),
    formulaOutputTypeOption:
      (outputType: FormulaOutputType, frameNumber: number = 0): Target =>
      (page: Page) =>
        modalFrame(page, frameNumber).getByRole('option', { name: outputType }),
    formulaEditor:
      (frameNumber: number = 0): Target =>
      (page: Page) =>
        modalFrame(page, frameNumber).locator('.CodeMirror').first(),
    securityViewSelect:
      (frameNumber: number = 0): Target =>
      (page: Page) =>
        modalFrame(page, frameNumber).getByRole('listbox', { name: 'View' }),
    securityOption:
      (optionName: 'Public' | 'Role-Based', frameNumber: number = 0): Target =>
      (page: Page) =>
        modalFrame(page, frameNumber).getByRole('option', { name: optionName }),
    permissionsGrid: {
      roleEditCheckbox:
        (roleName: string, frameNumber: number = 0): Target =>
        (page: Page) =>
          modalFrame(page, frameNumber)
            .locator('#field-access-table')
            .first()
            .getByRole('row', { name: roleName })
            .locator('[data-permission-type="update"]'),
      roleReadCheckbox:
        (roleName: string, frameNumber: number = 0): Target =>
        (page: Page) =>
          modalFrame(page, frameNumber)
            .locator('#field-access-table')
            .first()
            .getByRole('row', { name: roleName })
            .locator('[data-permission-type="read"]'),
    },
    saveButton: (page: Page) => page.getByRole('button', { name: 'Save', exact: true }).last(),
  },
};
