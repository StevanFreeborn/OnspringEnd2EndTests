import { Page } from '@playwright/test';
import { BaseContainerPage } from './baseContainerPage';

export class EditContainerPage extends BaseContainerPage {
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/Dashboard\/Container\/\d+\/Edit/;
  }
}
