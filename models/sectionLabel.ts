import { LayoutItem, LayoutItemObject } from './layoutItem';

type SectionLabelObject = Omit<LayoutItemObject, 'type'> & {
  text?: string;
  displayHorizontalLineBelowText?: boolean;
  displayOnlyInEditMode?: boolean;
};

export class SectionLabel extends LayoutItem {
  readonly text: string;
  readonly displayHorizontalLineBelowText: boolean;
  readonly displayOnlyInEditMode: boolean;

  constructor({
    id = 0,
    name,
    permissions = [],
    text = '',
    displayHorizontalLineBelowText = true,
    displayOnlyInEditMode = false,
  }: SectionLabelObject) {
    super({ id, name, permissions, type: 'Section Label' });
    this.text = text;
    this.displayHorizontalLineBelowText = displayHorizontalLineBelowText;
    this.displayOnlyInEditMode = displayOnlyInEditMode;
  }
}
