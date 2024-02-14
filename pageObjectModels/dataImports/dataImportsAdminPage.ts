import { Locator, Page } from '@playwright/test';
import { DeleteDataImportDialog } from '../../componentObjectModels/dialogs/deleteDataImportDialog';
import { TEST_DATA_IMPORT_NAME } from '../../factories/fakeDataFactory';
import { BaseAdminPage } from '../baseAdminPage';

export class DataImportsAdminPage extends BaseAdminPage {
  private readonly path: string;
  private readonly deleteImportPathRegex: RegExp;
  readonly dataImportGrid: Locator;
  readonly deleteDataImportsDialog: DeleteDataImportDialog;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Integration/Import';
    this.dataImportGrid = page.locator('#grid');
    this.deleteDataImportsDialog = new DeleteDataImportDialog(page);
    this.deleteImportPathRegex = /\/Admin\/Integration\/Import\/\d+\/Delete/;
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async deleteAllTestImports() {
    await this.goto();

    const deleteImportRow = this.dataImportGrid
      .getByRole('row', { name: new RegExp(TEST_DATA_IMPORT_NAME, 'i') })
      .last();
    let isVisible = await deleteImportRow.isVisible();

    while (isVisible) {
      await deleteImportRow.hover();
      await deleteImportRow.getByTitle('Delete Import Configuration').click();

      const deleteResponse = this.page.waitForResponse(this.deleteImportPathRegex);

      await this.deleteDataImportsDialog.deleteButton.click();

      await deleteResponse;

      isVisible = await deleteImportRow.isVisible();
    }
  }

  async deleteDataImports(dataImportsToDelete: string[]) {
    await this.goto();

    for (const importName of dataImportsToDelete) {
      const dataImportRow = this.dataImportGrid.getByRole('row', { name: importName }).first();
      const rowElement = await dataImportRow.elementHandle();

      if (rowElement === null) {
        continue;
      }

      await dataImportRow.hover();
      await dataImportRow.getByTitle('Delete Import Configuration').click();
      await this.deleteDataImportsDialog.deleteButton.click();
      await this.deleteDataImportsDialog.waitForDialogToBeDismissed();
      await rowElement.waitForElementState('hidden');
    }
  }
}
