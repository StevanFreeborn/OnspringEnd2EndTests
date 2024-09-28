import { LayoutItem, LayoutItemObject } from './layoutItem';

type Display = 'Date' | 'Date and Time';

type DateFieldObject = Omit<LayoutItemObject, 'type'> & {
  display?: Display;
};

export class DateField extends LayoutItem {
  display: Display;

  constructor({ id = 0, name, permissions = [], display = 'Date' }: DateFieldObject) {
    super({ id, name, permissions, type: 'Date/Time' });
    this.display = display;
  }
}
