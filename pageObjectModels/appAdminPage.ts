import { Locator, Page } from '@playwright/test';
import { LayoutItemType } from '../componentObjectModels/addLayoutItemMenu';
import { AppGeneralTabComponent } from '../componentObjectModels/appGeneralTabComponent';
import { AppLayoutTabComponent } from '../componentObjectModels/appLayoutTabComponent';
import { baseURL } from '../playwright.config';
import { BaseAdminPage } from './baseAdminPage';

type GeocodeFields = {
  address: string;
  city: string;
  state: string;
  zip: string;
};

export class AppAdminPage extends BaseAdminPage {
  readonly path: string;
  readonly pathRegex: RegExp;
  readonly closeButton: Locator;

  readonly generalTabButton: Locator;
  readonly layoutTabButton: Locator;

  readonly generalTab: AppGeneralTabComponent;
  readonly layoutTab: AppLayoutTabComponent;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/App/';
    this.pathRegex = new RegExp(`${baseURL}${this.path}[0-9]+`);
    this.closeButton = page.locator('a:has-text("Close")');

    this.generalTabButton = page.locator('#tab-strip').getByText('General');
    this.layoutTabButton = page.locator('#tab-strip').getByText('Layout');

    this.generalTab = new AppGeneralTabComponent(page);
    this.layoutTab = new AppLayoutTabComponent(page);
  }

  async goto(appId: number) {
    const path = `${this.path}/${appId}`;
    await this.page.goto(path);
  }

  getAppIdFromUrl() {
    if (this.page.url().includes(this.path) === false) {
      throw new Error('The current page is not an app admin page.');
    }

    const url = this.page.url();
    const urlParts = url.split('/');
    const appId = urlParts[urlParts.length - 1];
    return parseInt(appId);
  }

  async enableGeocoding(geocodeFields: GeocodeFields) {
    await this.layoutTabButton.click();

    for (const fieldName of Object.values(geocodeFields)) {
      await this.layoutTab.addLayoutItem(LayoutItemType.TextField, fieldName);
    }

    await this.generalTabButton.click();
    await this.generalTab.editGeocodingSettingsLink.click();
    await this.generalTab.editGeocodingSettingsModal.statusToggle.click();
    await this.generalTab.editGeocodingSettingsModal.selectAddressField(geocodeFields.address);
    await this.generalTab.editGeocodingSettingsModal.selectCityField(geocodeFields.city);
    await this.generalTab.editGeocodingSettingsModal.selectStateField(geocodeFields.state);
    await this.generalTab.editGeocodingSettingsModal.selectZipField(geocodeFields.zip);
    await this.generalTab.editGeocodingSettingsModal.saveButton.click();
  }
}
