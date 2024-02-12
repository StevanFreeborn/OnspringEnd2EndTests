import { Page } from '@playwright/test';
import { BaseDeleteDialog } from './baseDeleteDialog';

export class DeleteSurveyPageDialog extends BaseDeleteDialog {
  constructor(page: Page) {
    super(page);
  }
}
