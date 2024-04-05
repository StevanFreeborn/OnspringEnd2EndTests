import { Locator, Page } from '@playwright/test';
import { OutcomeType } from '../../models/outcome';
import { Trigger } from '../../models/trigger';
import { AddTriggerDialog } from '../dialogs/addTriggerDialog';
import { DeleteTriggerDialog } from '../dialogs/deleteTriggerDialog';
import { AddOrEditTriggerModal } from './../modals/addOrEditTriggerModal';

export class AppTriggerTab {
  private readonly filterByOutcomeSelector: Locator;
  readonly addTriggerLink: Locator;
  readonly addTriggerDialog: AddTriggerDialog;
  readonly addOrEditTriggerModal: AddOrEditTriggerModal;
  readonly triggersGrid: Locator;
  readonly deleteTriggerDialog: DeleteTriggerDialog;

  constructor(page: Page) {
    this.addTriggerLink = page.getByRole('link', { name: 'Add Trigger' });
    this.addTriggerDialog = new AddTriggerDialog(page);
    this.addOrEditTriggerModal = new AddOrEditTriggerModal(page);
    this.triggersGrid = page.locator('#grid-triggers');
    this.deleteTriggerDialog = new DeleteTriggerDialog(page);
    this.filterByOutcomeSelector = page.getByRole('listbox', { name: 'Filter by Outcome' });
  }

  async addTrigger(trigger: Trigger) {
    await this.addTriggerLink.click();
    await this.addTriggerDialog.nameInput.fill(trigger.name);
    await this.addTriggerDialog.saveButton.click();

    await this.addOrEditTriggerModal.fillOutForm(trigger);
    await this.addOrEditTriggerModal.saveButton.click();
  }

  async deleteTrigger(triggerName: string) {
    const triggerRow = this.triggersGrid.getByRole('row', { name: triggerName });
    await triggerRow.hover();
    await triggerRow.getByTitle('Delete Trigger').click();
    await this.deleteTriggerDialog.deleteButton.click();
  }

  async filterTriggersByOutcome(outcome: OutcomeType) {
    await this.filterByOutcomeSelector.click();

    const page = this.filterByOutcomeSelector.page();

    if (outcome === 'All Types') {
      await page.getByText('All Types').click();
    }

    await page.getByRole('option', { name: outcome }).click();
  }
}
