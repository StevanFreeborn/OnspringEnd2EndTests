import { FrameLocator, Locator, Page } from '@playwright/test';
import { OutcomeType } from '@stevanfreeborn/onspring-models';
import { FrameOwner } from '../common/controls/frameOwner.js';

const triggerModal = (page: Page): Locator => page.getByRole('dialog').first();
const triggerFrame = (page: Page): FrameLocator => triggerModal(page).frameLocator('iframe');

export const triggerModalFrameOwner: FrameOwner = (page: Page): FrameLocator => triggerFrame(page);

export const AppTriggersTabTargets = {
  addTriggerLink: (page: Page): Locator => page.getByRole('link', { name: 'Add Trigger' }),
  filterByOutcomeSelector: (page: Page): Locator => page.getByRole('listbox', { name: 'Filter by Outcome' }),
  allOutcomeTypesOption: (page: Page): Locator => page.getByText('All Types'),
  outcomeFilterOption:
    (outcome: OutcomeType) =>
    (page: Page): Locator =>
      page.getByRole('option', { name: outcome }),
  triggersGrid: (page: Page): Locator => page.locator('#grid-triggers'),
  triggerRowByName:
    (name: string | RegExp) =>
    (page: Page): Locator =>
      page.locator('#grid-triggers').getByRole('row', { name }),
  deleteTriggerButtonInRow:
    (name: string | RegExp) =>
    (page: Page): Locator =>
      page.locator('#grid-triggers').getByRole('row', { name }).getByTitle('Delete Trigger'),
};

export const TriggerModalTargets = {
  modal: triggerModal,
  saveButton: (page: Page): Locator => triggerModal(page).getByRole('button', { name: 'Save' }),
  cancelButton: (page: Page): Locator => triggerModal(page).getByRole('button', { name: 'Cancel' }),
  generalSettingsTabButton: (page: Page): Locator => triggerFrame(page).getByRole('tab', { name: 'General Settings' }),
  rulesTabButton: (page: Page): Locator => triggerFrame(page).getByRole('tab', { name: 'Rules' }),
  outcomesTabButton: (page: Page): Locator => triggerFrame(page).getByRole('tab', { name: 'Outcomes' }),
  generalTab: {
    nameInput: (page: Page): Locator => triggerFrame(page).getByLabel('Name'),
    descriptionEditor: (page: Page): Locator => triggerFrame(page).locator('.content-area.mce-content-body'),
    statusSwitch: (page: Page): Locator => triggerFrame(page).getByRole('switch', { name: 'Status' }),
    statusToggle: (page: Page): Locator =>
      triggerFrame(page).getByRole('switch', { name: 'Status' }).locator('span').nth(3),
    statusButtons: (page: Page): Locator => triggerFrame(page).locator('.button-status-container'),
    statusButton:
      (label: 'Enabled' | 'Disabled') =>
      (page: Page): Locator =>
        triggerFrame(page).locator('.button-status-container').getByRole('button', { name: label }),
  },
  rulesTab: {
    ruleSetControl: (page: Page): Locator =>
      triggerFrame(page).locator('.label:has-text("Rule Set") + .data .rule-config'),
  },
  outcomesTab: {
    outcomesGrid: (page: Page): Locator => triggerFrame(page).locator('#outcome-grid'),
    outcomeRowByType:
      (outcomeType: OutcomeType) =>
      (page: Page): Locator =>
        triggerFrame(page).locator('#outcome-grid').getByRole('row', { name: outcomeType }),
  },
};
