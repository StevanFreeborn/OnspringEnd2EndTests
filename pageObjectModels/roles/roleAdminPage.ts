import { Locator, Page } from '@playwright/test';
import { RoleAdminPermTab } from '../../componentObjectModels/tabs/RoleAdminPermTab';
import { RoleAppPermTab } from '../../componentObjectModels/tabs/roleAppPermTab';
import { RoleGeneralTab } from '../../componentObjectModels/tabs/roleGeneralTab';
import { BaseAdminFormPage } from '../baseAdminFormPage';

export class RoleAdminPage extends BaseAdminFormPage {
  readonly generalTabButton: Locator;
  readonly appPermissionsTabButton: Locator;
  readonly surveyPermissionsTabButton: Locator;
  readonly adminPermissionsTabButton: Locator;
  readonly securityPermissionsTabButton: Locator;
  readonly generalTab: RoleGeneralTab;
  readonly appPermTab: RoleAppPermTab;
  readonly adminPermTab: RoleAdminPermTab;

  constructor(page: Page) {
    super(page);
    this.generalTabButton = page.getByRole('tab', { name: 'General' });
    this.appPermissionsTabButton = page.getByRole('tab', { name: 'App Permissions' });
    this.surveyPermissionsTabButton = page.getByRole('tab', { name: 'Survey Permissions' });
    this.adminPermissionsTabButton = page.getByRole('tab', { name: 'Administration Permissions' });
    this.securityPermissionsTabButton = page.getByRole('tab', { name: 'Security Permissions' });

    this.generalTab = new RoleGeneralTab(this);
    this.appPermTab = new RoleAppPermTab(this);
    this.adminPermTab = new RoleAdminPermTab(page);
  }
}
