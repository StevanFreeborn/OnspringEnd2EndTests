import { LayoutItem, LayoutItemObject } from './layoutItem';

type TextFieldFormattingOptions = 'Single line' | 'Multi-line' | 'Text Mask' | 'Color';

type TextFieldObject = Omit<LayoutItemObject, 'type'> & {
  formatting?: TextFieldFormattingOptions;
};

export class TextField extends LayoutItem {
  formatting: TextFieldFormattingOptions;

  constructor({ id = 0, name, permissions = [], formatting = 'Single line' }: TextFieldObject) {
    super({ id, name, permissions, type: 'Text' });
    this.formatting = formatting;
  }
}
