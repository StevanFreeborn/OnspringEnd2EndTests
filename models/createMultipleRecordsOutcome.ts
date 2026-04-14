import { Outcome, OutcomeObject } from './outcome';
import { RuleLogic } from './ruleLogic';

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
  definitions?: CustomBatchContentDefinition[];
};

export class CmroOnSaveWithCustomBatchOutcome extends CreateMultipleRecordsOnSaveOutcome {
  readonly definitions: CustomBatchContentDefinition[];

  constructor({ status, description = '', definitions = [] }: CmroOnSaveWithCustomBatchOutcomeObject) {
    super({ status, description, batchType: 'Custom Batch' });
    this.definitions = definitions;
  }

  clone(): CmroOnSaveWithCustomBatchOutcome {
    return new CmroOnSaveWithCustomBatchOutcome({
      status: this.status,
      description: this.description,
      definitions: this.definitions.map(d => d.clone()),
    });
  }
}

type CmroOnSaveWithDefinedLibraryOutcomeObject = Omit<
  CreateMultipleRecordsOnSaveOutcomeObject,
  'batchType' | 'frequency'
> & {
  definitions?: DefinedLibraryContentDefinition[];
};

export class CmroOnSaveWithDefinedLibraryOutcome extends CreateMultipleRecordsOnSaveOutcome {
  definitions: DefinedLibraryContentDefinition[];

  constructor({ status, description = '', definitions = [] }: CmroOnSaveWithDefinedLibraryOutcomeObject) {
    super({ status, description, batchType: 'Defined Library Copy' });
    this.definitions = definitions;
  }

  clone(): CmroOnSaveWithDefinedLibraryOutcome {
    return new CmroOnSaveWithDefinedLibraryOutcome({
      status: this.status,
      description: this.description,
      definitions: this.definitions.map(d => d.clone()),
    });
  }
}

export class CmroOnSaveWithDynamicLibraryOutcome extends CreateMultipleRecordsOnSaveOutcome {
  definitions: DynamicLibraryContentDefinition[];

  constructor({ status, description = '', definitions = [] }: CmroOnSaveWithDefinedLibraryOutcomeObject) {
    super({ status, description, batchType: 'Dynamic Library Copy' });
    this.definitions = definitions;
  }

  clone(): CmroOnSaveWithDynamicLibraryOutcome {
    return new CmroOnSaveWithDynamicLibraryOutcome({
      status: this.status,
      description: this.description,
      definitions: this.definitions.map(d => d.clone()),
    });
  }
}

type ContentDefinitionObject = {
  targetApp: string;
  layout?: string;
};

export abstract class ContentDefinition {
  targetApp: string;
  layout: string;

  constructor({ targetApp, layout = 'Default Layout' }: ContentDefinitionObject) {
    this.targetApp = targetApp;
    this.layout = layout;
  }

  abstract clone(): ContentDefinition;
}

type CustomBatchContentDefinitionObject = ContentDefinitionObject & {
  batchRecordName: string;
  description?: string;
};

export class CustomBatchContentDefinition extends ContentDefinition {
  batchRecordName: string;
  description: string;

  constructor({ batchRecordName, description = '', targetApp, layout }: CustomBatchContentDefinitionObject) {
    super({ targetApp, layout });
    this.batchRecordName = batchRecordName;
    this.description = description;
  }

  clone(): CustomBatchContentDefinition {
    return new CustomBatchContentDefinition({
      batchRecordName: this.batchRecordName,
      description: this.description,
      targetApp: this.targetApp,
      layout: this.layout,
    });
  }
}

type LibraryContentDefinitionObject = ContentDefinitionObject & {
  sourceApp: string;
  dataFilterLogic: RuleLogic;
  dynamicFilter?: boolean;
  dynamicFilterFields?: string[];
};

export abstract class LibraryContentDefinition extends ContentDefinition {
  sourceApp: string;
  dataFilterLogic: RuleLogic;
  dynamicFilter: boolean;
  dynamicFilterFields: string[];

  constructor({
    sourceApp,
    dataFilterLogic,
    dynamicFilter = false,
    dynamicFilterFields = [],
    targetApp,
    layout,
  }: LibraryContentDefinitionObject) {
    super({ targetApp, layout });
    this.sourceApp = sourceApp;
    this.dataFilterLogic = dataFilterLogic;
    this.dynamicFilter = dynamicFilter;
    this.dynamicFilterFields = dynamicFilterFields;
  }

  abstract clone(): LibraryContentDefinition;
}

export class DefinedLibraryContentDefinition extends LibraryContentDefinition {
  constructor({
    sourceApp,
    dataFilterLogic,
    dynamicFilter,
    dynamicFilterFields,
    targetApp,
    layout,
  }: LibraryContentDefinitionObject) {
    super({ sourceApp, dataFilterLogic, dynamicFilter, dynamicFilterFields, targetApp, layout });
  }

  clone(): DefinedLibraryContentDefinition {
    return new DefinedLibraryContentDefinition({
      sourceApp: this.sourceApp,
      dataFilterLogic: this.dataFilterLogic.clone(),
      dynamicFilter: this.dynamicFilter,
      dynamicFilterFields: [...this.dynamicFilterFields],
      targetApp: this.targetApp,
      layout: this.layout,
    });
  }
}

export class DynamicLibraryContentDefinition extends LibraryContentDefinition {
  constructor({
    sourceApp,
    dataFilterLogic,
    dynamicFilter,
    dynamicFilterFields,
    targetApp,
    layout,
  }: LibraryContentDefinitionObject) {
    super({ sourceApp, dataFilterLogic, dynamicFilter, dynamicFilterFields, targetApp, layout });
  }

  clone(): DynamicLibraryContentDefinition {
    return new DynamicLibraryContentDefinition({
      sourceApp: this.sourceApp,
      dataFilterLogic: this.dataFilterLogic.clone(),
      dynamicFilter: this.dynamicFilter,
      dynamicFilterFields: [...this.dynamicFilterFields],
      targetApp: this.targetApp,
      layout: this.layout,
    });
  }
}
