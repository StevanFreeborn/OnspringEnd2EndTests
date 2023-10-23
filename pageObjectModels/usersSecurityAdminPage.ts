import { Locator, Page } from '@playwright/test';
import { DeleteUserDialogComponent } from '../componentObjectModels/deleteUserDialogComponent';
import { BaseAdminPage } from './baseAdminPage';

export class UsersSecurityAdminPage extends BaseAdminPage {
  readonly page: Page;
  readonly path: string;
  readonly userGrid: Locator;
  readonly deleteUserDialog: DeleteUserDialogComponent;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.path = '/Admin/Security/Users';
    this.userGrid = page.locator('#grid');
    this.deleteUserDialog = new DeleteUserDialogComponent(page);
  }

  async goto() {
    await this.page.goto(this.path);
  }
}
