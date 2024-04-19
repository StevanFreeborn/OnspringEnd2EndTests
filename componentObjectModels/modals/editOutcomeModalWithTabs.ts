import { Locator, Page } from '@playwright/test';
import { Outcome } from '../../models/outcome';
import { OutcomeGeneralTab } from '../tabs/outcomeGeneralTab';

export abstract class EditOutcomeModalWithTabs {
  protected readonly modal: Locator;

  readonly generalTabButton: Locator;
  readonly generalTab: OutcomeGeneralTab;

  readonly okButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: /outcome/i });

    this.generalTabButton = this.modal.getByRole('tab', { name: 'General' });
    this.generalTab = new OutcomeGeneralTab(this.modal);

    this.okButton = this.modal.getByRole('button', { name: 'OK' });
    this.cancelButton = this.modal.getByRole('button', { name: 'Cancel' });
  }

  private async needToUpdateSwitch(outcome: Outcome) {
    const switchState = await this.generalTab.statusSwitch.getAttribute('aria-checked');
    return (outcome.status === true && switchState === 'false') || (outcome.status === false && switchState === 'true');
  }

  async fillOutForm(outcome: Outcome) {
    await this.generalTabButton.click();
    await this.generalTab.descriptionEditor.fill(outcome.description);

    if (await this.needToUpdateSwitch(outcome)) {
      await this.generalTab.statusSwitch.click();
    }
  }
}
