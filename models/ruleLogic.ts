import { Rule } from './rule';

export abstract class RuleLogic {
  readonly mode: string;
  readonly rules: Rule[];
  readonly addRecordIsNew: boolean;

  protected constructor({
    mode,
    rules,
    addRecordIsNew = false,
  }: {
    mode: string;
    rules: Rule[];
    addRecordIsNew: boolean;
  }) {
    this.rules = rules;
    this.mode = mode;
    this.addRecordIsNew = addRecordIsNew;
  }
}

abstract class BaseAdvancedRuleLogic extends RuleLogic {
  readonly useFilterLogic: boolean;

  protected constructor({
    useFilterLogic,
    rules,
    addRecordIsNew,
  }: {
    useFilterLogic: boolean;
    rules: Rule[];
    addRecordIsNew: boolean;
  }) {
    super({ mode: 'Advanced Mode', rules, addRecordIsNew });
    this.useFilterLogic = useFilterLogic;
  }
}

export class SimpleRuleLogic extends RuleLogic {
  constructor({ rules, addRecordIsNew = false }: { rules: Rule[]; addRecordIsNew?: boolean }) {
    super({ mode: 'Simple Mode', rules, addRecordIsNew });
  }
}

export class AdvancedRuleLogic extends BaseAdvancedRuleLogic {
  readonly operator: 'AND' | 'OR';

  constructor({
    operator,
    rules,
    addRecordIsNew = false,
  }: {
    operator: 'AND' | 'OR';
    rules: Rule[];
    addRecordIsNew?: boolean;
  }) {
    super({ rules, useFilterLogic: false, addRecordIsNew });
    this.operator = operator;
  }
}

export class FilterRuleLogic extends BaseAdvancedRuleLogic {
  readonly filterLogic: string;

  constructor({
    filterLogic,
    rules,
    addRecordIsNew = false,
  }: {
    filterLogic: string;
    rules: Rule[];
    addRecordIsNew?: boolean;
  }) {
    super({ rules, useFilterLogic: true, addRecordIsNew });
    this.filterLogic = filterLogic;
  }
}
