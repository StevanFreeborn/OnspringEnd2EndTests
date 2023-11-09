import { Locator, Page } from '@playwright/test';
import { DateFieldControl } from '../../componentObjectModels/controls/dateFieldControl';
import { ImageFieldControl } from '../../componentObjectModels/controls/imageFieldControl';
import { TimeSpanFieldControl } from '../../componentObjectModels/controls/timeSpanFieldControl';
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

export type GetTimeSpanFieldParams = BaseGetFieldParams & {
  fieldType: 'Time Span';
};

export type GetImageFieldParams = BaseGetFieldParams & {
  fieldType: 'Image';
};

export class EditableContentPage extends BaseContentPage {
  constructor(page: Page) {
    super(page);
  }

  async getField(params: GetImageFieldParams): Promise<ImageFieldControl>;
  async getField(params: GetTimeSpanFieldParams): Promise<TimeSpanFieldControl>;
  async getField(params: GetDateFieldParams): Promise<DateFieldControl>;
  async getField(params: GetFieldParams): Promise<Locator>;
  async getField(params: GetFieldParams) {
    const section = await this.getSection(params.tabName, params.sectionName);

    let locator: string;

    switch (params.fieldType) {
      case 'Image': {
        return new ImageFieldControl(
          section.locator(this.createFormControlSelector(params.fieldName, 'div.type-image')).first()
        );
      }
      case 'Time Span': {
        return new TimeSpanFieldControl(
          section.locator(this.createFormControlSelector(params.fieldName, 'div.timespan-base')).first()
        );
      }
      case 'List':
        return section.locator(this.createFormControlSelector(params.fieldName, 'div.type-list')).getByRole('listbox');
      case 'Date/Time': {
        const dateTimePicker = section
          .locator(this.createFormControlSelector(params.fieldName, 'span.k-datetimepicker'))
          .first();
        return new DateFieldControl(dateTimePicker);
      }
      case 'Formula':
        locator = this.createFormControlSelector(params.fieldName, 'div.data-text-only');
        break;
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
