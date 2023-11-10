import { Locator } from '@playwright/test';
import { toPascalCase } from '../../utils';
import { AttachmentFieldControl } from '../controls/attachmentFieldControl';
import { DateFieldControl } from '../controls/dateFieldControl';
import { ImageFieldControl } from '../controls/imageFieldControl';
import { ReferenceFieldGrid } from '../controls/referenceFieldGrid';
import { TimeSpanFieldControl } from '../controls/timeSpanFieldControl';
import { FieldType } from '../menus/addFieldTypeMenu';
import { BaseForm } from './baseForm';

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

export type GetAttachmentFieldParams = BaseGetFieldParams & {
  fieldType: 'Attachment';
};

export type GetReferenceFieldParams = BaseGetFieldParams & {
  fieldType: 'Reference';
};

export class AddOrEditRecordForm extends BaseForm {
  readonly contentContainer: Locator;
  createFormControlSelector(field: string, controlSelector = 'input') {
    const pascalCaseFieldName = toPascalCase(field);
    return `td.data-${pascalCaseFieldName} ${controlSelector}`;
  }

  constructor(container: Locator) {
    super(container);
    this.contentContainer = container;
  }

  async getField(params: GetReferenceFieldParams): Promise<ReferenceFieldGrid>;
  async getField(params: GetAttachmentFieldParams): Promise<AttachmentFieldControl>;
  async getField(params: GetImageFieldParams): Promise<ImageFieldControl>;
  async getField(params: GetTimeSpanFieldParams): Promise<TimeSpanFieldControl>;
  async getField(params: GetDateFieldParams): Promise<DateFieldControl>;
  async getField(params: GetFieldParams): Promise<Locator>;
  async getField(params: GetFieldParams) {
    const section = await this.getSection(params.tabName, params.sectionName);

    let locator: string;

    switch (params.fieldType) {
      case 'Reference':
        return new ReferenceFieldGrid(
          section.locator(this.createFormControlSelector(params.fieldName, 'div.onx-reference-grid')).first()
        );
      case 'Attachment': {
        return new AttachmentFieldControl(
          section.locator(this.createFormControlSelector(params.fieldName, 'div.type-attachment')).first()
        );
      }
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
