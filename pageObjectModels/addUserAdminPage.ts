import { Page } from '@playwright/test';
import { User, UserStatus } from '../models/user';
import { UserAdminPage } from './userAdminPage';

export class AddUserAdminPage extends UserAdminPage {
  readonly path: string;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Security/User/Add';
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async fillRequiredUserFields(user: User) {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.usernameInput.fill(user.username);
    await this.emailInput.fill(user.email);
  }

  async createUser(user: User) {
    await this.goto();
    await this.fillRequiredUserFields(user);

    switch (user.status) {
      case UserStatus.Active:
        await this.activeStatusButton.click();
        break;
      case UserStatus.Inactive:
        await this.inactiveStatusButton.click();
        break;
      case UserStatus.Locked:
        await this.lockedStatusButton.click();
        break;
      default:
        throw new Error(`Invalid user status: ${user.status}`);
    }

    await this.saveRecordButton.click();
  }
}
