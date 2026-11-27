export type Orientation = 'Portrait' | 'Landscape';

export enum FieldTypeEnum {
  DateTime = 'Date/Time',
  List = 'List',
  Number = 'Number',
  Text = 'Text',
  Attachment = 'Attachment',
  Image = 'Image',
  Reference = 'Reference',
  TimeSpan = 'Time Span',
  Formula = 'Formula',
  ParallelReference = 'Parallel Reference',
  AutoNumber = 'AutoNumber',
  System = 'System',
  SurveyAnswer = 'Survey Answer',
}

export type FieldType =
  | 'Date/Time'
  | 'List'
  | 'Number'
  | 'Text'
  | 'Attachment'
  | 'Image'
  | 'Reference'
  | 'Time Span'
  | 'Formula'
  | 'Parallel Reference'
  | 'AutoNumber'
  | 'System'
  | 'Survey Answer';

export type ObjectType = 'Formatted Text Block' | 'Section Label';

export type LayoutItemType = FieldType | ObjectType;
