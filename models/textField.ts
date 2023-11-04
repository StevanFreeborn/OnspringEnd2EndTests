import { LayoutItem, LayoutItemObject } from './layoutItem';

type TextFieldObject = LayoutItemObject;

export class TextField extends LayoutItem {
  constructor({ id = 0, name, permissions = [] }: TextFieldObject) {
    super({ id, name, permissions, type: 'Text' });
  }
}
