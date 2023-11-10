import { Locator, Page } from '@playwright/test';
import { toPascalCase } from '../../utils';

export type BaseGetParams = {
  tabName: string;
  sectionName: string;
};

export type GetObjectParams = BaseGetParams & {
  objectName: string;
};

export class BaseForm {
  protected page: Page;
  readonly contentContainer: Locator;
  createFormControlSelector(field: string, controlSelector = 'input') {
    const pascalCaseFieldName = toPascalCase(field);
    return `td.data-${pascalCaseFieldName} ${controlSelector}`;
  }

  protected constructor(contentContainer: Locator) {
    this.page = contentContainer.page();
    this.contentContainer = contentContainer;
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

  async getObject(params: GetObjectParams) {
    const section = await this.getSection(params.tabName, params.sectionName);
    return section.locator(`td.object-cell-${params.objectName}`).first();
  }
}
