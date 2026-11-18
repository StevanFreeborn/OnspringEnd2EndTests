import { LayoutItem, LayoutItemObject } from './layoutItem.js';

type TimeSpanFieldObject = Omit<LayoutItemObject, 'type'>;

export class TimeSpanField extends LayoutItem {
  constructor({ id = 0, name, permissions = [] }: TimeSpanFieldObject) {
    super({ id, name, permissions, type: 'Time Span' });
  }
}
