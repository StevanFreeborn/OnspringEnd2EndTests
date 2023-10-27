import { Locator, Page } from '@playwright/test';
import { EditAppAdminSettingsModalComponent } from './editAppAdminSettingsModalComponent';
import { EditAppDisplaySettingsModalComponent } from './editAppDisplaySettingsModalComponent';
import { EditAppGeneralSettingsModalComponent } from './editAppGeneralSettingsModalComponent';
import { EditAppNotesSettingsModalComponent } from './editAppNotesSettingsModal';

export class AppGeneralTabComponent {
  readonly appName: Locator;
  readonly appStatus: Locator;
  readonly appDescription: Locator;
  readonly appContentVersionStatus: Locator;
  readonly concurrentEditAlertStatus: Locator;
  readonly displayLink: Locator;
  readonly integrationLink: Locator;
  readonly displayFields: Locator;
  readonly sort: Locator;
  readonly adminPermissions: Locator;
  readonly adminUsers: Locator;
  readonly adminRoles: Locator;
  readonly adminGroups: Locator;
  readonly appNotes: Locator;

  readonly editGeneralSettingsLink: Locator;
  readonly editDisplaySettingsLink: Locator;
  readonly editAdminSettingsLink: Locator;
  readonly editNotesSettingLink: Locator;

  readonly editAppGeneralSettingsModal: EditAppGeneralSettingsModalComponent;
  readonly editAppDisplaySettingsModal: EditAppDisplaySettingsModalComponent;
  readonly editAppAdminSettingsModal: EditAppAdminSettingsModalComponent;
  readonly editAppNotesSettingsModal: EditAppNotesSettingsModalComponent;

  private createAppSettingSelector(settingName: string) {
    return `td:nth-match(td:has-text("${settingName}") + td, 1)`;
  }

  constructor(page: Page) {
    this.appName = page.locator(this.createAppSettingSelector('Name'));
    this.appStatus = page.locator(this.createAppSettingSelector('Status'));
    this.appDescription = page.locator(this.createAppSettingSelector('Description'));
    this.appContentVersionStatus = page.locator(this.createAppSettingSelector('Content Versioning'));
    this.concurrentEditAlertStatus = page.locator(this.createAppSettingSelector('Concurrent Edit Alert'));
    this.displayLink = page.locator(this.createAppSettingSelector('Display Link Field'));
    this.integrationLink = page.locator(this.createAppSettingSelector('Integration Link Field'));
    this.displayFields = page.locator(this.createAppSettingSelector('Display Fields'));
    this.sort = page.locator(this.createAppSettingSelector('Sort'));
    this.adminPermissions = page.locator(this.createAppSettingSelector('Administration Permissions'));
    this.adminUsers = page.locator(this.createAppSettingSelector('Users'));
    this.adminRoles = page.locator(this.createAppSettingSelector('Roles'));
    this.adminGroups = page.locator(this.createAppSettingSelector('Groups'));
    this.appNotes = page.locator(this.createAppSettingSelector('Notes'));

    this.editGeneralSettingsLink = page.getByRole('heading', { name: 'Edit General Settings' }).getByRole('link');
    this.editDisplaySettingsLink = page.getByRole('heading', { name: 'Edit Display Settings' }).getByRole('link');
    this.editAdminSettingsLink = page.getByRole('heading', { name: 'Edit Administration Settings' }).getByRole('link');
    this.editNotesSettingLink = page.getByRole('heading', { name: 'Edit Notes' }).getByRole('link');

    this.editAppDisplaySettingsModal = new EditAppDisplaySettingsModalComponent(page);
    this.editAppGeneralSettingsModal = new EditAppGeneralSettingsModalComponent(page);
    this.editAppAdminSettingsModal = new EditAppAdminSettingsModalComponent(page);
    this.editAppNotesSettingsModal = new EditAppNotesSettingsModalComponent(page);
  }
}
