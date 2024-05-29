import { Locator, Page } from '@playwright/test';
import { BaseAdminPage } from '../baseAdminPage';

export abstract class EditConnectorPage extends BaseAdminPage {
  readonly pathRegex: RegExp;
  readonly nameInput: Locator;
  readonly descriptionEditor: Locator;
  readonly statusSwitch: Locator;
  readonly statusToggle: Locator;
  readonly viewRunHistoryLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/Integration\/DataConnector\/\d+\/Edit/;
    this.nameInput = page.getByLabel('Name');
    this.descriptionEditor = page.locator('.content-area.mce-content-body');
    this.statusSwitch = page.getByRole('switch', { name: 'Status' });
    this.statusToggle = this.statusSwitch.locator('span').nth(3);
    this.viewRunHistoryLink = page.getByRole('link', { name: 'View Run History' });
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
