import { Locator, Page } from '@playwright/test';
import { Outcome } from '../../models/outcome';
import { OutcomeGeneralTab } from '../tabs/outcomeGeneralTab';
import { BaseEditOutcomeModal } from './baseEditOutcomeModal';

export abstract class EditOutcomeModalWithTabs extends BaseEditOutcomeModal {
  readonly generalTabButton: Locator;
  readonly generalTab: OutcomeGeneralTab;

  constructor(page: Page) {
    super(page);
    this.generalTabButton = this.modal.getByRole('tab', { name: 'General' });
    this.generalTab = new OutcomeGeneralTab(this.modal);
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
