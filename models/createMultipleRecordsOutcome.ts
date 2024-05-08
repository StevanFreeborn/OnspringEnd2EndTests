import { Outcome, OutcomeObject } from './outcome';

type CreateMultipleRecordsOutcomeFrequency = 'Always on save' | 'Only once per record' | 'For each new value added';

type BatchType = 'Custom Batch' | 'Defined Library Copy' | 'Dynamic Library Copy';

type CreateMultipleRecordsOutcomeObject = Omit<OutcomeObject, 'type'> & {
  frequency: CreateMultipleRecordsOutcomeFrequency;
  batchType: BatchType;
  definitions?: ContentDefinition[];
};

export abstract class CreateMultipleRecordsOutcome extends Outcome {
  readonly frequency: CreateMultipleRecordsOutcomeFrequency;
  readonly batchType: BatchType;
  readonly definitions: ContentDefinition[];

  constructor({ status, description, frequency, batchType, definitions = [] }: CreateMultipleRecordsOutcomeObject) {
    super({ type: 'Create Multiple Records', status, description });
    this.frequency = frequency;
    this.batchType = batchType;
    this.definitions = definitions;
  }
}

type CreateMultipleRecordsOnSaveOutcomeObject = Omit<CreateMultipleRecordsOutcomeObject, 'frequency'>;

abstract class CreateMultipleRecordsOnSaveOutcome extends CreateMultipleRecordsOutcome {
  constructor({ status, description = '', batchType }: CreateMultipleRecordsOnSaveOutcomeObject) {
    super({ status, description, frequency: 'Always on save', batchType });
  }
}

type CmroOnSaveWithCustomBatchOutcomeObject = Omit<
  CreateMultipleRecordsOnSaveOutcomeObject,
  'batchType' | 'frequency'
> & {
  definitions: CustomBatchContentDefinition[];
};

export class CmroOnSaveWithCustomBatchOutcome extends CreateMultipleRecordsOnSaveOutcome {
  readonly definitions: CustomBatchContentDefinition[];

  constructor({ status, description = '', definitions = [] }: CmroOnSaveWithCustomBatchOutcomeObject) {
    super({ status, description, batchType: 'Custom Batch' });
    this.definitions = definitions;
  }
}

export abstract class ContentDefinition {}

type CustomBatchContentDefinitionObject = {
  batchRecordName: string;
  description?: string;
  targetApp: string;
  layout?: string;
};

export class CustomBatchContentDefinition {
  batchRecordName: string;
  description: string;
  targetApp: string;
  layout: string;

  constructor({
    batchRecordName,
    description = '',
    targetApp,
    layout = 'Default Layout',
  }: CustomBatchContentDefinitionObject) {
    this.batchRecordName = batchRecordName;
    this.description = description;
    this.targetApp = targetApp;
    this.layout = layout;
  }
}
