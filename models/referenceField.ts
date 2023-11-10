import { LayoutItem, LayoutItemObject } from './layoutItem';

type ReferenceFieldObject = Omit<LayoutItemObject, 'type'> & {
  reference: string;
};

export class ReferenceField extends LayoutItem {
  readonly reference: string;

  constructor({ id = 0, name, permissions = [], reference = '' }: ReferenceFieldObject) {
    super({ id, name, permissions, type: 'Reference' });
    this.reference = reference;
  }
}
