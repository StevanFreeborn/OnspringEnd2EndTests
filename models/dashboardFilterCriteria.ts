import { NonValueOperator } from './operator';

type DashboardFilterCriteriaObject = {
  filterLabel: string;
};

export abstract class DashboardFilterCriteria {
  filterLabel: string;

  constructor({ filterLabel }: DashboardFilterCriteriaObject) {
    this.filterLabel = filterLabel;
  }
}

type TextDashboardFilterCriteriaObject = DashboardFilterCriteriaObject & {
  operator: Exclude<NonValueOperator, 'Changed'>;
};

export class TextDashboardFilterCriteria extends DashboardFilterCriteria {
  operator: Exclude<NonValueOperator, 'Changed'>;

  constructor({ filterLabel, operator }: TextDashboardFilterCriteriaObject) {
    super({ filterLabel });
    this.operator = operator;
  }
}
