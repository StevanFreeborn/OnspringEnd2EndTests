import { FrameLocator, Locator, Page } from '@playwright/test';
import { FrameOwner } from '../common/controls/frameOwner.js';

const designerFrame = (page: Page): FrameLocator =>
  page
    .getByRole('dialog', { name: /Survey Designer/ })
    .frameLocator('iframe')
    .first();

export const surveyDesignerFrameOwner: FrameOwner = (page: Page) => designerFrame(page);

export type ListValuesGridPosition = 'first' | 'last';

const listValuesGrid = (page: Page, position: ListValuesGridPosition): Locator =>
  position === 'first'
    ? designerFrame(page).locator('.list-values').first()
    : designerFrame(page).locator('.list-values').last();

export const AutoSaveDialogTargets = {
  dialog: (page: Page): Locator => page.getByRole('dialog', { name: 'Working with Autosave' }),
  dismissCheckbox: (page: Page): Locator => page.getByLabel("Don't show me this again"),
  closeButton: (page: Page): Locator => page.getByRole('button', { name: 'Close' }),
};

export const AddOrEditSurveyPageModalTargets = {
  modal: (page: Page): Locator => page.getByRole('dialog', { name: /Add Page|Page Properties/ }),
  nameInput: (page: Page): Locator => page.getByRole('dialog', { name: /Add Page|Page Properties/ }).getByLabel('Name'),
  descriptionEditor: (page: Page): Locator =>
    page.getByRole('dialog', { name: /Add Page|Page Properties/ }).locator('.content-area.mce-content-body'),
  saveButton: (page: Page): Locator =>
    page.getByRole('dialog', { name: /Add Page|Page Properties/ }).getByRole('button', { name: 'Save' }),
};

export const ImportQuestionModalTargets = {
  searchPathRegex: /\/Admin\/App\/\d+\/SurveyPageItem\/GetItemImportSearchResults/,
  surveySourceSelect: (page: Page): Locator => page.getByRole('listbox', { name: 'Survey Source' }),
  surveySourceOption:
    (name: string) =>
    (page: Page): Locator =>
      page.getByRole('option', { name }),
  filterInput: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Import Question' }).getByPlaceholder('Filter'),
  searchResults: (page: Page): Locator => page.locator('div.grid-search-results:visible'),
  searchResultRow:
    (questionId: string) =>
    (page: Page): Locator =>
      page.locator('div.grid-search-results:visible').getByRole('row', { name: questionId }),
  searchResultCheckbox:
    (questionId: string) =>
    (page: Page): Locator =>
      page.locator('div.grid-search-results:visible').getByRole('row', { name: questionId }).getByRole('checkbox'),
  scrollableResults: (page: Page): Locator =>
    page.locator('div.grid-search-results:visible').locator('.k-grid-content.k-auto-scrollable').first(),
  selectButton: (page: Page): Locator =>
    page.locator('div.grid-search-results:visible').getByRole('button', { name: 'Select', exact: true }),
  importButton: (page: Page): Locator => page.getByRole('button', { name: 'Import' }),
};

export const SurveyDesignerTargets = {
  savePageSortPathRegex: /\/Admin\/App\/\d+\/SurveyPage\/\d+\/SavePageSort/,
  saveItemSortPathRegex: /\/Admin\/App\/\d+\/SurveyPageItem\/SaveItemSort/,
  movePageItemPathRegex: /\/Admin\/App\/\d+\/SurveyPageItem\/Move/,

  modal: (page: Page): Locator => page.getByRole('dialog', { name: /Survey Designer/ }),

  attachmentButton: (page: Page): Locator => designerFrame(page).getByRole('button', { name: 'Attachment' }),
  dateButton: (page: Page): Locator => designerFrame(page).getByRole('button', { name: 'Date/Time' }),
  numberButton: (page: Page): Locator => designerFrame(page).getByRole('button', { name: 'Number' }),
  textButton: (page: Page): Locator => designerFrame(page).getByRole('button', { name: 'Text', exact: true }),
  singleSelectButton: (page: Page): Locator => designerFrame(page).getByRole('button', { name: 'Single Select' }),
  multiSelectButton: (page: Page): Locator => designerFrame(page).getByRole('button', { name: 'Multi-Select' }),
  likertScaleButton: (page: Page): Locator => designerFrame(page).getByRole('button', { name: 'Likert Scale' }),
  matrixButton: (page: Page): Locator => designerFrame(page).getByRole('button', { name: 'Matrix' }),
  referenceButton: (page: Page): Locator => designerFrame(page).getByRole('button', { name: 'Reference' }),

  previewButton: (page: Page): Locator => designerFrame(page).getByRole('link', { name: 'Preview' }),
  saveIndicator: (page: Page): Locator => designerFrame(page).locator('#record-status .animation'),
  importQuestionButton: (page: Page): Locator => designerFrame(page).getByRole('button', { name: 'Import Question' }),
  addPageButton: (page: Page): Locator => designerFrame(page).getByRole('button', { name: 'Add Page' }),

  pageItem:
    (pageName: string) =>
    (page: Page): Locator =>
      designerFrame(page).locator('#page-list [data-page-id]', { hasText: pageName }),
  pageDragHandle:
    (pageName: string) =>
    (page: Page): Locator =>
      designerFrame(page).locator('#page-list [data-page-id]', { hasText: pageName }).locator('.page-drag'),
  pageMenuButton:
    (pageName: string) =>
    (page: Page): Locator =>
      designerFrame(page).locator('#page-list [data-page-id]', { hasText: pageName }).locator('.page-menu-button'),
  pageMenuEditPropertiesButton: (page: Page): Locator => designerFrame(page).getByText('Edit Properties'),
  pageMenuDeleteButton: (page: Page): Locator => designerFrame(page).getByText('Delete'),

  nthSurveyItem:
    (index: number) =>
    (page: Page): Locator =>
      designerFrame(page).locator('[data-item-id]').nth(index),
  surveyItemById:
    (itemId: string) =>
    (page: Page): Locator =>
      designerFrame(page).locator(`[data-item-id="${itemId}"]`),
  surveyItemByIdAndText:
    (itemId: string, text: string | RegExp) =>
    (page: Page): Locator =>
      designerFrame(page).locator(`[data-item-id="${itemId}"]`, { hasText: text }),
  surveyItemByText:
    (text: string | RegExp) =>
    (page: Page): Locator =>
      designerFrame(page).locator('.survey-item', { hasText: text }),
  surveyItemDataByText:
    (text: string | RegExp) =>
    (page: Page): Locator =>
      designerFrame(page).locator('[data-item-id]', { hasText: text }),
  surveyItemDisplay:
    (itemId: string) =>
    (page: Page): Locator =>
      designerFrame(page).locator(`[data-item-id="${itemId}"]`).locator('.display-item'),
  surveyItemDragBar:
    (itemId: string) =>
    (page: Page): Locator =>
      designerFrame(page).locator(`[data-item-id="${itemId}"]`).locator('.drag-bar'),
  surveyItemDuplicateButton:
    (itemId: string, text: string | RegExp) =>
    (page: Page): Locator =>
      designerFrame(page).locator(`[data-item-id="${itemId}"]`, { hasText: text }).getByTitle('Duplicate Question'),
  surveyItemDeleteButton:
    (itemId: string, text?: string | RegExp) =>
    (page: Page): Locator =>
      text
        ? designerFrame(page).locator(`[data-item-id="${itemId}"]`, { hasText: text }).getByTitle('Delete Question')
        : designerFrame(page).locator(`[data-item-id="${itemId}"]`).getByTitle('Delete Question'),
  surveyItemMoveButton:
    (itemId: string) =>
    (page: Page): Locator =>
      designerFrame(page).locator(`[data-item-id="${itemId}"]`).getByTitle('Move Question'),
  moveToPageMenuOption:
    (pageName: string) =>
    (page: Page): Locator =>
      designerFrame(page).locator('#move-to-page-menu').getByText(pageName),
  editingSurveyItem: (page: Page): Locator => designerFrame(page).locator('.survey-item.edit-mode'),
  editingSurveyItemByText:
    (text: string | RegExp) =>
    (page: Page): Locator =>
      designerFrame(page).locator('.survey-item.edit-mode', { hasText: text }),
  editingDragBar: (page: Page): Locator => designerFrame(page).locator('.survey-item.edit-mode .drag-bar'),
};

export const SurveyQuestionFormTargets = {
  questionTextFocusTarget: (page: Page): Locator => designerFrame(page).locator('#QuestionText'),
  questionTextEditor: (page: Page): Locator => designerFrame(page).getByLabel('Question Text'),
  questionIdInput: (page: Page): Locator => designerFrame(page).getByLabel('Question Id'),
  requiredCheckbox: (page: Page): Locator => designerFrame(page).getByLabel('Required'),
  correctnessCheckbox: (page: Page): Locator => designerFrame(page).getByLabel('Correctness'),
  relateToContentCheckbox: (page: Page): Locator => designerFrame(page).getByLabel('Relate to Content'),
  helpTextEditor: (page: Page): Locator => designerFrame(page).locator('.content-area.mce-content-body').last(),
  dragBar: (page: Page): Locator => designerFrame(page).locator('.survey-item.edit-mode .drag-bar'),
};

export const SurveyFormattedTextFormTargets = {
  dragBar: (page: Page): Locator => designerFrame(page).locator('.survey-item.edit-mode .drag-bar'),
  formattedTextEditor: (page: Page): Locator => designerFrame(page).locator('.content-area.mce-content-body'),
  objectIdInput: (page: Page): Locator => designerFrame(page).getByLabel('Object Id'),
};

export const SurveyListValuesGridTargets = {
  addValueButton:
    (position: ListValuesGridPosition) =>
    (page: Page): Locator =>
      listValuesGrid(page, position).getByRole('button', { name: 'Add Value' }),
  rows:
    (position: ListValuesGridPosition) =>
    (page: Page): Locator =>
      listValuesGrid(page, position).locator('div.k-grid-content').getByRole('row'),
  lastRow:
    (position: ListValuesGridPosition) =>
    (page: Page): Locator =>
      listValuesGrid(page, position).locator('div.k-grid-content').getByRole('row').last(),
  lastRowValueInput:
    (position: ListValuesGridPosition) =>
    (page: Page): Locator =>
      listValuesGrid(page, position)
        .locator('div.k-grid-content')
        .getByRole('row')
        .last()
        .locator('td[data-field="name"] input'),
  lastRowNumericValueInput:
    (position: ListValuesGridPosition) =>
    (page: Page): Locator =>
      listValuesGrid(page, position)
        .locator('div.k-grid-content')
        .getByRole('row')
        .last()
        .locator('td[data-field="numericValue"] input.k-formatted-value'),
  lastRowColorPicker:
    (position: ListValuesGridPosition) =>
    (page: Page): Locator =>
      listValuesGrid(page, position)
        .locator('div.k-grid-content')
        .getByRole('row')
        .last()
        .locator('td[data-field="color"] span.k-colorpicker'),
  lastRowDeleteButton:
    (position: ListValuesGridPosition) =>
    (page: Page): Locator =>
      listValuesGrid(page, position)
        .locator('div.k-grid-content')
        .getByRole('row')
        .last()
        .getByTitle('Delete List Value'),
};

export const SurveyReferenceQuestionFormTargets = {
  getSurveyAnswerValuesPathRegex: /\/Admin\/App\/\d+\/SurveyReference\/GetListPage/,
  appReferenceSelect: (page: Page): Locator => designerFrame(page).getByRole('listbox', { name: 'App Reference' }),
  appReferenceOption:
    (name: string) =>
    (page: Page): Locator =>
      designerFrame(page).getByRole('option', { name }),
  addAllValuesButton: (page: Page): Locator =>
    designerFrame(page).locator('.list-values').first().getByRole('button', { name: 'Add All Values' }),
  rows: (page: Page): Locator =>
    designerFrame(page).locator('.list-values').first().locator('.k-grid-content').getByRole('row'),
  lastRow: (page: Page): Locator =>
    designerFrame(page).locator('.list-values').first().locator('.k-grid-content').getByRole('row').last(),
  lastRowDeleteButton: (page: Page): Locator =>
    designerFrame(page)
      .locator('.list-values')
      .first()
      .locator('.k-grid-content')
      .getByRole('row')
      .last()
      .getByTitle('Delete'),
  addAllValuesModal: {
    dialog: (page: Page): Locator => page.getByRole('dialog', { name: 'Add All Values' }),
    okButton: (page: Page): Locator =>
      page.getByRole('dialog', { name: 'Add All Values' }).getByRole('button', { name: 'Ok' }),
    closeButton: (page: Page): Locator =>
      page.getByRole('dialog', { name: 'Add All Values' }).getByRole('button', { name: 'Close' }),
  },
};
