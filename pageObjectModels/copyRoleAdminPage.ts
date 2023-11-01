import { Page } from '@playwright/test';
import { BASE_URL } from '../playwright.config';
import { RoleAdminPage } from './roleAdminPage';

export class CopyRoleAdminPage extends RoleAdminPage {
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.pathRegex = new RegExp(`${BASE_URL}/Admin/Security/Role/[0-9]+/Copy`);
  }

  async goto(userId: number) {
    await this.page.goto(`/Admin/Security/Role/${userId}/Copy`);
  }
}
