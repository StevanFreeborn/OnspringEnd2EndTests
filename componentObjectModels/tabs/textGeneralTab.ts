import { Page } from '@playwright/test';
import { BaseMessageGeneralTab } from './baseMessageGeneralTab';

export class TextGeneralTab extends BaseMessageGeneralTab {
  constructor(page: Page) {
    super(page);
  }
}
