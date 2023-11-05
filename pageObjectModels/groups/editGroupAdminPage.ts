import { Page } from '@playwright/test';
import { BASE_URL } from '../../playwright.config';
import { GroupAdminPage } from './groupAdminPage';

export class EditGroupAdminPage extends GroupAdminPage {
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.pathRegex = new RegExp(`${BASE_URL}/Admin/Security/Group/[0-9]+/Edit`);
  }

  async goto(groupId: number) {
    await this.page.goto(`/Admin/Security/Group/${groupId}/Edit`);
  }

  async saveGroup() {
    const saveResponse = this.page.waitForResponse(this.pathRegex);
    await this.saveRecordButton.click();
    await saveResponse;
  }
}
