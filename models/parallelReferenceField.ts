import { LayoutItem, LayoutItemObject } from './layoutItem';

type ParallelReferenceFieldObject = Omit<LayoutItemObject, 'type'>;

export class ParallelReferenceField extends LayoutItem {
  constructor({ id = 0, name, permissions = [] }: ParallelReferenceFieldObject) {
    super({ id, name, permissions, type: 'Parallel Reference' });
  }
}
