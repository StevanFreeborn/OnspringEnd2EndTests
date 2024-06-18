import { Page } from '@playwright/test';
import { User, UserStatus } from '../../models/user';
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
    await this.generalTab.firstNameInput.fill(user.firstName);
    await this.generalTab.lastNameInput.fill(user.lastName);
    await this.generalTab.usernameInput.fill(user.username);
    await this.generalTab.emailInput.fill(user.email);
  }

  async addUser(user: User) {
    await this.goto();
    await this.fillRequiredUserFields(user);

    switch (user.status) {
      case UserStatus.Active:
        await this.generalTab.activeStatusButton.click();
        break;
      case UserStatus.Inactive:
        await this.generalTab.inactiveStatusButton.click();
        break;
      case UserStatus.Locked:
        await this.generalTab.lockedStatusButton.click();
        break;
      default:
        throw new Error(`Invalid user status: ${user.status}`);
    }

    if (user.roles.length) {
      for (const role of user.roles) {
        await this.assignRole(role);
      }
    }

    await this.securityTab.sysAdminCheckbox.setChecked(user.sysAdmin);

    await this.saveRecordButton.click();
  }
}
