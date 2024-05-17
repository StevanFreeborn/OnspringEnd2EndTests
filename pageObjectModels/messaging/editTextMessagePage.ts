import { Locator, Page } from '@playwright/test';
import { TextGeneralTab } from '../../componentObjectModels/tabs/textGeneralTab';
import { BaseAdminPage } from '../baseAdminPage';

export class EditTextMessagePage extends BaseAdminPage {
  readonly pathRegex: RegExp;

  readonly generalTabButton: Locator;
  readonly contentsTabButton: Locator;
  readonly recipientsTabButton: Locator;
  readonly frequencyTabButton: Locator;
  readonly rulesTabButton: Locator;

  readonly generalTab: TextGeneralTab;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/Messaging\/TextMessage\/\d+\/Edit/;

    this.generalTabButton = page.getByRole('tab', { name: 'General' });
    this.contentsTabButton = page.getByRole('tab', { name: 'Contents' });
    this.recipientsTabButton = page.getByRole('tab', { name: 'Recipients' });
    this.frequencyTabButton = page.getByRole('tab', { name: 'Frequency' });
    this.rulesTabButton = page.getByRole('tab', { name: 'Rules' });

    this.generalTab = new TextGeneralTab(page);
  }

  async goto(id: number) {
    await this.page.goto(`/Admin/Messaging/TextMessage/${id}/Edit`);
  }
}
