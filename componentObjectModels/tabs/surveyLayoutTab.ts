import { Page } from '@playwright/test';
import { BaseLayoutTab } from './baseLayoutTab';

export class SurveyLayoutTab extends BaseLayoutTab {
  constructor(page: Page) {
    super(page);
  }
}
