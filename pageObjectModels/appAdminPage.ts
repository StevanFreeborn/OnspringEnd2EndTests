import { Locator, Page } from '@playwright/test';
import { EditAppAdminSettingsModalComponent } from '../componentObjectModels/editAppAdminSettingsModalComponent';
import { EditAppDisplaySettingsModalComponent } from '../componentObjectModels/editAppDisplaySettingsModalComponent';
import { EditAppGeneralSettingsModalComponent } from '../componentObjectModels/editAppGeneralSettingsModalComponent';
import { EditAppNotesSettingsModalComponent } from '../componentObjectModels/editAppNotesSettingsModal';
import { BaseAdminPage } from './baseAdminPage';

export class AppAdminPage extends BaseAdminPage {
  readonly path: string;
  readonly pathRegex: RegExp;
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
  readonly closeButton: Locator;

  readonly editAppGeneralSettingsModal: EditAppGeneralSettingsModalComponent;
  readonly editAppDisplaySettingsModal: EditAppDisplaySettingsModalComponent;
  readonly editAppAdminSettingsModal: EditAppAdminSettingsModalComponent;
  readonly editAppNotesSettingsModal: EditAppNotesSettingsModalComponent;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/App/';
    this.pathRegex = new RegExp(`${process.env.INSTANCE_URL}${this.path}[0-9]+`);
    this.appName = page.locator(this.createAppSettingSelector('Name'));
    this.appStatus = page.locator(this.createAppSettingSelector('Status'));
    this.appDescription = page.locator(this.createAppSettingSelector('Description'));
    this.appContentVersionStatus = page.locator(
      this.createAppSettingSelector('Content Versioning')
    );
    this.concurrentEditAlertStatus = page.locator(
      this.createAppSettingSelector('Concurrent Edit Alert')
    );
    this.displayLink = page.locator(this.createAppSettingSelector('Display Link Field'));
    this.integrationLink = page.locator(this.createAppSettingSelector('Integration Link Field'));
    this.displayFields = page.locator(this.createAppSettingSelector('Display Fields'));
    this.sort = page.locator(this.createAppSettingSelector('Sort'));
    this.adminPermissions = page.locator(
      this.createAppSettingSelector('Administration Permissions')
    );
    this.adminUsers = page.locator(this.createAppSettingSelector('Users'));
    this.adminRoles = page.locator(this.createAppSettingSelector('Roles'));
    this.adminGroups = page.locator(this.createAppSettingSelector('Groups'));
    this.appNotes = page.locator(this.createAppSettingSelector('Notes'));

    this.editGeneralSettingsLink = page
      .getByRole('heading', { name: 'Edit General Settings' })
      .getByRole('link');
    this.editDisplaySettingsLink = page
      .getByRole('heading', { name: 'Edit Display Settings' })
      .getByRole('link');
    this.editAdminSettingsLink = page
      .getByRole('heading', { name: 'Edit Administration Settings' })
      .getByRole('link');
    this.editNotesSettingLink = page.getByRole('heading', { name: 'Edit Notes' }).getByRole('link');
    this.closeButton = page.locator('a:has-text("Close")');

    this.editAppDisplaySettingsModal = new EditAppDisplaySettingsModalComponent(page);
    this.editAppGeneralSettingsModal = new EditAppGeneralSettingsModalComponent(page);
    this.editAppAdminSettingsModal = new EditAppAdminSettingsModalComponent(page);
    this.editAppNotesSettingsModal = new EditAppNotesSettingsModalComponent(page);
  }

  private createAppSettingSelector(settingName: string) {
    return `td:nth-match(td:has-text("${settingName}") + td, 1)`;
  }

  async goto(appId: number) {
    const path = `${this.path}/${appId}`;
    await this.page.goto(path);
  }
}
