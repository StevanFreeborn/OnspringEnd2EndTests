import { Page } from '@playwright/test';
import { User } from '../models/user';
import { UserAdminPage } from './userAdminPage';

export class AddUserAdminPage extends UserAdminPage {
  readonly path: string;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Security/User/Add';
  }

  async goto() {
    await this.page.goto(this.path, { waitUntil: 'load' });
  }

  async fillRequiredUserFields(user: User) {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.usernameInput.fill(user.username);
    await this.emailInput.fill(user.email);
  }
}
