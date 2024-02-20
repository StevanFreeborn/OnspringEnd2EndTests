import { Locator, Page } from '@playwright/test';
import { toPascalCase } from '../../utils';
import { FieldType } from '../menus/addFieldTypeMenu';

export type BaseGetParams = {
  tabName: string | undefined;
  sectionName: string;
};

export type GetObjectParams = BaseGetParams & {
  objectName: string;
};

export type BaseGetFieldParams = BaseGetParams & {
  fieldName: string;
};

export type GetFieldParams = BaseGetFieldParams & {
  fieldType: FieldType;
};

export class BaseForm {
  protected page: Page;
  readonly contentContainer: Locator;
  createFormControlSelector(field: string, controlSelector = 'input') {
    const pascalCaseFieldName = toPascalCase(field);
    return `.data-${pascalCaseFieldName} ${controlSelector}`;
  }

  protected constructor(contentContainer: Locator) {
    this.page = contentContainer.page();
    this.contentContainer = contentContainer;
  }

  protected async getReadOnlyField({ tabName, sectionName, fieldName, fieldType }: GetFieldParams) {
    const section = await this.getSection(tabName, sectionName);

    let locator: string;

    switch (fieldType) {
      case 'Reference':
        locator = this.createFormControlSelector(fieldName, 'div.type-reference');
        break;
      case 'Attachment':
        locator = this.createFormControlSelector(fieldName, 'div.type-attachment');
        break;
      case 'Image':
        locator = this.createFormControlSelector(fieldName, 'div.type-image');
        break;
      default:
        locator = this.createFormControlSelector(fieldName, 'div.data-text-only');
        break;
    }

    return section.locator(locator).first();
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

  async getSection(tabName: string | undefined, sectionName: string) {
    if (tabName === undefined) {
      return this.contentContainer.locator('section.section').filter({ hasText: sectionName }).first();
    }

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
