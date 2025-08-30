type RecordRetentionRuleObject = {
  name: string;
};

export class RecordRetentionRule {
  name: string;

  constructor({ name }: RecordRetentionRuleObject) {
    this.name = name;
  }
}
