import { Locator, Page } from '@playwright/test';
import { SurveyDesignTab } from '../../componentObjectModels/tabs/surveyDesignTab';
import { SurveyGeneralTab } from '../../componentObjectModels/tabs/surveyGeneralTab';
import { SurveyLayoutTab } from '../../componentObjectModels/tabs/surveyLayoutTab';
import { BASE_URL } from '../../playwright.config';
import { BaseAppOrSurveyAdminPage } from '../baseAppOrSurveyAdminPage';

export class SurveyAdminPage extends BaseAppOrSurveyAdminPage {
  readonly path: string;
  readonly pathRegex: RegExp;

  readonly configureResponseAppLink: Locator;

  readonly designTabButton;

  readonly generalTab: SurveyGeneralTab;
  readonly designTab: SurveyDesignTab;
  readonly layoutTab: SurveyLayoutTab;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Survey/';
    this.pathRegex = new RegExp(`${BASE_URL}${this.path}[0-9]+`);

    this.configureResponseAppLink = page.getByRole('link', { name: 'Configure Response App' });

    this.designTabButton = page.locator('#tab-strip').getByText('Design');

    this.generalTab = new SurveyGeneralTab(page);
    this.designTab = new SurveyDesignTab(page);
    this.layoutTab = new SurveyLayoutTab(page);
  }

  async goto(surveyId: number) {
    const path = `${this.path}${surveyId}`;
    await this.page.goto(path);
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
