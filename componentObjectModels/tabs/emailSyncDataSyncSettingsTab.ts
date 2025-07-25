import { Locator, Page } from '../../fixtures';
import { EmailSync } from '../../models/emailSync';

export class EmailSyncDataSyncSettingsTab {
  private readonly syncTypeSelector: Locator;
  private readonly messagingSelector: Locator;

  constructor(page: Page) {
    this.syncTypeSelector = page.locator('.label:has-text("Sync Type") + .data').getByRole('listbox');
    this.messagingSelector = page.locator('.label:has-text("Messaging") + .data').getByRole('listbox');
  }

  private async selectSyncType(syncType: string) {
    await this.syncTypeSelector.click();
    await this.syncTypeSelector.page().getByRole('option', { name: syncType }).click();
  }

  private async selectMessaging(messaging: string) {
    await this.messagingSelector.click();
    await this.messagingSelector.page().getByRole('option', { name: messaging }).click();
  }

  async fillOutForm(emailSync: EmailSync) {
    await this.selectSyncType(emailSync.syncType);
    await this.selectMessaging(emailSync.messaging);
  }
}
