import { Locator, Page } from '@playwright/test';
import { RunDataImportDialog } from '../../componentObjectModels/dialogs/runDataImportDialog';
import { DataFileTab } from '../../componentObjectModels/tabs/dataFileTab';
import { BaseAdminPage } from '../baseAdminPage';

export abstract class BaseDataImportPage extends BaseAdminPage {
  readonly saveChangesButton: Locator;
  readonly saveChangesAndRunButton: Locator;

  readonly dataFileTabButton: Locator;

  readonly dataFileTab: DataFileTab;

  readonly runDataImportDialog: RunDataImportDialog;
  readonly importProcessingMessage: Locator;

  protected constructor(page: Page) {
    super(page);
    this.saveChangesButton = page.getByRole('link', { name: 'Save Changes', exact: true });
    this.saveChangesAndRunButton = page.getByRole('link', { name: 'Save Changes & Run' });
    this.dataFileTabButton = page.getByRole('tab', { name: 'Data File' });
    this.dataFileTab = new DataFileTab(page);
    this.runDataImportDialog = new RunDataImportDialog(page);
    this.importProcessingMessage = page.locator('.processing-message');
  }
}
