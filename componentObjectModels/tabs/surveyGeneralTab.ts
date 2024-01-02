import { Page } from '@playwright/test';
import { BaseAppOrSurveyGeneralTab } from './baseAppOrSurveyGeneralTab';

export class SurveyGeneralTab extends BaseAppOrSurveyGeneralTab {
  constructor(page: Page) {
    super(page);
  }
}
