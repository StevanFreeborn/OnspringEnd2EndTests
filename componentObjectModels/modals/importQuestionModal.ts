import { Locator, Page } from '@playwright/test';

export class ImportQuestionModal {
  private readonly page: Page;
  private readonly surveySourceSelect: Locator;
  private readonly questionsToImportFilterInput: Locator;
  private readonly searchPathRegex: RegExp;
  private readonly searchResults: Locator;
  readonly importButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.surveySourceSelect = page.getByRole('listbox', { name: 'Survey Source' });
    this.questionsToImportFilterInput = page
      .getByRole('dialog', { name: 'Import Question' })
      .getByPlaceholder('Filter');
    this.searchPathRegex = /\/Admin\/App\/\d+\/SurveyPageItem\/GetItemImportSearchResults/;
    this.searchResults = page.locator('div.grid-search-results:visible');
    this.importButton = page.getByRole('button', { name: 'Import' });
  }

  async selectQuestionToImport(surveyName: string, questionId: string) {
    const searchResultRow = this.searchResults.getByRole('row', { name: questionId });
    const scrollableElement = this.searchResults.locator('.k-grid-content.k-auto-scrollable').first();

    await this.surveySourceSelect.click();
    await this.page.getByRole('option', { name: surveyName }).click();

    await this.questionsToImportFilterInput.pressSequentially(questionId, { delay: 125 });
    await this.page.waitForResponse(this.searchPathRegex);

    let isVisible = await searchResultRow.isVisible();

    while (isVisible === false) {
      await scrollableElement.evaluate(el => (el.scrollTop = el.scrollHeight));
      isVisible = await searchResultRow.isVisible();
    }

    await searchResultRow.getByRole('checkbox').click();
    await this.searchResults.getByRole('button', { name: 'Select', exact: true }).click();
  }
}
