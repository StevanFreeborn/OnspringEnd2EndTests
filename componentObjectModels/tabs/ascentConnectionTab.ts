import { Page } from '@playwright/test';
import { DataConnectorConnectionTab } from './dataConnectorConnectionTab';

export class AscentConnectionTab extends DataConnectorConnectionTab {
  constructor(page: Page) {
    super(page);
  }
}
