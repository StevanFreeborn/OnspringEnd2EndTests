import { Page } from '@playwright/test';
import { BaseAdminPage } from '../baseAdminPage';

export abstract class BaseContainerPage extends BaseAdminPage {
  protected constructor(page: Page) {
    super(page);
  }
}
