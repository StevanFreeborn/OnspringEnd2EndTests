import { Page } from '@playwright/test';
import { BaseContainerPage } from './baseContainerPage';

export class AddContainerPage extends BaseContainerPage {
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/Dashboard\/Container\/Add/;
  }
}
