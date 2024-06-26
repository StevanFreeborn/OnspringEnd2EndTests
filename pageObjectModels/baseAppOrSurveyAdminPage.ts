import { Locator, Page } from '@playwright/test';
import { BaseAppOrSurveyGeneralTab } from '../componentObjectModels/tabs/baseAppOrSurveyGeneralTab';
import { BaseLayoutTab } from '../componentObjectModels/tabs/baseLayoutTab';
import { TextField } from '../models/textField';
import { BaseAdminPage } from './baseAdminPage';

type GeocodeFields = {
  address: TextField;
  city: TextField;
  state: TextField;
  zip: TextField;
};

export abstract class BaseAppOrSurveyAdminPage extends BaseAdminPage {
  abstract readonly path: string;
  abstract readonly pathRegex: RegExp;
  readonly closeButton: Locator;

  readonly generalTabButton: Locator;
  readonly layoutTabButton: Locator;
  readonly triggersTabButton: Locator;
  readonly messagingTabButton: Locator;
  readonly documentsTabButton: Locator;

  abstract readonly generalTab: BaseAppOrSurveyGeneralTab;
  abstract readonly layoutTab: BaseLayoutTab;

  protected constructor(page: Page) {
    super(page);
    this.closeButton = page.locator('a:has-text("Close")');

    this.generalTabButton = page.getByRole('tab', { name: 'General' });
    this.layoutTabButton = page.getByRole('tab', { name: 'Layout' });
    this.triggersTabButton = page.getByRole('tab', { name: 'Triggers' });
    this.messagingTabButton = page.getByRole('tab', { name: 'Messaging' });
    this.documentsTabButton = page.getByRole('tab', { name: 'Documents' });
  }

  abstract getIdFromUrl(): number;

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
