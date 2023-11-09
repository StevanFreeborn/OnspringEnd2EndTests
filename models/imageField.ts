import { LayoutItem, LayoutItemObject } from './layoutItem';

type ImageFieldObject = Omit<LayoutItemObject, 'type'>;

export class ImageField extends LayoutItem {
  constructor({ id = 0, name, permissions = [] }: ImageFieldObject) {
    super({ id, name, permissions, type: 'Image' });
  }
}
