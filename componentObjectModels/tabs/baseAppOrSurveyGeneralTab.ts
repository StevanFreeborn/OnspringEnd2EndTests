import { Locator, Page } from '@playwright/test';
import { EditGeocodingSettingsModal } from '../modals/editGeocodingSettingsModal';
import { BaseGeneralTab } from './baseGeneralTab';

export abstract class BaseAppOrSurveyGeneralTab extends BaseGeneralTab {
  private readonly page: Page;
  private readonly adminSettingsSection: Locator;
  readonly adminPermissions: Locator;
  readonly adminUsers: Locator;
  readonly adminRoles: Locator;
  readonly adminGroups: Locator;
  readonly geocodingStatus: Locator;

  readonly editAdminSettingsLink: Locator;
  readonly editGeocodingSettingsLink: Locator;

  readonly editGeocodingSettingsModal: EditGeocodingSettingsModal;

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

  constructor(page: Page) {
    super(page);
    this.page = page;

    this.adminSettingsSection = this.page.locator('.section', {
      has: this.page.getByRole('heading', { name: 'Administration Settings' }),
    });
    this.adminPermissions = this.adminSettingsSection.locator(this.createSettingSelector('Administration Permissions'));
    this.adminUsers = this.adminSettingsSection.locator(this.createSettingSelector('Users'));
    this.adminRoles = this.adminSettingsSection.locator(this.createSettingSelector('Roles'));
    this.adminGroups = this.adminSettingsSection.locator(this.createSettingSelector('Groups'));
    this.geocodingStatus = this.page
      .locator('section > h1:has-text("Geocoding") + div')
      .locator(this.createSettingSelector('Status'));

    this.editAdminSettingsLink = this.page
      .getByRole('heading', { name: 'Edit Administration Settings' })
      .getByRole('link');

    this.editGeocodingSettingsLink = this.page.getByRole('heading', { name: 'Edit Geocoding' }).getByRole('link');
    this.editGeocodingSettingsModal = new EditGeocodingSettingsModal(this.page);
  }
}
