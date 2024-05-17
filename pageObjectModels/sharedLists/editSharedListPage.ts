import { Locator, Page } from '@playwright/test';
import { ListGeneralTab } from '../../componentObjectModels/tabs/listGeneralTab';
import { ListSharingTab } from '../../componentObjectModels/tabs/listSharingTab';
import { ListValuesTab } from '../../componentObjectModels/tabs/listValuesTab';
import { SharedList } from '../../models/sharedList';
import { BaseAdminPage } from '../baseAdminPage';

export class EditSharedListPage extends BaseAdminPage {
  readonly pathRegex: RegExp;

  readonly saveButton: Locator;

  readonly generalTabButton: Locator;
  readonly valuesTabButton: Locator;
  readonly sharingTabButton: Locator;

  readonly generalTab: ListGeneralTab;
  readonly valuesTab: ListValuesTab;
  readonly sharingTab: ListSharingTab;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/SharedList\/\d+\/Edit/;
    this.saveButton = page.getByRole('link', { name: 'Save Changes' });
    this.generalTabButton = page.getByRole('tab', { name: 'General' });
    this.valuesTabButton = page.getByRole('tab', { name: 'Values' });
    this.sharingTabButton = page.getByRole('tab', { name: 'Sharing' });
    this.generalTab = new ListGeneralTab(page);
    this.valuesTab = new ListValuesTab(page);
    this.sharingTab = new ListSharingTab(page);
  }

  async updateList(list: SharedList) {
    await this.generalTabButton.click();
    await this.generalTab.fillOutForm(list);

    await this.valuesTabButton.click();
    await this.valuesTab.fillOutForm(list);

    await this.sharingTabButton.click();
    await this.sharingTab.fillOutForm(list);
  }

  async save() {
    const saveResponse = this.page.waitForResponse(
      response => response.url().match(this.pathRegex) !== null && response.request().method() === 'POST'
    );

    await this.saveButton.click();
    await saveResponse;
  }
}
