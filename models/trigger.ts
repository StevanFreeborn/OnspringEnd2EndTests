import { Outcome } from './outcome';
import { Rule } from './rule';

type LogicMode = 'Simple Mode' | 'Advanced Mode';
type LogicOperator = 'AND' | 'OR';

type TriggerObject = {
  name: string;
  status?: boolean;
  description?: string;
  rules?: Rule[];
  logicMode?: LogicMode;
  logicOperator?: LogicOperator;
  outcomes?: Outcome[];
};

export class Trigger {
  name: string;
  status: boolean;
  description: string;
  rules: Rule[];
  logicMode: LogicMode;
  logicOperator: LogicOperator;
  outcomes: Outcome[];

  constructor({
    name,
    status = false,
    description = '',
    rules = [],
    logicMode = 'Simple Mode',
    logicOperator = 'AND',
    outcomes = [],
  }: TriggerObject) {
    this.name = name;
    this.status = status;
    this.description = description;
    this.rules = rules;
    this.logicMode = logicMode;
    this.logicOperator = logicOperator;
    this.outcomes = outcomes;
  }
}
