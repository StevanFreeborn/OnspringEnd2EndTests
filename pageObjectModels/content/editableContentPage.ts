import { Locator, Page } from '@playwright/test';
import { DateFieldControl } from '../../componentObjectModels/controls/dateFieldControl';
import { FieldType } from '../../componentObjectModels/menus/addFieldTypeMenu';
import { BaseContentPage } from './baseContentPage';

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
export class EditableContentPage extends BaseContentPage {
  constructor(page: Page) {
    super(page);
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
