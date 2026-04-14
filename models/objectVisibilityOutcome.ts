import { Outcome, OutcomeObject } from './outcome';

type ObjectVisibilityOutcomeObject = Omit<OutcomeObject, 'type'> & {
  layoutName?: string;
  sections: ObjectVisibilitySection[];
};

export class ObjectVisibilityOutcome extends Outcome {
  layoutName: string;
  sections: ObjectVisibilitySection[];

  constructor({ status, description, layoutName = 'Default Layout', sections = [] }: ObjectVisibilityOutcomeObject) {
    super({ type: 'Object Visibility', status, description });
    this.layoutName = layoutName;
    this.sections = sections;
  }

  clone(): ObjectVisibilityOutcome {
    return new ObjectVisibilityOutcome({
      status: this.status,
      description: this.description,
      layoutName: this.layoutName,
      sections: this.sections.map(s => s.clone()),
    });
  }
}

type VisibilityState = 'No Change' | 'Read Only' | 'Hidden';

type ObjectVisibilitySectionObject = {
  tabName: string;
  name: string;
  visibility?: VisibilityState;
};

export class ObjectVisibilitySection {
  tabName: string;
  name: string;
  visibility: VisibilityState;

  constructor({ tabName, name, visibility = 'No Change' }: ObjectVisibilitySectionObject) {
    this.tabName = tabName;
    this.name = name;
    this.visibility = visibility;
  }

  clone() {
    return new ObjectVisibilitySection({
      tabName: this.tabName,
      name: this.name,
      visibility: this.visibility,
    });
  }
}
