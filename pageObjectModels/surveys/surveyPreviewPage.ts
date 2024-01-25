import { Page } from '@playwright/test';

export class SurveyPreviewPage {
  readonly page: Page;
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    this.page = page;
    this.pathRegex = /\/Survey\/\d+\/Preview/;
  }

  async goto(surveyId: number) {
    await this.page.goto(`/Survey/${surveyId}/Preview`);
  }

  getQuestion(itemId: string, questionText: string) {
    return this.page.locator(`.survey-item[data-item-id="${itemId}"]`, { hasText: new RegExp(questionText) });
  }
}
