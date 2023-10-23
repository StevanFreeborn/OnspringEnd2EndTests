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

  getFieldSelector(field: string, controlSelector = 'input') {
    const pascalCaseFieldName = field
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
    return `td.data-${pascalCaseFieldName} ${controlSelector}`;
  }

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator(this.getFieldSelector('First Name'));
    this.lastNameInput = page.locator(this.getFieldSelector('Last Name'));
    this.usernameInput = page.locator(this.getFieldSelector('Username'));
    this.emailInput = page.locator(this.getFieldSelector('Email Address'));
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
    this.saveRecordButton = page.getByRole('link', { name: 'Save Record' });
  }
}
