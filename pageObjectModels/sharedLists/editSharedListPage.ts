import { Locator, Page } from '@playwright/test';
import { ListGeneralTab } from '../../componentObjectModels/tabs/listGeneralTab';
import { BaseAdminPage } from '../baseAdminPage';

export class EditSharedListPage extends BaseAdminPage {
  readonly pathRegex: RegExp;

  readonly generalTabButton: Locator;
  readonly valuesTabButton: Locator;
  readonly sharingTabButton: Locator;

  readonly generalTab: ListGeneralTab;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/SharedList\/\d+\/Edit/;
    this.generalTabButton = page.getByRole('tab', { name: 'General' });
    this.valuesTabButton = page.getByRole('tab', { name: 'Values' });
    this.sharingTabButton = page.getByRole('tab', { name: 'Sharing' });
    this.generalTab = new ListGeneralTab(page);
  }
}
