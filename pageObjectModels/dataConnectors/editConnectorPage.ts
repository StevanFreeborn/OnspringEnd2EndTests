import { Locator, Page } from '@playwright/test';
import { DataConnectorConnectionTab } from '../../componentObjectModels/tabs/dataConnectorConnectionTab';
import { BaseAdminPage } from '../baseAdminPage';

export abstract class EditConnectorPage extends BaseAdminPage {
  readonly pathRegex: RegExp;
  readonly connectionTabButton: Locator;
  abstract readonly connectionTab: DataConnectorConnectionTab;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/Integration\/DataConnector\/\d+\/Edit/;
    this.connectionTabButton = page.getByRole('tab', { name: 'Connection' });
  }

  async goto(id: number) {
    await this.page.goto(`Admin/Integration/DataConnector/${id}/Edit`);
  }

  async getIdFromUrl() {
    if (this.page.url().match(this.pathRegex) === null) {
      throw new Error('The current page is not an edit connector page.');
    }

    const url = this.page.url();
    const urlParts = url.split('/');
    const id = urlParts[urlParts.length - 2];
    return parseInt(id);
  }
}
