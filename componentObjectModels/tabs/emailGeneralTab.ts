import { Locator, Page } from '@playwright/test';
import { BaseMessageGeneralTab } from './baseMessageGeneralTab';

export class EmailGeneralTab extends BaseMessageGeneralTab {
  private readonly templateSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.templateSelect = page.getByRole('listbox', { name: 'Template' });
  }

  async selectTemplate(template: string) {
    await this.templateSelect.click();
    await this.templateSelect.page().locator('.k-list-optionlabel', { hasText: template }).click();
  }
}
