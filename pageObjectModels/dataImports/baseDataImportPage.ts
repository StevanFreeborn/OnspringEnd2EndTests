import { Locator, Page } from '@playwright/test';
import { RunDataImportDialog } from '../../componentObjectModels/dialogs/runDataImportDialog';
import { DataFileTab } from '../../componentObjectModels/tabs/dataFileTab';
import { DataMappingTab } from '../../componentObjectModels/tabs/dataMappingTab';
import { BaseAdminPage } from '../baseAdminPage';

export abstract class BaseDataImportPage extends BaseAdminPage {
  readonly saveChangesButton: Locator;
  readonly saveChangesAndRunButton: Locator;

  readonly dataFileTabButton: Locator;
  readonly dataMappingTabButton: Locator;

  readonly dataFileTab: DataFileTab;
  readonly dataMappingTab: DataMappingTab;

  readonly runDataImportDialog: RunDataImportDialog;
  readonly importProcessingMessage: Locator;

  protected constructor(page: Page) {
    super(page);
    this.saveChangesButton = page.getByRole('link', { name: 'Save Changes', exact: true });
    this.saveChangesAndRunButton = page.getByRole('link', { name: 'Save Changes & Run' });
    this.dataFileTabButton = page.getByRole('tab', { name: 'Data File' });
    this.dataMappingTabButton = page.getByRole('tab', { name: 'Data Mapping' });
    this.dataFileTab = new DataFileTab(page);
    this.dataMappingTab = new DataMappingTab(page);
    this.runDataImportDialog = new RunDataImportDialog(page);
    this.importProcessingMessage = page.locator('.processing-message');
  }
}
