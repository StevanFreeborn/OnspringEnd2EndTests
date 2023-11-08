import { LayoutItem, LayoutItemObject } from './layoutItem';

type DateFieldObject = Omit<LayoutItemObject, 'type'>;

export class DateField extends LayoutItem {
  constructor({ id = 0, name, permissions = [] }: DateFieldObject) {
    super({ id, name, permissions, type: 'Date/Time' });
  }
}
