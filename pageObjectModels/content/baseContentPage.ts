import { Locator, Page } from '@playwright/test';
import { BaseFormPage } from '../baseFormPage';
import { FieldType } from './../../componentObjectModels/menus/addFieldTypeMenu';

export type GetFieldParams = {
  tabName: string;
  sectionName: string;
  fieldName: string;
  fieldType: FieldType;
};

export class BaseContentPage extends BaseFormPage {
  private readonly contentContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.contentContainer = page.locator('div.contentContainer').first();
  }

  async getTabOrientation() {
    const contentContainerClasses = await this.contentContainer.getAttribute('class');
    return contentContainerClasses?.includes('vertical-tabs') ? 'vertical' : 'horizontal';
  }

  async getTabButton(tabName: string) {
    const tabOrientation = await this.getTabOrientation();

    if (tabOrientation === 'vertical') {
      return this.contentContainer.locator('section.tab').locator('h1').filter({ hasText: tabName }).first();
    }

    return this.contentContainer.getByRole('tab').filter({ hasText: tabName }).first();
  }

  async getTab(tabName: string) {
    const tabOrientation = await this.getTabOrientation();

    if (tabOrientation === 'vertical') {
      return this.contentContainer
        .locator('section.tab')
        .filter({
          has: this.contentContainer.locator('h1').filter({ hasText: tabName }),
        })
        .first();
    }

    const tabButton = await this.getTabButton(tabName);
    const tabId = await tabButton.getAttribute('data-tab-id');
    return this.contentContainer.locator(`section[data-tab-id="${tabId}"]`).first();
  }

  async getSection(tabName: string, sectionName: string) {
    const tab = await this.getTab(tabName);

    return tab
      .locator('section.section')
      .filter({
        has: this.page.locator('h1').filter({ hasText: sectionName }),
      })
      .first();
  }

  async getField({ tabName, sectionName, fieldName, fieldType }: GetFieldParams) {
    const section = await this.getSection(tabName, sectionName);

    let locator: string;

    switch (fieldType) {
      default:
        locator = this.createFormControlSelector(fieldName);
        break;
    }

    return section.locator(locator).first();
  }
}
