export type OutcomeType =
  | 'All Types'
  | 'Create Multiple Records'
  | 'Create One Record'
  | 'Filter List Values'
  | 'Generate Document'
  | 'Object Visibility'
  | 'Print Content Record'
  | 'Required Fields'
  | 'Set Date'
  | 'Set List Value'
  | 'Set Reference'
  | 'Stop Calculation'
  | 'REST API';

export type OutcomeObject = {
  type: OutcomeType;
  description?: string;
  status?: boolean;
};

export class Outcome {
  type: OutcomeType;
  description: string;
  status: boolean;

  constructor({ type, description = '', status = false }: OutcomeObject) {
    this.type = type;
    this.description = description;
    this.status = status;
  }
}
