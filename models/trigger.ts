import { Outcome } from './outcome';
import { RuleLogic, SimpleRuleLogic } from './ruleLogic';

type LogicMode = 'Simple Mode' | 'Advanced Mode';
type LogicOperator = 'AND' | 'OR';

type TriggerObject = {
  name: string;
  status?: boolean;
  description?: string;
  ruleSet?: RuleLogic;
  logicMode?: LogicMode;
  logicOperator?: LogicOperator;
  outcomes?: Outcome[];
};

export class Trigger {
  name: string;
  status: boolean;
  description: string;
  ruleSet: RuleLogic;
  logicMode: LogicMode;
  logicOperator: LogicOperator;
  outcomes: Outcome[];

  constructor({
    name,
    status = false,
    description = '',
    ruleSet = new SimpleRuleLogic({ rules: [] }),
    logicMode = 'Simple Mode',
    logicOperator = 'AND',
    outcomes = [],
  }: TriggerObject) {
    this.name = name;
    this.status = status;
    this.description = description;
    this.ruleSet = ruleSet;
    this.logicMode = logicMode;
    this.logicOperator = logicOperator;
    this.outcomes = outcomes;
  }
}
