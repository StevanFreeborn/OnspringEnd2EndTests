import { Locator, Page } from '@playwright/test';
import { BaseAdminFormPage } from './baseAdminFormPage';

export class UserAdminPage extends BaseAdminFormPage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly activeStatusButton: Locator;
  readonly inactiveStatusButton: Locator;
  readonly lockedStatusButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator(this.createFormControlSelector('First Name'));
    this.lastNameInput = page.locator(this.createFormControlSelector('Last Name'));
    this.usernameInput = page.locator(this.createFormControlSelector('Username'));
    this.emailInput = page.locator(this.createFormControlSelector('Email Address'));
    this.activeStatusButton = page.getByRole('button', {
      name: 'Active',
      exact: true,
    });
    this.inactiveStatusButton = page.getByRole('button', {
      name: 'Inactive',
    });
    this.lockedStatusButton = page.getByRole('button', {
      name: 'Locked',
    });
  }
}
