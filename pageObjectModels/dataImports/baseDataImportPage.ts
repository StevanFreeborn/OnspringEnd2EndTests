import { Locator, Page } from '@playwright/test';
import { DataFileTab } from '../../componentObjectModels/tabs/dataFileTab';
import { BaseAdminPage } from '../baseAdminPage';

export abstract class BaseDataImportPage extends BaseAdminPage {
  readonly saveChangesButton: Locator;

  readonly dataFileTabButton: Locator;

  readonly dataFileTab: DataFileTab;

  protected constructor(page: Page) {
    super(page);
    this.saveChangesButton = page.getByRole('link', { name: 'Save Changes', exact: true });
    this.dataFileTabButton = page.getByRole('tab', { name: 'Data File' });
    this.dataFileTab = new DataFileTab(page);
  }
}
