import { Outcome, OutcomeObject } from './outcome';

type StopCalculationOutcomeObject = Omit<OutcomeObject, 'type'> & {
  fieldsToStop?: string[];
};

export class StopCalculationOutcome extends Outcome {
  fieldsToStop: string[];

  constructor({ status, description, fieldsToStop = [] }: StopCalculationOutcomeObject) {
    super({ type: 'Stop Calculation', status, description });
    this.fieldsToStop = fieldsToStop;
  }
}
