import { Outcome, OutcomeObject } from './outcome';

type CreateOneRecordOutcomeFrequency =
  | 'Always on save'
  | 'Only once per record'
  | 'Based on a schedule'
  | 'For each new value added';

type CreateOneRecordOutcomeObject = Omit<OutcomeObject, 'type'> & {
  targetApp: string;
  frequency: CreateOneRecordOutcomeFrequency;
  layout?: string;
};

export abstract class CreateOneRecordOutcome extends Outcome {
  readonly targetApp: string;
  readonly frequency: CreateOneRecordOutcomeFrequency;
  readonly layout: string;

  constructor({ status, description, targetApp, frequency, layout = 'Default Layout' }: CreateOneRecordOutcomeObject) {
    super({ type: 'Create One Record', status, description });
    this.targetApp = targetApp;
    this.frequency = frequency;
    this.layout = layout;
  }
}

type CreateOneRecordOnSaveOutcomeObject = Omit<CreateOneRecordOutcomeObject, 'frequency'>;

export class CreateOneRecordOnSaveOutcome extends CreateOneRecordOutcome {
  constructor({ status, description = '', targetApp, layout }: CreateOneRecordOnSaveOutcomeObject) {
    super({ status, description, targetApp, frequency: 'Always on save', layout });
  }
}
