import { Locator, Page } from '@playwright/test';
import { DateFieldControl } from '../../componentObjectModels/controls/dateFieldControl';
import { BaseFormPage } from '../baseFormPage';
import { FieldType } from './../../componentObjectModels/menus/addFieldTypeMenu';

export type BaseGetFieldParams = {
  tabName: string;
  sectionName: string;
  fieldName: string;
};

export type GetFieldParams = BaseGetFieldParams & {
  fieldType: FieldType;
};

export type GetDateFieldParams = BaseGetFieldParams & {
  fieldType: 'Date/Time';
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

  async getField(params: GetDateFieldParams): Promise<DateFieldControl>;
  async getField(params: GetFieldParams): Promise<Locator>;
  async getField(params: GetFieldParams) {
    const section = await this.getSection(params.tabName, params.sectionName);

    let locator: string;

    switch (params.fieldType) {
      case 'Date/Time': {
        const dateTimePicker = section
          .locator(this.createFormControlSelector(params.fieldName, 'span.k-datetimepicker'))
          .first();
        return new DateFieldControl(dateTimePicker, this.page);
      }
      case 'Number':
        locator = this.createFormControlSelector(params.fieldName, 'input[data-field-type="number"]');
        break;
      case 'Text':
        locator = this.createFormControlSelector(params.fieldName, 'input[data-field-type="textBox"]');
        break;
      default:
        locator = this.createFormControlSelector(params.fieldName);
        break;
    }

    return section.locator(locator).first();
  }
}
