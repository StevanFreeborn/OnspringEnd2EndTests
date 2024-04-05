import { FrameLocator, Locator, Page } from '@playwright/test';
import { Trigger } from '../../models/trigger';
import { TriggerGeneralTab } from '../tabs/triggerGeneralTab';

export class AddOrEditTriggerModal {
  private readonly modal: Locator;
  private readonly frame: FrameLocator;

  readonly generalSettingsTabButton: Locator;
  readonly generalTab: TriggerGeneralTab;

  readonly rulesTabButton: Locator;

  readonly outcomesTabButton: Locator;

  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog');
    this.frame = this.modal.frameLocator('iframe');

    this.generalSettingsTabButton = this.frame.getByRole('tab', { name: 'General Settings' });
    this.generalTab = new TriggerGeneralTab(this.frame);

    this.rulesTabButton = this.frame.getByRole('tab', { name: 'Rules' });

    this.outcomesTabButton = this.frame.getByRole('tab', { name: 'Outcomes' });

    this.saveButton = this.modal.getByRole('button', { name: 'Save' });
    this.cancelButton = this.modal.getByRole('button', { name: 'Cancel' });
  }

  private async needToUpdateSwitch(trigger: Trigger) {
    const switchState = await this.generalTab.statusSwitch.getAttribute('aria-checked');
    return (trigger.status === true && switchState === 'false') || (trigger.status === false && switchState === 'true');
  }

  async fillOutForm(trigger: Trigger) {
    await this.generalSettingsTabButton.click();
    await this.generalTab.nameInput.fill(trigger.name);
    await this.generalTab.descriptionEditor.fill(trigger.description);

    if (await this.needToUpdateSwitch(trigger)) {
      await this.generalTab.statusToggle.click();
    }
  }
}
