import { Page } from '@playwright/test';
import { BASE_URL } from '../../playwright.config';
import { GroupAdminPage } from './groupAdminPage';

export class CopyGroupAdminPage extends GroupAdminPage {
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.pathRegex = new RegExp(`${BASE_URL}/Admin/Security/Group/[0-9]+/Copy`);
  }

  async goto(userId: number) {
    await this.page.goto(`/Admin/Security/Group/${userId}/Copy`);
  }
}
