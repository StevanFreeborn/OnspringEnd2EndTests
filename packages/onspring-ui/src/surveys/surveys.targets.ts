import { Locator, Page } from '@playwright/test';

export const SurveysPageTargets = {
  route: '/Admin/Survey',
  getSurveysListPath: '/Admin/Survey/SurveyListRead',
  readSurveyListPathRegex: /\/Admin\/Survey\/SurveyListRead/,
  deleteSurveyPathRegex: /\/Admin\/Survey\/\d+\/Delete/,
  createSurveyButton: (page: Page): Locator => page.locator('.create-button'),
  surveyGrid: (page: Page): Locator => page.locator('#grid'),
  surveyRow:
    (name: string | RegExp) =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).first(),
  deleteSurveyButtonForRow:
    (name: string | RegExp) =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).first().getByTitle('Delete Survey'),
  deleteConfirmationInput: (page: Page): Locator => page.getByLabel('Delete Survey').getByRole('textbox'),
  deleteSurveyDialog: (page: Page): Locator =>
    page.locator('.ui-dialog:has(.ui-dialog-title:has-text("Delete Survey"))'),
};

export const CreateSurveyDialogTargets = {
  copyResponsesAppCheckbox: (page: Page): Locator => page.getByLabel('Copy Responses app also'),
};

export const CreateSurveyModalTargets = {
  nameInput: (page: Page): Locator => page.getByLabel('Name'),
  saveButton: (page: Page): Locator => page.getByRole('button', { name: 'Save' }),
};

export const SurveyDetailTargets = {
  pathPrefix: '/Admin/Survey/',
  pathRegex: /\/Admin\/Survey\/\d+/,
  designPathRegex: /\/Admin\/Survey\/\d+\/Design/,
  configureResponseAppLink: (page: Page): Locator => page.getByRole('link', { name: 'Configure Response App' }),
  configureSurveyLink: (page: Page): Locator => page.getByRole('link', { name: 'Configure Survey' }),
  generalTabButton: (page: Page): Locator => page.locator('#tab-strip').getByText('General'),
  designTabButton: (page: Page): Locator => page.locator('#tab-strip').getByText('Design'),
  campaignsTabButton: (page: Page): Locator => page.locator('#tab-strip').getByText('Campaigns'),
  layoutTabButton: (page: Page): Locator => page.locator('#tab-strip').getByText('Layout'),
  designSurveyLink: (page: Page): Locator => page.getByRole('link', { name: 'Design Survey' }),
};

export const SurveyPreviewTargets = {
  pathRegex: /\/Survey\/\d+\/Preview/,
  route: (surveyId: number): string => `/Survey/${surveyId}/Preview`,
  pageSelect: (page: Page): Locator => page.locator('#page-selector-cell .k-dropdown'),
  nextButton: (page: Page): Locator => page.getByRole('link', { name: 'Next' }),
  completeAndSubmitButton: (page: Page): Locator => page.getByRole('link', { name: 'Complete & Submit' }),
  questionByItemId:
    (itemId: string) =>
    (page: Page): Locator =>
      page.locator(`.survey-item[data-item-id="${itemId}"]`),
  question:
    (itemId: string, questionText: string) =>
    (page: Page): Locator =>
      page.locator(`.survey-item[data-item-id="${itemId}"]`, { hasText: questionText }),
  text:
    (value: string | RegExp) =>
    (page: Page): Locator =>
      page.getByText(value),
};
