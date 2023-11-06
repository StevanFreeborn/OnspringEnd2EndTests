import { LayoutItem, LayoutItemObject } from './layoutItem';

type DateFieldObject = LayoutItemObject;

export class DateField extends LayoutItem {
  constructor({ id = 0, name, permissions = [] }: DateFieldObject) {
    super({ id, name, permissions, type: 'Date/Time' });
  }
}
