import { Locator, Page } from '@playwright/test';
import { Outcome } from '../../models/outcome';
import { BaseEditOutcomeModal } from './baseEditOutcomeModal';

export abstract class EditOutcomeModal extends BaseEditOutcomeModal {
  readonly descriptionEditor: Locator;
  readonly statusToggle: Locator;
  readonly statusSwitch: Locator;

  constructor(page: Page) {
    super(page);
    this.descriptionEditor = this.modal.locator('.content-area.mce-content-body');
    this.statusSwitch = this.modal.getByRole('switch');
    this.statusToggle = this.statusSwitch.locator('span').nth(3);
  }

  private async needToUpdateSwitch(outcome: Outcome) {
    const switchState = await this.statusSwitch.getAttribute('aria-checked');
    return (outcome.status === true && switchState === 'false') || (outcome.status === false && switchState === 'true');
  }

  async fillOutForm(outcome: Outcome) {
    await this.descriptionEditor.fill(outcome.description);

    if (await this.needToUpdateSwitch(outcome)) {
      await this.statusSwitch.click();
    }
  }
}
