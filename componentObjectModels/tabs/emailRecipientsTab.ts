import { Locator, Page } from '@playwright/test';
import { Subscription } from '../../models/emailBody';
import { DualPaneSelector } from './../controls/dualPaneSelector';
import { TreeviewSelector } from './../controls/treeviewSelector';

export class EmailRecipientsTab {
  private readonly page: Page;
  readonly basedOnFieldValuesSelector: DualPaneSelector;
  readonly specificGroupsSelector: DualPaneSelector;
  readonly specificUsersSelector: DualPaneSelector;
  readonly subscriptionSelect: Locator;
  readonly emailTextField: TreeviewSelector;
  readonly specificExternalUsersTextBox: Locator;
  readonly optInCertCheckbox: Locator;

  private getSelectorLocator(label: string) {
    return this.page.locator(`.label:has-text("${label}") + .data .onx-selector`);
  }

  constructor(page: Page) {
    this.page = page;
    this.basedOnFieldValuesSelector = new DualPaneSelector(this.getSelectorLocator('Based on Values in these Fields'));
    this.specificGroupsSelector = new DualPaneSelector(this.getSelectorLocator('Specific Groups'));
    this.specificUsersSelector = new DualPaneSelector(this.getSelectorLocator('Specific Users'));
    this.subscriptionSelect = page.getByRole('listbox', { name: 'Subscription' });
    this.emailTextField = new TreeviewSelector(this.getSelectorLocator('Email Addresses in this Text Field'));
    this.specificExternalUsersTextBox = page.getByRole('textbox', { name: 'Specific External Users' });
    this.optInCertCheckbox = page.getByLabel(
      'Any external recipients have opted-in to this email message and should not be allowed to opt-out'
    );
  }

  async selectSubscription(subscription: Subscription) {
    await this.subscriptionSelect.click();
    await this.subscriptionSelect.page().getByRole('option', { name: subscription }).click();
  }
}
