import { Locator, Page } from '@playwright/test';
import { BaseCreateOrAddDialogWithContinueButton } from './baseCreateOrAddDialog';

export class CreateSurveyDialog extends BaseCreateOrAddDialogWithContinueButton {
  readonly copyResponsesAppCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    this.copyResponsesAppCheckbox = this.page.getByLabel('Copy Responses app also');
  }

  getSurveyToCopy(surveyName: string) {
    return this.getItemToCopy(surveyName);
  }
}
