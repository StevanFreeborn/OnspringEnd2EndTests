import { Page } from '@playwright/test';

export class BaseDesignerTab {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getAddButton(buttonTitle: string) {
    return this.page.getByTitle(buttonTitle);
  }

  getFilterInput(placeholder: string) {
    return this.page.getByPlaceholder(placeholder);
  }
}
