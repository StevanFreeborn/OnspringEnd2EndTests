import { Locator, Page } from '@playwright/test';

export class SurveyPreviewPage {
  readonly page: Page;
  readonly pathRegex: RegExp;
  readonly nextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pathRegex = /\/Survey\/\d+\/Preview/;
    this.nextButton = page.getByRole('link', { name: 'Next' });
  }

  async goto(surveyId: number) {
    await this.page.goto(`/Survey/${surveyId}/Preview`);
  }

  /**
   * Gets the locator for the question with the given item id.
   * @param itemId The item id of the question to get.
   * @param questionText The text of the question to get.
   * @returns The locator for the question with the given item id.
   */
  getQuestion(itemId: string, questionText: string) {
    return this.page.locator(`.survey-item[data-item-id="${itemId}"]`, { hasText: new RegExp(questionText) });
  }

  /**
   * Checks if the question with the given item id is above the question with the given item id.
   * @param itemIdToCheck The item id of the question to check.
   * @param itemIdToCheckAgainst The item id of the question to check against.
   * @returns True if the question with the given item id is above the question with the given item id, false otherwise.
   * @throws An error if the question with the given item id does not exist.
   * @throws An error if the question with the given item id to check against does not exist.
   */
  async questionIsAbove(itemIdToCheck: string, itemIdToCheckAgainst: string) {
    const itemToCheck = this.page.locator(`.survey-item[data-item-id="${itemIdToCheck}"]`);
    const itemToCheckAgainst = this.page.locator(`.survey-item[data-item-id="${itemIdToCheckAgainst}"]`);

    await itemToCheck.waitFor();
    await itemToCheckAgainst.waitFor();

    const itemToCheckBounds = await itemToCheck.boundingBox();
    const itemToCheckAgainstBounds = await itemToCheckAgainst.boundingBox();

    if (itemToCheckBounds === null) {
      throw new Error(`Item to check with id ${itemIdToCheck} does not exist.`);
    }

    if (itemToCheckAgainstBounds === null) {
      throw new Error(`Item to check against with id ${itemIdToCheckAgainst} does not exist.`);
    }

    return itemToCheckBounds.y < itemToCheckAgainstBounds.y;
  }
}
