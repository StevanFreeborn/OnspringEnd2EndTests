import { Page } from '@playwright/test';
import { BaseAdminPage } from '../baseAdminPage';

export class ContainersAdminPage extends BaseAdminPage {
  constructor(page: Page) {
    super(page);
  }
}
