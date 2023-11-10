import { Page } from '@playwright/test';
import { AddOrEditRecordForm } from '../../componentObjectModels/forms/addOrEditRecordForm';
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

export type GetAttachmentFieldParams = BaseGetFieldParams & {
  fieldType: 'Attachment';
};

export type GetReferenceFieldParams = BaseGetFieldParams & {
  fieldType: 'Reference';
};

export class EditableContentPage extends BaseContentPage {
  readonly form: AddOrEditRecordForm;

  protected constructor(page: Page) {
    super(page);
    this.form = new AddOrEditRecordForm(this.contentContainer);
  }
}
