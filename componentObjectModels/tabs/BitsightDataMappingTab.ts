import { Page } from '@playwright/test';
import { MultiAppDataMappingTab } from './multiAppDataMappingTab';

export class BitsightDataMapping extends MultiAppDataMappingTab {
  super(page: Page) {}
}
