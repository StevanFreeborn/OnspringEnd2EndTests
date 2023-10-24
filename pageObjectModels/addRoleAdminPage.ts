import { Page } from '@playwright/test';
import { RoleAdminPage } from './roleAdminPage';

export class AddRoleAdminPage extends RoleAdminPage {
  readonly path: string;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Security/Role/Add';
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async addRole(roleName: string) {
    await this.goto();
    await this.nameInput.fill(roleName);

    // TODO: Remove the following when #3983 is fixed
    // https://corp.onspring.com/Content/8/3983
    await this.statusToggle.click();
    await this.statusToggle.click();

    await this.saveRecordButton.click();
  }
}
