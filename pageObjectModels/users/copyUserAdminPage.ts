import { Page } from '@playwright/test';
import { BASE_URL } from '../../playwright.config';
import { UserAdminPage } from './userAdminPage';

export class CopyUserAdminPage extends UserAdminPage {
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.pathRegex = new RegExp(`${BASE_URL}/Admin/Security/User/[0-9]+/Copy`);
  }

  async goto(userId: number) {
    await this.page.goto(`/Admin/Security/User/${userId}/Copy`);
  }
}
