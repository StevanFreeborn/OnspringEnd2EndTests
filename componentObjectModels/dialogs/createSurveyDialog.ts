import { Page } from '@playwright/test';
import { BaseCreateOrAddDialog } from './baseCreateOrAddDialog';

export class CreateSurveyDialog extends BaseCreateOrAddDialog {
  constructor(page: Page) {
    super(page);
  }

  getSurveyToCopy(surveyName: string) {
    return this.getItemToCopy(surveyName);
  }
}
