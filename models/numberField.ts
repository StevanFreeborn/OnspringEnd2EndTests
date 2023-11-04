import { LayoutItem, LayoutItemObject } from './layoutItem';

type NumberFieldObject = LayoutItemObject;

export class NumberField extends LayoutItem {
  constructor({ id = 0, name, permissions = [] }: NumberFieldObject) {
    super({ id, name, permissions, type: 'Text' });
  }
}
