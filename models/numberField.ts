import { LayoutItem, LayoutItemObject } from './layoutItem';

type NumberFieldObject = Omit<LayoutItemObject, 'type'>;

export class NumberField extends LayoutItem {
  constructor({ id = 0, name, permissions = [] }: NumberFieldObject) {
    super({ id, name, permissions, type: 'Number' });
  }
}
