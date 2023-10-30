import { Locator, Page } from '@playwright/test';
import { ReferenceFieldGrid } from '../componentObjectModels/referenceFieldGrid';
import { BaseAdminFormPage } from './baseAdminFormPage';

export class UserAdminPage extends BaseAdminFormPage {
  readonly generalTabButton: Locator;
  readonly securityTabButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly activeStatusButton: Locator;
  readonly inactiveStatusButton: Locator;
  readonly lockedStatusButton: Locator;
  readonly rolesReferenceFieldGird: ReferenceFieldGrid;

  constructor(page: Page) {
    super(page);
    this.generalTabButton = page.locator('#tab-strip-0').getByText('General');
    this.securityTabButton = page.locator('#tab-strip-0').getByText('Security');
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
    this.rolesReferenceFieldGird = new ReferenceFieldGrid(
      page,
      this.createFormControlSelector('Roles', 'div.onx-reference-grid')
    );
  }
}
