import { Locator, Page } from '@playwright/test';
import { EmailSubscription } from '../../models/emailBody';
import { TreeviewSelector } from './../controls/treeviewSelector';
import { MessageRecipientsTab } from './messageRecipientsTab';

export class EmailRecipientsTab extends MessageRecipientsTab {
  readonly subscriptionSelect: Locator;
  readonly emailTextField: TreeviewSelector;
  readonly specificExternalUsersTextBox: Locator;
  readonly optInCertCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    this.subscriptionSelect = page.getByRole('listbox', { name: 'Subscription' });
    this.emailTextField = new TreeviewSelector(this.getSelectorLocator('Email Addresses in this Text Field'));
    this.specificExternalUsersTextBox = page.getByRole('textbox', { name: 'Specific External Users' });
    this.optInCertCheckbox = page.getByLabel(
      'Any external recipients have opted-in to this email message and should not be allowed to opt-out'
    );
  }

  async selectSubscription(subscription: EmailSubscription) {
    await this.subscriptionSelect.click();
    await this.subscriptionSelect.page().getByRole('option', { name: subscription }).click();
  }
}
