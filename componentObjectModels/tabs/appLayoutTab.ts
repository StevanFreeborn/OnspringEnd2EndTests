import { Page } from '@playwright/test';
import { BaseLayoutTab } from './baseLayoutTab';

export class AppLayoutTab extends BaseLayoutTab {
  constructor(page: Page) {
    super(page);
  }
}
