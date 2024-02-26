import { Rule } from './rule';

export abstract class RuleLogic {
  readonly mode: string;
  readonly rules: Rule[];

  protected constructor({ mode, rules }: { mode: string; rules: Rule[] }) {
    this.rules = rules;
    this.mode = mode;
  }
}

abstract class BaseAdvancedRuleLogic extends RuleLogic {
  readonly useFilterLogic: boolean;

  protected constructor({ useFilterLogic, rules }: { useFilterLogic: boolean; rules: Rule[] }) {
    super({ mode: 'Advanced Mode', rules });
    this.useFilterLogic = useFilterLogic;
  }
}

export class SimpleRuleLogic extends RuleLogic {
  constructor({ rules }: { rules: Rule[] }) {
    super({ mode: 'Simple Mode', rules });
  }
}

export class AdvancedFilterRuleLogic extends BaseAdvancedRuleLogic {
  readonly operator: 'AND' | 'OR';

  constructor({ operator, rules }: { operator: 'AND' | 'OR'; rules: Rule[] }) {
    super({ rules, useFilterLogic: false });
    this.operator = operator;
  }
}

export class FilterRuleLogic extends BaseAdvancedRuleLogic {
  readonly filterLogic: string;

  constructor({ filterLogic, rules }: { filterLogic: string; rules: Rule[] }) {
    super({ rules, useFilterLogic: true });
    this.filterLogic = filterLogic;
  }
}
