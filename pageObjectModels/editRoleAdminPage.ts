import { Page } from '@playwright/test';
import { RoleAdminPage } from './roleAdminPage';

export class EditRoleAdminPage extends RoleAdminPage {
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.pathRegex = new RegExp(`${process.env.INSTANCE_URL}/Admin/Security/Role/[0-9]+/Edit`);
  }

  async goto(roleId: number) {
    await this.page.goto(`/Admin/Security/Role/${roleId}/Edit`);
  }
}
