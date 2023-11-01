import { Page } from '@playwright/test';
import { GroupAdminPage } from './groupAdminPage';

export class AddGroupAdminPage extends GroupAdminPage {
  readonly path: string;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Security/Group/Add';
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async addGroup(groupName: string) {
    await this.goto();
    await this.nameInput.fill(groupName);
    await this.saveRecordButton.click();
  }
}
