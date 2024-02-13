import { Page } from '@playwright/test';
import { BaseContainerPage } from './baseContainerPage';

export class EditContainerPage extends BaseContainerPage {
  constructor(page: Page) {
    super(page);
  }
}
