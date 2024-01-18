import { Locator, Page } from '@playwright/test';

export class EditGeocodingSettingsModal {
  private readonly page: Page;
  readonly statusSwitch: Locator;
  readonly statusToggle: Locator;
  readonly geocodingDataGrid: Locator;
  readonly addressSelect: Locator;
  readonly citySelect: Locator;
  readonly stateSelect: Locator;
  readonly zipSelect: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.statusSwitch = page.getByRole('switch', { name: 'Status' });
    this.statusToggle = this.statusSwitch.locator('span').nth(3);
    this.geocodingDataGrid = page.locator('#geocoding-data-row');
    this.addressSelect = this.geocodingDataGrid.getByRole('listbox', { name: 'Street Address' });
    this.citySelect = this.geocodingDataGrid.getByRole('listbox', { name: 'City' });
    this.stateSelect = this.geocodingDataGrid.getByRole('listbox', { name: 'State/Province' });
    this.zipSelect = this.geocodingDataGrid.getByRole('listbox', { name: 'Zip/Postal Code' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  private async selectFieldOption(fieldName: string) {
    await this.page.getByRole('option', { name: fieldName }).click();
  }

  async selectAddressField(fieldName: string) {
    await this.addressSelect.click();
    await this.selectFieldOption(fieldName);
  }

  async selectCityField(fieldName: string) {
    await this.citySelect.click();
    await this.selectFieldOption(fieldName);
  }

  async selectStateField(fieldName: string) {
    await this.stateSelect.click();
    await this.selectFieldOption(fieldName);
  }

  async selectZipField(fieldName: string) {
    await this.zipSelect.click();
    await this.selectFieldOption(fieldName);
  }
}
