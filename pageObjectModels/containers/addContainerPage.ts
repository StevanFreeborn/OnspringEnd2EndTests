import { Page } from '@playwright/test';
import { BaseContainerPage } from './baseContainerPage';

export class AddContainerPage extends BaseContainerPage {
  constructor(page: Page) {
    super(page);
  }
}
