import { LayoutItem, LayoutItemObject } from './layoutItem';

type FormattedTextBlockObject = Omit<LayoutItemObject, 'type'> & {
  formattedText?: string;
};

export class FormattedTextBlock extends LayoutItem {
  readonly formattedText: string;

  constructor({ id = 0, name, permissions = [], formattedText = '' }: FormattedTextBlockObject) {
    super({ id, name, permissions, type: 'Formatted Text Block' });
    this.formattedText = formattedText;
  }
}
