import { Page } from '@playwright/test';
import { SurveyGeneralTab } from '../../componentObjectModels/tabs/surveyGeneralTab';
import { SurveyLayoutTab } from '../../componentObjectModels/tabs/surveyLayoutTab';
import { BASE_URL } from '../../playwright.config';
import { BaseAppOrSurveyAdminPage } from '../baseAppOrSurveyAdminPage';

export class SurveyAdminPage extends BaseAppOrSurveyAdminPage {
  readonly path: string;
  readonly pathRegex: RegExp;

  readonly generalTab: SurveyGeneralTab;
  readonly layoutTab: SurveyLayoutTab;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Survey/';
    this.pathRegex = new RegExp(`${BASE_URL}${this.path}[0-9]+`);
    this.generalTab = new SurveyGeneralTab(page);
    this.layoutTab = new SurveyLayoutTab(page);
  }

  getIdFromUrl(): number {
    if (this.page.url().includes(this.path) === false) {
      throw new Error('The current page is not a survey admin page.');
    }

    const url = this.page.url();
    const urlParts = url.split('/');
    const surveyId = urlParts[urlParts.length - 1];
    return parseInt(surveyId);
  }
}
