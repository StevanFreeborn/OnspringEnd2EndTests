import { Locator, Page } from '@playwright/test';
import { Trigger } from '../../models/trigger';
import { AddTriggerDialog } from '../dialogs/addTriggerDialog';
import { AddOrEditTriggerModal } from './../modals/addOrEditTriggerModal';

export class AppTriggerTab {
  readonly addTriggerLink: Locator;
  readonly addTriggerDialog: AddTriggerDialog;
  readonly addOrEditTriggerModal: AddOrEditTriggerModal;
  readonly triggersGrid: Locator;

  constructor(page: Page) {
    this.addTriggerLink = page.getByRole('link', { name: 'Add Trigger' });
    this.addTriggerDialog = new AddTriggerDialog(page);
    this.addOrEditTriggerModal = new AddOrEditTriggerModal(page);
    this.triggersGrid = page.locator('#grid-triggers');
  }

  async addTrigger(trigger: Trigger) {
    await this.addTriggerLink.click();
    await this.addTriggerDialog.nameInput.fill(trigger.name);
    await this.addTriggerDialog.saveButton.click();

    await this.addOrEditTriggerModal.fillOutForm(trigger);
    await this.addOrEditTriggerModal.saveButton.click();
  }
}
