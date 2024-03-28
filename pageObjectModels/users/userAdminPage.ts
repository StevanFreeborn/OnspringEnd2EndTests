import { Locator, Page } from '@playwright/test';
import { UserGeneralTab } from '../../componentObjectModels/tabs/userGeneralTab';
import { UserSecurityTab } from '../../componentObjectModels/tabs/userSecurityTab';
import { BaseAdminFormPage } from '../baseAdminFormPage';

export class UserAdminPage extends BaseAdminFormPage {
  readonly pathRegex: RegExp;
  readonly generalTabButton: Locator;
  readonly securityTabButton: Locator;
  readonly generalTab: UserGeneralTab;
  readonly securityTab: UserSecurityTab;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/Security\/User\/\d+\/Edit/;
    this.generalTabButton = page.locator('#tab-strip-0').getByText('General');
    this.securityTabButton = page.locator('#tab-strip-0').getByText('Security');

    this.generalTab = new UserGeneralTab(this);
    this.securityTab = new UserSecurityTab(this);
  }

  async assignRole(roleName: string) {
    await this.securityTabButton.click();
    await this.securityTab.rolesReferenceFieldGird.filterInput.click();
    await this.securityTab.rolesReferenceFieldGird.searchForAndSelectRecord(roleName);
  }
}
