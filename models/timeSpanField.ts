import { LayoutItem, LayoutItemObject } from './layoutItem';

type TextFieldObject = LayoutItemObject;

export class TimeSpanField extends LayoutItem {
  constructor({ id = 0, name, permissions = [] }: TextFieldObject) {
    super({ id, name, permissions, type: 'Time Span' });
  }
}
