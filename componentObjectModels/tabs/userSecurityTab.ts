import { Locator, Page } from '@playwright/test';
import { UserAdminPage } from '../../pageObjectModels/users/userAdminPage';
import { ReferenceFieldGrid } from '../controls/referenceFieldGrid';
import { ChangePasswordDialog } from '../dialogs/changePasswordDialog';

export class UserSecurityTab {
  private readonly page: Page;
  readonly sysAdminCheckbox: Locator;
  readonly rolesReferenceFieldGird: ReferenceFieldGrid;
  readonly groupsReferenceFieldGird: ReferenceFieldGrid;
  readonly changePasswordLink: Locator;
  readonly changePasswordDialog: ChangePasswordDialog;

  constructor(userAdminPage: UserAdminPage) {
    this.page = userAdminPage.page;
    this.sysAdminCheckbox = this.page.getByRole('checkbox', { name: /system administrator/i });
    this.rolesReferenceFieldGird = new ReferenceFieldGrid(
      this.page.locator(userAdminPage.createFormControlSelector('Roles', 'div.onx-reference-grid'))
    );
    this.groupsReferenceFieldGird = new ReferenceFieldGrid(
      this.page.locator(userAdminPage.createFormControlSelector('Groups', 'div.onx-reference-grid'))
    );
    this.changePasswordLink = this.page.getByRole('link', {
      name: 'Change Password',
    });
    this.changePasswordDialog = new ChangePasswordDialog(this.page);
  }
}
