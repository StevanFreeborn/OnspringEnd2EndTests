import { Page } from '@playwright/test';
import { Target } from '@stevanfreeborn/screenplay-playwright';
import { FieldTargets } from './fields.targets.js';

const surveyAnswerFieldDialog = (page: Page) => page.getByRole('dialog', { name: 'Add Survey Answer Field' });

export const SurveyAnswerFieldTargets = {
  dialog: surveyAnswerFieldDialog,
  addSurveyAnswerFieldPathRegex: /\/Admin\/App\/\d+\/Field\/AddSurveyAnswerField/,
  questionRadioByText:
    (questionText: string): Target =>
    (page: Page) =>
      surveyAnswerFieldDialog(page)
        .getByRole('row')
        .filter({ hasText: questionText })
        .first()
        .locator('input[type="radio"]'),
  continueButton: (page: Page) => surveyAnswerFieldDialog(page).getByRole('button', { name: 'Continue' }),
  modal: {
    descriptionEditor:
      (frameNumber: number = 1): Target =>
      (page: Page) =>
        FieldTargets.modal.frame(frameNumber)(page).locator('#Description + .content-area[contenteditable="true"]'),
  },
};
