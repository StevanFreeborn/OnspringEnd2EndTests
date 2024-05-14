import { Locator, Page } from '@playwright/test';
import { SurveyResponsesGeneralTab } from '../../componentObjectModels/tabs/surveyResponsesGeneralTab';
import { BaseAdminPage } from '../baseAdminPage';

export class SurveyResponsesAdminPage extends BaseAdminPage {
  readonly pathRegex: RegExp;

  readonly configureSurveyLinK: Locator;

  readonly generalTabButton: Locator;

  readonly generalTab: SurveyResponsesGeneralTab;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/Survey\/[0-9]+/;

    this.configureSurveyLinK = this.page.getByRole('link', { name: 'Configure Survey' });

    this.generalTabButton = this.page.getByRole('tab', { name: 'General' });
    this.generalTab = new SurveyResponsesGeneralTab(page);
  }

  async goto(surveyId: number) {
    const path = `/Admin/Survey/${surveyId}`;
    await this.page.goto(path);
  }

  getIdFromUrl(): number {
    if (this.page.url().match(this.pathRegex) === null) {
      throw new Error('The current page is not a survey responses admin page.');
    }

    const url = this.page.url();
    const urlParts = url.split('/');
    const surveyId = urlParts[urlParts.length - 1];
    return parseInt(surveyId);
  }
}
