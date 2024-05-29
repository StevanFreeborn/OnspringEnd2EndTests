import { Locator, Page } from '@playwright/test';
import { DataConnectorType } from '../../models/dataConnector';
import { BaseCreateOrAddDialogWithSaveButton } from './baseCreateOrAddDialog';

export class CreateDataConnectorDialog extends BaseCreateOrAddDialogWithSaveButton {
  private readonly connectorTypeSelector: Locator;

  constructor(page: Page) {
    super(page);
    this.connectorTypeSelector = this.page.getByRole('listbox', { name: 'Connector Type' });
  }

  async selectType(type: DataConnectorType) {
    await this.connectorTypeSelector.click();
    await this.page.getByRole('option', { name: type }).click();
  }

  getConnectorToCopy(connectorToCopyName: string) {
    return this.getItemToCopy(connectorToCopyName);
  }
}
