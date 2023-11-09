import { LayoutItem, LayoutItemObject } from './layoutItem';

type AttachmentFieldObject = Omit<LayoutItemObject, 'type'>;

export class AttachmentField extends LayoutItem {
  constructor({ id = 0, name, permissions = [] }: AttachmentFieldObject) {
    super({ id, name, permissions, type: 'Attachment' });
  }
}
