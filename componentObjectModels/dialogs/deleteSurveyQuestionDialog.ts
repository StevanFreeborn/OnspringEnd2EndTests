import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteSurveyQuestionDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
