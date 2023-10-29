import { Page } from '@playwright/test';
import { GroupAdminPage } from './groupAdminPage';

export class EditGroupAdminPage extends GroupAdminPage {
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.pathRegex = new RegExp(`${process.env.INSTANCE_URL}/Admin/Security/Group/[0-9]+/Edit`);
  }

  async goto(groupId: number) {
    await this.page.goto(`/Admin/Security/Group/${groupId}/Edit`);
  }
}
