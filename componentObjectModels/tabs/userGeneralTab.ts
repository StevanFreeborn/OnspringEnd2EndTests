import { Locator } from '@playwright/test';
import { UserAdminPage } from '../../pageObjectModels/users/userAdminPage';

export class UserGeneralTab {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly activeStatusButton: Locator;
  readonly inactiveStatusButton: Locator;
  readonly lockedStatusButton: Locator;

  constructor(userAdminPage: UserAdminPage) {
    this.firstNameInput = userAdminPage.page.locator(userAdminPage.createFormControlSelector('First Name'));
    this.lastNameInput = userAdminPage.page.locator(userAdminPage.createFormControlSelector('Last Name'));
    this.usernameInput = userAdminPage.page.locator(userAdminPage.createFormControlSelector('Username'));
    this.emailInput = userAdminPage.page.locator(userAdminPage.createFormControlSelector('Email Address'));
    this.activeStatusButton = userAdminPage.page.getByRole('button', {
      name: 'Active',
      exact: true,
    });
    this.inactiveStatusButton = userAdminPage.page.getByRole('button', {
      name: 'Inactive',
    });
    this.lockedStatusButton = userAdminPage.page.getByRole('button', {
      name: 'Locked',
    });
  }
}
