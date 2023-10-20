import { Locator, Page } from '@playwright/test';
import { BaseAdminPage } from './baseAdminPage';

export class UserAdminPage extends BaseAdminPage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly activeStatusButton: Locator;
  readonly inactiveStatusButton: Locator;
  readonly lockedStatusButton: Locator;
  readonly saveRecordButton: Locator;

  getFieldSelector(field: string, element = 'input') {
    return `td:nth-match(td:has-text("${field}") + td ${element}, 1)`;
  }

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator(
      'td:nth-match(td:has-text("First Name") + td input, 1)'
    );
    this.lastNameInput = page.locator(this.getFieldSelector('Last Name'));
    this.usernameInput = page.locator(this.getFieldSelector('Username'));
    this.emailInput = page.locator(this.getFieldSelector('Email'));
    this.activeStatusButton = page.getByRole('button', {
      name: 'Active',
    });
    this.inactiveStatusButton = page.getByRole('button', {
      name: 'Inactive',
    });
    this.lockedStatusButton = page.getByRole('button', {
      name: 'Locked',
    });
    this.saveRecordButton = page.getByRole('button', {
      name: 'Save Record',
    });
  }
}
