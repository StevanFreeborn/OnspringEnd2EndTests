import { FrameLocator, Locator, Page } from '../../fixtures';
import { RecordRetentionRule } from '../../models/recordRetentionRule';
import { DualPaneSelector } from '../controls/dualPaneSelector';
import { RuleControl } from '../controls/ruleControl';
import { StatusSwitch } from '../controls/statusSwitchControl';

export class EditRecordRetentionRuleModal {
  private readonly editPathRegex: RegExp;
  private readonly page: Page;
  private readonly modal: Locator;
  private readonly frame: FrameLocator;
  private readonly generalSettingsTabButton: Locator;
  private readonly rulesTabButton: Locator;
  private readonly messagingTabButton: Locator;
  private readonly generalSettingsTab: GeneralSettingsTab;
  private readonly rulesTab: RulesTab;
  private readonly messagingTab: MessagingTab;
  private readonly cancelButton: Locator;
  private readonly saveButton: Locator;

  constructor(page: Page) {
    this.editPathRegex = /Admin\/App\/\d+\/RecordRetention\/\d+\/Edit/;
    this.page = page;
    this.modal = this.page.getByRole('dialog', { name: /record retention rule/i });
    this.frame = this.modal.frameLocator('iframe');
    this.generalSettingsTabButton = this.frame.getByRole('tab', { name: 'General Settings' });
    this.rulesTabButton = this.frame.getByRole('tab', { name: 'Rules' });
    this.messagingTabButton = this.frame.getByRole('tab', { name: 'Messaging' });
    this.generalSettingsTab = new GeneralSettingsTab(this.frame);
    this.rulesTab = new RulesTab(this.frame);
    this.messagingTab = new MessagingTab(this.frame);
    this.cancelButton = this.modal.getByRole('button', { name: 'Cancel' });
    this.saveButton = this.modal.getByRole('button', { name: 'Save' });
  }

  async fillOutForm(rule: RecordRetentionRule) {
    await this.generalSettingsTabButton.click();
    await this.generalSettingsTab.fillOutForm(rule);
    await this.rulesTabButton.click();
    await this.rulesTab.fillOutForm(rule);
    await this.messagingTabButton.click();
    await this.messagingTab.fillOutForm(rule);
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async save() {
    const saveResponse = this.page.waitForResponse(
      response => response.url().match(this.editPathRegex) !== null && response.request().method() === 'POST'
    );
    await this.saveButton.click();
    await saveResponse;
  }

  async saveWithConfirmation() {
    await this.saveButton.click();

    const confirmationDialog = this.page.getByRole('dialog', { name: 'Save Confirmation' });
    const okInput = confirmationDialog.getByRole('textbox');
    const okButton = confirmationDialog.getByRole('button', { name: 'OK' });

    const saveResponse = this.page.waitForResponse(
      response => response.url().match(this.editPathRegex) !== null && response.request().method() === 'POST'
    );

    await okInput.pressSequentially('OK', { delay: 150 });
    await okButton.click();

    await saveResponse;
  }
}

class GeneralSettingsTab {
  private readonly nameInput: Locator;
  private readonly statusSwitch: StatusSwitch;
  private readonly descriptionEditor: Locator;

  constructor(frame: FrameLocator) {
    this.nameInput = frame.locator('.label:has-text("Rule Name") + .data').getByRole('textbox');
    this.statusSwitch = new StatusSwitch(frame.locator('.label:has-text("Status") + .data'));
    this.descriptionEditor = frame.locator('.content-area.mce-content-body');
  }

  async fillOutForm(rule: RecordRetentionRule) {
    await this.nameInput.fill(rule.name);
    await this.statusSwitch.toggle(rule.status);
    await this.descriptionEditor.fill(rule.description);
  }
}

class RulesTab {
  private readonly frame: FrameLocator;
  private readonly dataSelector: Locator;
  private readonly ruleControl: RuleControl;

  constructor(frame: FrameLocator) {
    this.frame = frame;
    this.dataSelector = this.frame.locator('.label:has-text("Data") + .data').getByRole('listbox');
    this.ruleControl = new RuleControl(
      this.frame.locator('.label:has-text("Rule Set") + .data .rule-config'),
      this.frame
    );
  }

  private async selectData(data: string) {
    await this.dataSelector.click();
    await this.frame.getByRole('option', { name: data }).click();
  }

  async fillOutForm(rule: RecordRetentionRule) {
    await this.selectData(rule.data);
    await this.ruleControl.addLogic(rule.ruleSet);
  }
}

class MessagingTab {
  private readonly frame: FrameLocator;
  private readonly notifyCheckbox: Locator;
  private readonly recipientsDualPaneSelector: DualPaneSelector;
  private readonly exportFieldsDualPaneSelector: DualPaneSelector;
  private readonly messageCenterSettingsSelector: Locator;

  constructor(frame: FrameLocator) {
    this.frame = frame;
    this.notifyCheckbox = this.frame.locator('.label:has-text("Notify") + .data').getByRole('checkbox');
    this.recipientsDualPaneSelector = new DualPaneSelector(
      this.frame.locator('.label:has-text("Recipients") + .data'),
      this.frame
    );
    this.exportFieldsDualPaneSelector = new DualPaneSelector(
      this.frame.locator('.label:has-text("Export Fields") + .data'),
      this.frame
    );
    this.messageCenterSettingsSelector = this.frame
      .locator('.label:has-text("Message Center Settings") + .data')
      .getByRole('listbox');
  }

  private async selectMessageCenterSetting(setting: string) {
    await this.messageCenterSettingsSelector.click();
    await this.frame.getByRole('option', { name: setting }).click();
  }

  async fillOutForm(rule: RecordRetentionRule) {
    await this.notifyCheckbox.setChecked(rule.notify);
    await this.recipientsDualPaneSelector.selectOptions(rule.recipients);
    await this.exportFieldsDualPaneSelector.selectOptions(rule.exportFields);
    await this.selectMessageCenterSetting(rule.messageCenterSetting);
  }
}
