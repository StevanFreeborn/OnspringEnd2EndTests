import { Locator, Page } from '@playwright/test';
import { EditAppAdminSettingsModalComponent } from './editAppAdminSettingsModalComponent';
import { EditAppDisplaySettingsModalComponent } from './editAppDisplaySettingsModalComponent';
import { EditAppGeneralSettingsModalComponent } from './editAppGeneralSettingsModalComponent';
import { EditAppGeocodingSettingsModal } from './editAppGeocodingSettingsModal';
import { EditAppNotesSettingsModalComponent } from './editAppNotesSettingsModal';

export class AppGeneralTabComponent {
  private createSettingSelector(settingName: string) {
    return `td:nth-match(td:has-text("${settingName}") + td, 1)`;
  }

  private readonly page: Page;
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
  readonly geocodingStatus: Locator;
  get geocodingData() {
    const grid = this.page.locator(this.createSettingSelector('Geocoding Data'));
    return {
      grid: grid,
      address: grid.locator(this.createSettingSelector('Street Address')),
      city: grid.locator(this.createSettingSelector('City')),
      state: grid.locator(this.createSettingSelector('State/Province')),
      zip: grid.locator(this.createSettingSelector('Zip/Postal Code')),
    };
  }

  readonly appNotes: Locator;

  readonly editGeneralSettingsLink: Locator;
  readonly editDisplaySettingsLink: Locator;
  readonly editAdminSettingsLink: Locator;
  readonly editGeocodingSettingsLink: Locator;
  readonly editNotesSettingLink: Locator;

  readonly editAppGeneralSettingsModal: EditAppGeneralSettingsModalComponent;
  readonly editAppDisplaySettingsModal: EditAppDisplaySettingsModalComponent;
  readonly editAppAdminSettingsModal: EditAppAdminSettingsModalComponent;
  readonly editAppNotesSettingsModal: EditAppNotesSettingsModalComponent;
  readonly editGeocodingSettingsModal: EditAppGeocodingSettingsModal;

  constructor(page: Page) {
    this.page = page;
    this.appName = page.locator(this.createSettingSelector('Name'));
    this.appStatus = page.locator(this.createSettingSelector('Status'));
    this.appDescription = page.locator(this.createSettingSelector('Description'));
    this.appContentVersionStatus = page.locator(this.createSettingSelector('Content Versioning'));
    this.concurrentEditAlertStatus = page.locator(this.createSettingSelector('Concurrent Edit Alert'));
    this.displayLink = page.locator(this.createSettingSelector('Display Link Field'));
    this.integrationLink = page.locator(this.createSettingSelector('Integration Link Field'));
    this.displayFields = page.locator(this.createSettingSelector('Display Fields'));
    this.sort = page.locator(this.createSettingSelector('Sort'));
    this.adminPermissions = page.locator(this.createSettingSelector('Administration Permissions'));
    this.adminUsers = page.locator(this.createSettingSelector('Users'));
    this.adminRoles = page.locator(this.createSettingSelector('Roles'));
    this.adminGroups = page.locator(this.createSettingSelector('Groups'));
    this.geocodingStatus = page
      .locator('section > h1:has-text("Geocoding") + div')
      .locator(this.createSettingSelector('Status'));
    this.appNotes = page.locator(this.createSettingSelector('Notes'));

    this.editGeneralSettingsLink = page.getByRole('heading', { name: 'Edit General Settings' }).getByRole('link');
    this.editDisplaySettingsLink = page.getByRole('heading', { name: 'Edit Display Settings' }).getByRole('link');
    this.editAdminSettingsLink = page.getByRole('heading', { name: 'Edit Administration Settings' }).getByRole('link');
    this.editGeocodingSettingsLink = page.getByRole('heading', { name: 'Edit Geocoding' }).getByRole('link');
    this.editNotesSettingLink = page.getByRole('heading', { name: 'Edit Notes' }).getByRole('link');

    this.editAppGeneralSettingsModal = new EditAppGeneralSettingsModalComponent(page);
    this.editAppDisplaySettingsModal = new EditAppDisplaySettingsModalComponent(page);
    this.editAppAdminSettingsModal = new EditAppAdminSettingsModalComponent(page);
    this.editAppNotesSettingsModal = new EditAppNotesSettingsModalComponent(page);
    this.editGeocodingSettingsModal = new EditAppGeocodingSettingsModal(page);
  }
}
