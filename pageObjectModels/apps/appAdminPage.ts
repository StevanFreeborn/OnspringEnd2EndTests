import { Page } from '@playwright/test';
import { AppGeneralTab } from '../../componentObjectModels/tabs/appGeneralTab';
import { AppLayoutTab } from '../../componentObjectModels/tabs/appLayoutTab';
import { AppMessagingTab } from '../../componentObjectModels/tabs/appMessagingTab';
import { TextField } from '../../models/textField';
import { BASE_URL } from '../../playwright.config';
import { BaseAppOrSurveyAdminPage } from '../baseAppOrSurveyAdminPage';

type GeocodeFields = {
  address: TextField;
  city: TextField;
  state: TextField;
  zip: TextField;
};

export class AppAdminPage extends BaseAppOrSurveyAdminPage {
  readonly path: string;
  readonly pathRegex: RegExp;

  readonly generalTab: AppGeneralTab;
  readonly layoutTab: AppLayoutTab;
  readonly messagingTab: AppMessagingTab;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/App/';
    this.pathRegex = new RegExp(`${BASE_URL}${this.path}[0-9]+`);

    this.generalTab = new AppGeneralTab(page);
    this.layoutTab = new AppLayoutTab(page);
    this.messagingTab = new AppMessagingTab(page);
  }

  async goto(appId: number) {
    const path = `${this.path}/${appId}`;
    await this.page.goto(path);
  }

  getIdFromUrl() {
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

    for (const field of Object.values(geocodeFields)) {
      await this.layoutTab.addLayoutItemFromFieldsAndObjectsGrid(field);
    }

    await this.generalTabButton.click();
    await this.generalTab.editGeocodingSettingsLink.click();
    await this.generalTab.editGeocodingSettingsModal.statusToggle.click();
    await this.generalTab.editGeocodingSettingsModal.selectAddressField(geocodeFields.address.name);
    await this.generalTab.editGeocodingSettingsModal.selectCityField(geocodeFields.city.name);
    await this.generalTab.editGeocodingSettingsModal.selectStateField(geocodeFields.state.name);
    await this.generalTab.editGeocodingSettingsModal.selectZipField(geocodeFields.zip.name);
    await this.generalTab.editGeocodingSettingsModal.saveButton.click();
  }
}
