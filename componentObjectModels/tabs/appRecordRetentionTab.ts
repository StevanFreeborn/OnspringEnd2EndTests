import { Locator, Page } from '../../fixtures';
import { RecordRetentionRule } from '../../models/recordRetentionRule';
import { AddRecordRetentionRuleDialog } from '../dialogs/addRecordRetentionRuleDialog';
import { DeleteRecordRetentionRuleDialog } from '../dialogs/deleteRecordRetentionRuleDialog';
import { EditRecordRetentionRuleModal } from '../modals/editRecordRetentionRuleModal';

export class AppRecordRetentionTab {
  private readonly page: Page;
  private readonly addRuleLink: Locator;
  private readonly addRuleDialog: AddRecordRetentionRuleDialog;
  private readonly ruleGrid: Locator;
  private readonly ruleGridBody: Locator;
  private readonly deleteRecordRetentionRuleDialog: DeleteRecordRetentionRuleDialog;
  readonly editRuleModal: EditRecordRetentionRuleModal;

  constructor(page: Page) {
    this.page = page;
    this.addRuleLink = this.page.getByRole('link', { name: 'Add Record Retention Rule' });
    this.addRuleDialog = new AddRecordRetentionRuleDialog(this.page);
    this.editRuleModal = new EditRecordRetentionRuleModal(this.page);
    this.ruleGrid = this.page.locator('#grid-recordRetentionRules');
    this.ruleGridBody = this.ruleGrid.locator('tbody');
    this.deleteRecordRetentionRuleDialog = new DeleteRecordRetentionRuleDialog(this.page);
  }

  private async updateAndSaveRule(rule: RecordRetentionRule) {
    await this.editRuleModal.fillOutForm(rule);

    if (rule.status) {
      await this.editRuleModal.saveWithConfirmation();
    } else {
      await this.editRuleModal.save();
    }
  }

  async getRuleRowByName(name: string) {
    return this.ruleGridBody.getByRole('row', { name });
  }

  async addRule(recordRetentionRule: RecordRetentionRule) {
    await this.addRuleLink.click();
    await this.addRuleDialog.nameInput.fill(recordRetentionRule.name);
    await this.addRuleDialog.saveButton.click();
    await this.updateAndSaveRule(recordRetentionRule);
  }

  async updateRule(name: string, updatedRecordRetentionRule: RecordRetentionRule) {
    const ruleRow = await this.getRuleRowByName(name);
    await ruleRow.hover();
    await ruleRow.getByTitle('Edit Record Retention Rule').click();
    await this.updateAndSaveRule(updatedRecordRetentionRule);
  }

  async deleteRule(name: string) {
    const ruleRow = await this.getRuleRowByName(name);

    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(100);

    await ruleRow.hover();
    await ruleRow.getByTitle('Delete Record Retention Rule').click();
    await this.deleteRecordRetentionRuleDialog.deleteButton.click();
    await this.deleteRecordRetentionRuleDialog.waitForDialogToBeDismissed();
  }
}
