import { LayoutItem, LayoutItemObject } from './layoutItem';
import { ListValue } from './listValue';

type ListFieldObject = Omit<LayoutItemObject, 'type'> & {
  values?: ListValue[];
};

export class ListField extends LayoutItem {
  readonly values: ListValue[];

  constructor({ id = 0, name, permissions = [], values = [] }: ListFieldObject) {
    super({ id, name, permissions, type: 'List' });
    this.values = values;
  }
}
