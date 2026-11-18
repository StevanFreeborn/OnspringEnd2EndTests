import { LayoutItem, LayoutItemObject } from './layoutItem.js';
import { ListValue } from './listValue.js';

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
