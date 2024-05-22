import { Page } from '@playwright/test';
import { MessageFrequencyTab } from './messageFrequencyTab';

export class EmailFrequencyTab extends MessageFrequencyTab {
  constructor(page: Page) {
    super(page);
  }
}
