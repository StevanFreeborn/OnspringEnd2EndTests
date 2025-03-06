import { Locator, Page } from '@playwright/test';
import { CreateImportConfigDialog } from '../../componentObjectModels/dialogs/createImportConfigDialog';
import { DeleteDataImportDialog } from '../../componentObjectModels/dialogs/deleteDataImportDialog';
import { TEST_DATA_IMPORT_NAME } from '../../factories/fakeDataFactory';
import { BaseAdminPage } from '../baseAdminPage';

export class DataImportsAdminPage extends BaseAdminPage {
  private readonly getImportsPath: string;
  private readonly path: string;
  private readonly deleteImportPathRegex: RegExp;
  readonly dataImportGrid: Locator;
  readonly deleteDataImportsDialog: DeleteDataImportDialog;
  readonly createImportButton: Locator;
  readonly createImportConfigDialog: CreateImportConfigDialog;

  constructor(page: Page) {
    super(page);
    this.getImportsPath = '/Admin/Integration/Import/ImportList';
    this.path = '/Admin/Integration/Import';
    this.dataImportGrid = page.locator('#grid');
    this.deleteDataImportsDialog = new DeleteDataImportDialog(page);
    this.deleteImportPathRegex = /\/Admin\/Integration\/Import\/\d+\/Delete/;
    this.createImportButton = page.getByRole('button', { name: 'Create Import Configuration' });
    this.createImportConfigDialog = new CreateImportConfigDialog(page);
  }

  async goto() {
    const getImportsResponse = this.page.waitForResponse(this.getImportsPath);
    await this.page.goto(this.path);
    await getImportsResponse;
  }

  async deleteAllTestImports() {
    await this.goto();

    const scrollableElement = this.dataImportGrid.locator('.k-grid-content.k-auto-scrollable').first();

    const pager = this.dataImportGrid.locator('.k-pager-info').first();
    const pagerText = await pager.innerText();
    const totalNumOfImports = parseInt(pagerText.trim().split(' ')[0]);

    if (Number.isNaN(totalNumOfImports) === false) {
      const importRows = this.dataImportGrid.getByRole('row');
      let importRowsCount = await importRows.count();

      while (importRowsCount < totalNumOfImports) {
        const scrollResponse = this.page.waitForResponse(this.getImportsPath);
        await scrollableElement.evaluate(el => (el.scrollTop = el.scrollHeight));
        await scrollResponse;
        importRowsCount = await importRows.count();
      }
    }

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

  async createDataImportCopy(importNameToCopy: string, newImportName: string) {
    await this.createImportButton.click();
    await this.createImportConfigDialog.copyFromRadioButton.waitFor();
    await this.createImportConfigDialog.copyFromRadioButton.click();
    await this.createImportConfigDialog.copyFromDropdown.click();
    await this.createImportConfigDialog.getImportToCopy(importNameToCopy).click();
    await this.createImportConfigDialog.nameInput.fill(newImportName);
    await this.createImportConfigDialog.saveButton.click();
  }

  async createDataImport(importName: string) {
    await this.createImportButton.click();
    await this.createImportConfigDialog.nameInput.waitFor();
    await this.createImportConfigDialog.nameInput.fill(importName);
    await this.createImportConfigDialog.saveButton.click();
  }
}
