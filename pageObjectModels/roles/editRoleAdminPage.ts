import { Page } from '@playwright/test';
import { BASE_URL } from '../../playwright.config';
import { RoleAdminPage } from './roleAdminPage';

export class EditRoleAdminPage extends RoleAdminPage {
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.pathRegex = new RegExp(`${BASE_URL}/Admin/Security/Role/[0-9]+/Edit`);
  }

  async goto(roleId: number) {
    await this.page.goto(`/Admin/Security/Role/${roleId}/Edit`);
  }

  async saveRole() {
    const saveResponse = this.page.waitForResponse(this.pathRegex);
    await this.saveRecordButton.click();
    await saveResponse;
  }

  getRoleIdFromUrl() {
    if (this.page.url().match(this.pathRegex) === null) {
      throw new Error('The current page is not a role admin page.');
    }

    const url = this.page.url();
    const urlParts = url.split('/');
    const roleId = urlParts[urlParts.length - 2];
    return parseInt(roleId);
  }
}
