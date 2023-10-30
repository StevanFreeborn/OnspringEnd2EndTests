import { Page } from '@playwright/test';
import { baseURL } from '../playwright.config';
import { GroupAdminPage } from './groupAdminPage';

export class EditGroupAdminPage extends GroupAdminPage {
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.pathRegex = new RegExp(`${baseURL}/Admin/Security/Group/[0-9]+/Edit`);
  }

  async goto(groupId: number) {
    await this.page.goto(`/Admin/Security/Group/${groupId}/Edit`);
  }
}
