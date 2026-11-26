import { Locator, Page } from '@playwright/test';
import { KeyMetric } from '@stevanfreeborn/onspring-models';
import { Target } from '@stevanfreeborn/screenplay-playwright';

const designerFrame = (page: Page) => page.frameLocator('.dialog');
const keyMetricInBank = (page: Page, name: string): Locator =>
  designerFrame(page).locator('[data-tab-content="keymetric"] div.layoutItem').filter({ hasText: name }).first();
const lastKeyMetricInBank = (page: Page, name: string | RegExp): Locator =>
  designerFrame(page).locator('[data-tab-content="keymetric"] div.layoutItem').filter({ hasText: name }).last();
const keyMetricModal = (page: Page): Locator => page.getByRole('dialog', { name: 'Key Metric' });
const valueRangesGrid = (page: Page): Locator =>
  keyMetricModal(page).locator('.label:has-text("Value Ranges") + .data .color-stops');
const selectRecordDialog = (page: Page): Locator => page.getByRole('dialog', { name: 'Select a Record' });

export const KeyMetricTargets = {
  deletePathRegex: /\/Admin\/Dashboard\/DashboardObject\/\d+\/Delete/,
  addKeyMetricButton: (page: Page): Locator =>
    designerFrame(page).locator('.item-container').first().getByTitle('Add Key Metric'),
  addKeyMetricMenu: (page: Page): Locator => designerFrame(page).locator('[data-add-menu="keymetric"]'),
  addKeyMetricMenuOption:
    (keyMetricType: KeyMetric['type']): Target =>
    (page: Page): Locator =>
      designerFrame(page).locator('[data-add-menu="keymetric"]').getByText(keyMetricType),
  editKeyMetricButtonInBank:
    (name: string): Target =>
    (page: Page): Locator =>
      keyMetricInBank(page, name).getByTitle('Edit Key Metric Properties'),
  deleteKeyMetricButtonInBank:
    (name: string): Target =>
    (page: Page): Locator =>
      keyMetricInBank(page, name).getByTitle('Delete Key Metric'),
  deleteLastKeyMetricButtonInBank:
    (name: string | RegExp): Target =>
    (page: Page): Locator =>
      lastKeyMetricInBank(page, name).getByTitle('Delete Key Metric'),

  modal: {
    savePathRegex:
      /(\/Admin\/Dashboard\/DashboardObject\/\d+\/EditKeyMetricObject)|(\/Admin\/Dashboard\/DashboardObject\/AddKeyMetricObject)/,
    dialog: (page: Page): Locator => keyMetricModal(page),
    generalTabButton: (page: Page): Locator => keyMetricModal(page).getByRole('tab', { name: 'General' }),
    objectNameInput: (page: Page): Locator =>
      keyMetricModal(page).locator('.label:has-text("Object Name") + .data').getByRole('textbox'),
    displayNameCheckbox: (page: Page): Locator =>
      keyMetricModal(page).locator('.label:has-text("Display Name") + .data').getByRole('checkbox'),
    displayNameInput: (page: Page): Locator => keyMetricModal(page).locator('#displayNameRow').getByRole('textbox'),
    descriptionEditor: (page: Page): Locator => keyMetricModal(page).locator('.content-area.mce-content-body'),

    keyMetricTabButton: (page: Page): Locator => keyMetricModal(page).getByRole('tab', { name: 'Key Metric' }),
    typeSelector: (page: Page): Locator =>
      keyMetricModal(page).locator('.label:has-text("Type") + td .data').getByRole('listbox'),
    appOrSurveySelector: (page: Page): Locator =>
      keyMetricModal(page).locator('.label:has-text("App/Survey") + td .data').getByRole('listbox'),
    fieldSourceSelector: (page: Page): Locator =>
      keyMetricModal(page).locator('.label:has-text("Field Source") + td .data').getByRole('listbox'),
    aggregateSelector: (page: Page): Locator =>
      keyMetricModal(page).locator('.label:has-text("Aggregate") + td .data').getByRole('listbox').first(),
    recordSelector: (page: Page): Locator =>
      keyMetricModal(page).locator('[data-related-record-field]').locator('.onx-selector').first(),
    recordFieldSelector: (page: Page): Locator =>
      keyMetricModal(page).locator('[data-content-record-field]').getByRole('listbox'),
    reportSelector: (page: Page): Locator => keyMetricModal(page).locator('[data-report-field]').getByRole('listbox'),
    needleDisplaySelector: (page: Page): Locator =>
      keyMetricModal(page).locator('.label:has-text("Needle Display") + td .data').getByRole('listbox'),
    centerDisplaySelector: (page: Page): Locator =>
      keyMetricModal(page).locator('.label:has-text("Center Display") + td .data').getByRole('listbox'),
    pointerDisplaySelector: (page: Page): Locator =>
      keyMetricModal(page).locator('.label:has-text("Pointer Display") + td .data').getByRole('listbox'),
    calculatedPercentageDisplaySelector: (page: Page): Locator =>
      keyMetricModal(page).locator('.label:has-text("Calculated Percentage Display") + td .data').getByRole('listbox'),
    colorDisplaySelector: (page: Page): Locator =>
      keyMetricModal(page).locator('.label:has-text("Color Display") + td .data').getByRole('listbox'),
    selectedColorPicker: (page: Page): Locator =>
      keyMetricModal(page).locator('.label:has-text("Selected Color") + .data .k-colorpicker'),
    labelInput: (page: Page): Locator =>
      keyMetricModal(page).locator('.label:has-text("Label") + .data').getByRole('textbox'),
    valueRangesAddButton: (page: Page): Locator => valueRangesGrid(page).getByRole('button', { name: 'Add Value' }),
    valueRangesLastRowRangeStopFirstInput: (page: Page): Locator =>
      valueRangesGrid(page).locator('tbody tr').last().locator('[data-field="rangeStop"] input').nth(0),
    valueRangesLastRowRangeStopSecondInput: (page: Page): Locator =>
      valueRangesGrid(page).locator('tbody tr').last().locator('[data-field="rangeStop"] input').nth(1),
    totalSourceTypePicker: (page: Page): Locator =>
      keyMetricModal(page).locator('.label:has-text("Total Source Type") + .data'),
    totalSourceTypeButton:
      (name: string): Target =>
      (page: Page): Locator =>
        page.getByRole('button', { name }),
    totalValueInput: (page: Page): Locator =>
      keyMetricModal(page).locator('.label:has-text("Total Value") + .data input:visible'),

    securityTabButton: (page: Page): Locator => keyMetricModal(page).getByRole('tab', { name: 'Security' }),
    viewSelector: (page: Page): Locator =>
      keyMetricModal(page).locator('.label:has-text("View") + .data').getByRole('listbox'),
    rolesSelector: (page: Page): Locator => keyMetricModal(page).locator('.label:has-text("Roles") + .data'),
    saveButton: (page: Page): Locator => keyMetricModal(page).getByRole('button', { name: 'Save' }),
    pageOptionByName:
      (name: string): Target =>
      (page: Page): Locator =>
        page.getByRole('option', { name }),
  },

  selectRecordModal: {
    searchPathRegex: /Content\/ReferenceGrid\/SelectorForAppSearch/,
    dialog: (page: Page): Locator => selectRecordDialog(page),
    referenceGrid: (page: Page): Locator =>
      selectRecordDialog(page).frameLocator('iframe').locator('.onx-reference-grid'),
    searchResultsContainer: (page: Page): Locator =>
      selectRecordDialog(page).frameLocator('iframe').locator('.grid-search-results:visible'),
    okButton: (page: Page): Locator => selectRecordDialog(page).getByRole('button', { name: 'OK' }),
  },
};
