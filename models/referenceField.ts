import { LayoutItem, LayoutItemObject } from './layoutItem';

export type ReferenceFieldMultiplicity = 'Single Select' | 'Multi-Select';

type ReferenceFieldObject = Omit<LayoutItemObject, 'type'> & {
  reference: string;
  multiplicity?: ReferenceFieldMultiplicity;
};

export class ReferenceField extends LayoutItem {
  readonly reference: string;
  readonly multiplicity: ReferenceFieldMultiplicity;

  constructor({
    id = 0,
    name,
    permissions = [],
    reference = '',
    multiplicity = 'Single Select',
  }: ReferenceFieldObject) {
    super({ id, name, permissions, type: 'Reference' });
    this.reference = reference;
    this.multiplicity = multiplicity;
  }
}
