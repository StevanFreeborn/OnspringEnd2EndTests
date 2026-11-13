import { Page } from '@playwright/test';
import { BASE_URL } from '../../playwright.config';
import { UserAdminPage } from './userAdminPage';

export class EditUserAdminPage extends UserAdminPage {
  private readonly changePasswordPathRegex: RegExp;
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.pathRegex = new RegExp(`${BASE_URL}/Admin/Security/User/[0-9]+/Edit`);
    this.changePasswordPathRegex = /\/Admin\/Security\/User\/\d+\/ChangePassword/;
  }

  async goto(userId: number) {
    await this.page.goto(`/Admin/Security/User/${userId}/Edit`);
  }

  async saveUser() {
    const saveResponse = this.page.waitForResponse(this.pathRegex);
    await this.saveRecordButton.click();
    await saveResponse;
  }

  async changePassword(newPassword: string) {
    await this.securityTabButton.click();
    await this.securityTab.changePasswordLink.click();
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(1000);
    await this.securityTab.changePasswordDialog.newPasswordInput.fill(newPassword);
    await this.securityTab.changePasswordDialog.verifyPasswordInput.fill(newPassword);

    const passwordChangeResponse = this.page.waitForResponse(this.changePasswordPathRegex);
    await this.securityTab.changePasswordDialog.saveButton.click();
    await passwordChangeResponse;
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
