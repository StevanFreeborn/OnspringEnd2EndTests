import { Locator, Page } from '@playwright/test';
import { EditGeocodingSettingsModal } from '../modals/editGeocodingSettingsModal';
import { BaseGeneralTab } from './baseGeneralTab';

export abstract class BaseAppOrSurveyGeneralTab extends BaseGeneralTab {
  private readonly page: Page;
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
    this.adminPermissions = page.locator(this.createSettingSelector('Administration Permissions'));
    this.adminUsers = page.locator(this.createSettingSelector('Users'));
    this.adminRoles = page.locator(this.createSettingSelector('Roles'));
    this.adminGroups = page.locator(this.createSettingSelector('Groups'));
    this.geocodingStatus = page
      .locator('section > h1:has-text("Geocoding") + div')
      .locator(this.createSettingSelector('Status'));

    this.editAdminSettingsLink = page.getByRole('heading', { name: 'Edit Administration Settings' }).getByRole('link');
    this.editGeocodingSettingsLink = page.getByRole('heading', { name: 'Edit Geocoding' }).getByRole('link');

    this.editGeocodingSettingsModal = new EditGeocodingSettingsModal(page);
  }
}
