import { Locator, Page } from '@playwright/test';
import { BaseCreateOrAddDialog } from './baseCreateOrAddDialog';

export class CreateSurveyDialog extends BaseCreateOrAddDialog {
  readonly copyResponsesAppCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    this.copyResponsesAppCheckbox = this.page.getByLabel('Copy Responses app also');
  }

  getSurveyToCopy(surveyName: string) {
    return this.getItemToCopy(surveyName);
  }
}
