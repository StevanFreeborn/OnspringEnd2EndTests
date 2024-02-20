import { Page } from '@playwright/test';
import { EditableContentPage } from './editableContentPage';

export class CopyContentPage extends EditableContentPage {
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Content\/\d+\/\d+\/CopyRecord/;
  }
}
