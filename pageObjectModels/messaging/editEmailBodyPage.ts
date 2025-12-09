import { Locator, Page } from '@playwright/test';
import { EmailContentsTab } from '../../componentObjectModels/tabs/emailContentsTab';
import { EmailFrequencyTab } from '../../componentObjectModels/tabs/emailFrequencyTab';
import { EmailGeneralTab } from '../../componentObjectModels/tabs/emailGeneralTab';
import { EmailRecipientsTab } from '../../componentObjectModels/tabs/emailRecipientsTab';
import { EmailRulesTab } from '../../componentObjectModels/tabs/emailRulesTab';
import { EmailSenderTab } from '../../componentObjectModels/tabs/emailSenderTab';
import { EmailBody } from '../../models/emailBody';
import { BaseAdminPage } from '../baseAdminPage';

export class EditEmailBodyPage extends BaseAdminPage {
  readonly pathRegex: RegExp;

  readonly saveButton: Locator;

  readonly generalTabButton: Locator;
  readonly contentsTabButton: Locator;
  readonly recipientsTabButton: Locator;
  readonly senderTabButton: Locator;
  readonly frequencyTabButton: Locator;
  readonly rulesTabButton: Locator;

  readonly generalTab: EmailGeneralTab;
  readonly contentsTab: EmailContentsTab;
  readonly recipientsTab: EmailRecipientsTab;
  readonly senderTab: EmailSenderTab;
  readonly frequencyTab: EmailFrequencyTab;
  readonly rulesTab: EmailRulesTab;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/Messaging\/EmailBody\/\d+\/Edit/;

    this.saveButton = this.page.getByRole('link', { name: 'Save Changes' });

    this.generalTabButton = this.page.getByRole('tab', { name: 'General' });
    this.contentsTabButton = this.page.getByRole('tab', { name: 'Contents' });
    this.recipientsTabButton = this.page.getByRole('tab', { name: 'Recipients' });
    this.senderTabButton = this.page.getByRole('tab', { name: 'Sender' });
    this.frequencyTabButton = this.page.getByRole('tab', { name: 'Frequency' });
    this.rulesTabButton = this.page.getByRole('tab', { name: 'Rules' });

    this.generalTab = new EmailGeneralTab(this.page);
    this.contentsTab = new EmailContentsTab(this.page);
    this.recipientsTab = new EmailRecipientsTab(this.page);
    this.senderTab = new EmailSenderTab(this.page);
    this.frequencyTab = new EmailFrequencyTab(this.page);
    this.rulesTab = new EmailRulesTab(this.page);
  }

  private async fillOutGeneralTab(emailBody: EmailBody) {
    await this.generalTabButton.click();
    await this.generalTab.nameInput.fill(emailBody.name);
    await this.generalTab.descriptionEditor.fill(emailBody.description);
    await this.generalTab.selectTemplate(emailBody.template);

    if (emailBody.status) {
      await this.generalTab.enableStatus();
    } else {
      await this.generalTab.disableStatus();
    }
  }

  private async fillOutContentsTab(emailBody: EmailBody) {
    await this.contentsTabButton.click();
    await this.contentsTab.subjectInput.fill(emailBody.subject);
    await this.contentsTab.bodyEditor.fill(emailBody.body);

    if (emailBody.allowDownloads) {
      await this.contentsTab.enableDownloads();
    } else {
      await this.contentsTab.disableDownloads();
    }

    if (emailBody.recordLinkText) {
      await this.contentsTab.fieldsBank.getByText('Record Link').click();
      await this.contentsTab.recordLinkTextInput.fill(emailBody.recordLinkText);
    }
  }

  private async fillOutRecipientsTab(emailBody: EmailBody) {
    await this.recipientsTabButton.click();

    if (emailBody.recipientsBasedOnFields.length !== 0) {
      await this.recipientsTab.basedOnFieldValuesSelector.selectOptions(emailBody.recipientsBasedOnFields);
    }

    if (emailBody.specificGroups) {
      await this.recipientsTab.specificGroupsSelector.selectOptions(emailBody.specificGroups);
    }

    if (emailBody.specificUsers) {
      await this.recipientsTab.specificUsersSelector.selectOptions(emailBody.specificUsers);
    }

    await this.recipientsTab.selectSubscription(emailBody.subscription);

    if (emailBody.emailAddressesInTextField) {
      await this.recipientsTab.emailTextField.selectOption(emailBody.emailAddressesInTextField);
    }

    if (emailBody.specificExternalUsers.length !== 0) {
      await this.recipientsTab.specificExternalUsersTextBox.fill(emailBody.specificExternalUsers.join('\n'));
    }

    const optInCertificationVisible = await this.recipientsTab.optInCertCheckbox.isVisible();

    if (optInCertificationVisible) {
      await this.recipientsTab.optInCertCheckbox.setChecked(emailBody.optInCertification);
    }
  }

  private async fillOutSenderTab(emailBody: EmailBody) {
    await this.senderTabButton.click();
    await this.senderTab.fromNameInput.fill(emailBody.fromName);
    await this.senderTab.enterFromAddress(emailBody.fromAddress);
    await this.senderTab.selectPriority(emailBody.priority);
  }

  private async fillOutFrequencyTab(emailBody: EmailBody) {
    await this.frequencyTabButton.click();
    await this.frequencyTab.selectSendOnSaveFrequency(emailBody.sendOnSave);

    if (emailBody.enableReminders) {
      await this.frequencyTab.enableReminders(emailBody.reminderDateField);
      await this.frequencyTab.addReminders(emailBody.reminders);
    }
  }

  private async fillOutRulesTab(emailBody: EmailBody) {
    await this.rulesTabButton.click();

    if (emailBody.sendLogic) {
      await this.rulesTab.sendLogic.addLogic(emailBody.sendLogic);
    }
  }

  async updateEmailBody(emailBody: EmailBody) {
    await this.fillOutGeneralTab(emailBody);
    await this.fillOutContentsTab(emailBody);
    await this.fillOutRecipientsTab(emailBody);
    await this.fillOutSenderTab(emailBody);
    await this.fillOutFrequencyTab(emailBody);
    await this.fillOutRulesTab(emailBody);
  }

  async save() {
    const saveResponse = this.page.waitForResponse(
      response => response.url().match(this.pathRegex) !== null && response.request().method() === 'POST'
    );
    await this.saveButton.click();
    await saveResponse;
  }
}
