import { Page } from '@playwright/test';
import { BASE_URL } from '../../playwright.config';
import { BaseContentPage } from './baseContentPage';
import { GetFieldParams } from './editableContentPage';

export class ViewContentPage extends BaseContentPage {
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.pathRegex = new RegExp(`${BASE_URL}/Content/[0-9]+/[0-9]+/View`);
  }

  async goto(appId: number, recordId: number) {
    await this.page.goto(`/Content/${appId}/${recordId}/View`);
  }

  async getField({ tabName, sectionName, fieldName, fieldType }: GetFieldParams) {
    const section = await this.getSection(tabName, sectionName);

    let locator: string;

    switch (fieldType) {
      default:
        locator = this.createFormControlSelector(fieldName, 'div.data-text-only');
        break;
    }

    return section.locator(locator).first();
  }
}
