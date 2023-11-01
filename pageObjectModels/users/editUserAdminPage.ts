import { Page } from '@playwright/test';
import { BASE_URL } from '../../playwright.config';
import { UserAdminPage } from './userAdminPage';

export class EditUserAdminPage extends UserAdminPage {
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.pathRegex = new RegExp(`${BASE_URL}/Admin/Security/User/[0-9]+/Edit`);
  }

  async goto(userId: number) {
    await this.page.goto(`/Admin/Security/User/${userId}/Edit`);
  }

  async saveUser() {
    await this.saveRecordButton.click();
    await this.page.waitForResponse(this.pathRegex);
  }

  getUserIdFromUrl() {
    if (this.page.url().match(this.pathRegex) === null) {
      throw new Error('The current page is not an edit user admin page.');
    }

    const url = this.page.url();
    const urlParts = url.split('/');
    const userId = urlParts[urlParts.length - 2];
    return parseInt(userId);
  }
}
