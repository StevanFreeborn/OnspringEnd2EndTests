import { Locator, Page } from '@playwright/test';
import { TextFrequencyTab } from '../../componentObjectModels/tabs/textFrequencyTab';
import { TextGeneralTab } from '../../componentObjectModels/tabs/textGeneralTab';
import { TextRecipientsTab } from '../../componentObjectModels/tabs/textRecipientsTab';
import { TextRulesTab } from '../../componentObjectModels/tabs/textRulesTab';
import { TextMessage } from '../../models/textMessage';
import { BaseAdminPage } from '../baseAdminPage';
import { TextContentsTab } from './../../componentObjectModels/tabs/textContentsTab';

export class EditTextMessagePage extends BaseAdminPage {
  readonly pathRegex: RegExp;

  readonly saveButton: Locator;

  readonly generalTabButton: Locator;
  readonly contentsTabButton: Locator;
  readonly recipientsTabButton: Locator;
  readonly frequencyTabButton: Locator;
  readonly rulesTabButton: Locator;

  readonly generalTab: TextGeneralTab;
  readonly contentsTab: TextContentsTab;
  readonly recipientsTab: TextRecipientsTab;
  readonly frequencyTab: TextFrequencyTab;
  readonly rulesTab: TextRulesTab;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/Messaging\/TextMessage\/\d+\/Edit/;

    this.saveButton = page.getByRole('link', { name: 'Save Changes' });

    this.generalTabButton = page.getByRole('tab', { name: 'General' });
    this.contentsTabButton = page.getByRole('tab', { name: 'Contents' });
    this.recipientsTabButton = page.getByRole('tab', { name: 'Recipients' });
    this.frequencyTabButton = page.getByRole('tab', { name: 'Frequency' });
    this.rulesTabButton = page.getByRole('tab', { name: 'Rules' });

    this.generalTab = new TextGeneralTab(page);
    this.contentsTab = new TextContentsTab(page);
    this.recipientsTab = new TextRecipientsTab(page);
    this.frequencyTab = new TextFrequencyTab(page);
    this.rulesTab = new TextRulesTab(page);
  }

  async goto(id: number) {
    await this.page.goto(`/Admin/Messaging/TextMessage/${id}/Edit`);
  }

  async updateTextMessage(textMessage: TextMessage) {
    await this.generalTabButton.click();
    await this.generalTab.fillOutForm(textMessage);

    await this.contentsTabButton.click();
    await this.contentsTab.fillOutForm(textMessage);

    await this.recipientsTabButton.click();
    await this.recipientsTab.fillOutForm(textMessage);

    await this.frequencyTabButton.click();
    await this.frequencyTab.fillOutForm(textMessage);

    await this.rulesTabButton.click();
    await this.rulesTab.fillOutForm(textMessage);
  }

  async save() {
    const saveResponse = this.page.waitForResponse(
      response => response.url().match(this.pathRegex) !== null && response.request().method() === 'POST'
    );

    await this.saveButton.click();
    await saveResponse;
  }
}
