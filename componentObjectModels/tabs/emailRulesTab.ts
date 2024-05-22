import { Page } from '@playwright/test';
import { MessageRulesTab } from './messageRulesTab';

export class EmailRulesTab extends MessageRulesTab {
  constructor(page: Page) {
    super(page);
  }
}
