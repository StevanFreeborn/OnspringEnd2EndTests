import { Page } from '@playwright/test';
import { BaseCreateOrAddDialogWithOkButton } from './baseCreateOrAddDialog';

export class AddSurveyPageDialog extends BaseCreateOrAddDialogWithOkButton {
  constructor(page: Page) {
    super(page);
  }

  getSurveyPageToCopy(surveyPageName: string) {
    return this.getItemToCopy(surveyPageName);
  }
}
