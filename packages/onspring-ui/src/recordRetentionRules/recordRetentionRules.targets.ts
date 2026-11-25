import { FrameLocator, Locator, Page } from '@playwright/test';
import { FrameOwner } from '../common/controls/frameOwner.js';

const recordRetentionModal = (page: Page): Locator => page.getByRole('dialog', { name: /record retention rule/i });
const recordRetentionFrame = (page: Page): FrameLocator => recordRetentionModal(page).frameLocator('iframe');
const saveConfirmationDialog = (page: Page): Locator => page.getByRole('dialog', { name: 'Save Confirmation' });

export const recordRetentionModalFrameOwner: FrameOwner = (page: Page): FrameLocator => recordRetentionFrame(page);

export const AppRecordRetentionTabTargets = {
  addRuleLink: (page: Page): Locator => page.getByRole('link', { name: 'Add Record Retention Rule' }),
  rulesGrid: (page: Page): Locator => page.locator('#grid-recordRetentionRules'),
  ruleRowByName:
    (name: string | RegExp) =>
    (page: Page): Locator =>
      page.locator('#grid-recordRetentionRules tbody').getByRole('row', { name }),
  editRuleButtonInRow:
    (name: string | RegExp) =>
    (page: Page): Locator =>
      page
        .locator('#grid-recordRetentionRules tbody')
        .getByRole('row', { name })
        .getByTitle('Edit Record Retention Rule'),
  deleteRuleButtonInRow:
    (name: string | RegExp) =>
    (page: Page): Locator =>
      page
        .locator('#grid-recordRetentionRules tbody')
        .getByRole('row', { name })
        .getByTitle('Delete Record Retention Rule'),
};

export const RecordRetentionRuleModalTargets = {
  editPathRegex: /Admin\/App\/\d+\/RecordRetention\/\d+\/Edit/,
  modal: recordRetentionModal,
  saveButton: (page: Page): Locator => recordRetentionModal(page).getByRole('button', { name: 'Save' }),
  cancelButton: (page: Page): Locator => recordRetentionModal(page).getByRole('button', { name: 'Cancel' }),
  generalSettingsTabButton: (page: Page): Locator =>
    recordRetentionFrame(page).getByRole('tab', { name: 'General Settings' }),
  rulesTabButton: (page: Page): Locator => recordRetentionFrame(page).getByRole('tab', { name: 'Rules' }),
  messagingTabButton: (page: Page): Locator => recordRetentionFrame(page).getByRole('tab', { name: 'Messaging' }),
  frameOptionByName:
    (name: string) =>
    (page: Page): Locator =>
      recordRetentionFrame(page).getByRole('option', { name }),
  generalTab: {
    nameInput: (page: Page): Locator =>
      recordRetentionFrame(page).locator('.label:has-text("Rule Name") + .data').getByRole('textbox'),
    statusSwitch: (page: Page): Locator =>
      recordRetentionFrame(page).locator('.label:has-text("Status") + .data').getByRole('switch'),
    statusToggle: (page: Page): Locator =>
      recordRetentionFrame(page)
        .locator('.label:has-text("Status") + .data')
        .getByRole('switch')
        .locator('span')
        .nth(3),
    descriptionEditor: (page: Page): Locator => recordRetentionFrame(page).locator('.content-area.mce-content-body'),
  },
  rulesTab: {
    dataSelect: (page: Page): Locator =>
      recordRetentionFrame(page).locator('.label:has-text("Data") + .data').getByRole('listbox'),
    ruleSetControl: (page: Page): Locator =>
      recordRetentionFrame(page).locator('.label:has-text("Rule Set") + .data .rule-config'),
  },
  messagingTab: {
    notifyCheckbox: (page: Page): Locator =>
      recordRetentionFrame(page).locator('.label:has-text("Notify") + .data').getByRole('checkbox'),
    recipientsSelector: (page: Page): Locator =>
      recordRetentionFrame(page).locator('.label:has-text("Recipients") + .data'),
    exportFieldsSelector: (page: Page): Locator =>
      recordRetentionFrame(page).locator('.label:has-text("Export Fields") + .data'),
    messageCenterSettingsSelect: (page: Page): Locator =>
      recordRetentionFrame(page).locator('.label:has-text("Message Center Settings") + .data').getByRole('listbox'),
  },
  saveConfirmation: {
    dialog: saveConfirmationDialog,
    okInput: (page: Page): Locator => saveConfirmationDialog(page).getByRole('textbox'),
    okButton: (page: Page): Locator => saveConfirmationDialog(page).getByRole('button', { name: 'OK' }),
  },
};
