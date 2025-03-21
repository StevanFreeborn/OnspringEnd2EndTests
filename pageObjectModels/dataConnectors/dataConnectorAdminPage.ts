import { Locator, Page } from '@playwright/test';
import { DeleteDataConnectorDialog } from '../../componentObjectModels/dialogs/deleteDataConnectorDialog';
import { TEST_CONNECTOR_NAME } from '../../factories/fakeDataFactory';
import { BaseAdminPage } from '../baseAdminPage';

export class DataConnectorAdminPage extends BaseAdminPage {
  private readonly getConnectorsPath: string;
  readonly path: string;
  readonly connectorsGrid: Locator;
  private readonly deletePathRegex: RegExp;
  readonly deleteConnectorDialog: DeleteDataConnectorDialog;

  constructor(page: Page) {
    super(page);
    this.getConnectorsPath = '/Admin/Integration/DataConnector/DataConnectorList';
    this.path = '/Admin/Integration/DataConnector';
    this.connectorsGrid = this.page.locator('#grid');
    this.deletePathRegex = /\/Admin\/Integration\/DataConnector\/\d+\/Delete/;
    this.deleteConnectorDialog = new DeleteDataConnectorDialog(page);
  }

  async goto() {
    const getConnectorsResponse = this.page.waitForResponse(this.getConnectorsPath);
    await this.page.goto(this.path);
    await getConnectorsResponse;
  }

  async deleteConnectors(connectorsToDelete: string[]) {
    await this.goto();

    for (const connectorName of connectorsToDelete) {
      const connectorRow = this.connectorsGrid.getByRole('row', { name: connectorName }).first();
      const rowElement = await connectorRow.elementHandle();

      if (rowElement === null) {
        continue;
      }

      await connectorRow.hover();
      await connectorRow.getByTitle('Delete Data Connector').click();
      await this.deleteConnectorDialog.deleteButton.click();
      await this.deleteConnectorDialog.waitForDialogToBeDismissed();
      await rowElement.waitForElementState('hidden');
    }
  }

  async deleteAllTestConnectors() {
    await this.goto();

    const scrollableElement = this.connectorsGrid.locator('.k-grid-content.k-auto-scrollable').first();

    const pager = this.connectorsGrid.locator('.k-pager-info').first();
    const pagerText = await pager.innerText();
    const totalNumOfConnectors = parseInt(pagerText.trim().split(' ')[0]);

    if (Number.isNaN(totalNumOfConnectors) === false) {
      const connectorRows = this.connectorsGrid.getByRole('row');
      let connectorRowsCount = await connectorRows.count();

      while (connectorRowsCount < totalNumOfConnectors) {
        const scrollResponse = this.page.waitForResponse(this.getConnectorsPath);
        await scrollableElement.evaluate(el => (el.scrollTop = el.scrollHeight));
        await scrollResponse;
        connectorRowsCount = await connectorRows.count();
      }
    }

    const deleteConnectorRow = this.connectorsGrid
      .getByRole('row', { name: new RegExp(TEST_CONNECTOR_NAME, 'i') })
      .last();

    let isVisible = await deleteConnectorRow.isVisible();

    while (isVisible) {
      await deleteConnectorRow.hover();
      await deleteConnectorRow.getByTitle('Delete Data Connector').click();

      const deleteResponse = this.page.waitForResponse(this.deletePathRegex);

      await this.deleteConnectorDialog.deleteButton.click();

      await deleteResponse;

      isVisible = await deleteConnectorRow.isVisible();
    }
  }
}
