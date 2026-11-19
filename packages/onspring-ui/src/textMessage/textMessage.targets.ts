import { Locator, Page } from '@playwright/test';
import { Target } from '@stevanfreeborn/screenplay-playwright';

export const TextMessageAdminPageTargets = {
  route: '/Admin/Messaging/TextMessage',
  createTextMessageButton: (page: Page): Locator => page.getByRole('button', { name: 'Create Text Message' }),
  grid: (page: Page): Locator => page.locator('#grid'),
  rowByName:
    (name: string): Target =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).first(),
  editButtonInRow:
    (name: string): Target =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).first().getByTitle('Edit Text Message'),
  deleteButtonInRow:
    (name: string): Target =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).first().getByTitle('Delete Text Message'),
};

export const EditTextMessagePageTargets = {
  pathRegex: /\/Admin\/Messaging\/TextMessage\/\d+\/Edit/,
  routeForId: (id: number): string => `/Admin/Messaging/TextMessage/${id}/Edit`,
  saveChangesButton: (page: Page): Locator => page.getByRole('link', { name: 'Save Changes' }),
  optionByName:
    (name: string): Target =>
    (page: Page): Locator =>
      page.getByRole('option', { name }),

  generalTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'General' }),
  contentsTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Contents' }),
  recipientsTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Recipients' }),
  frequencyTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Frequency' }),
  rulesTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Rules' }),

  generalTab: {
    nameInput: (page: Page): Locator => page.getByLabel('Name', { exact: true }),
    descriptionEditor: (page: Page): Locator => page.locator('.content-area.mce-content-body:visible'),
    statusSwitch: (page: Page): Locator => page.getByRole('switch'),
    statusToggle: (page: Page): Locator => page.getByRole('switch').locator('span').nth(3),
  },

  contentsTab: {
    fromNumberSelector: (page: Page): Locator =>
      page.locator('.label:has-text("From Number") + .data').getByRole('listbox'),
    messageTextArea: (page: Page): Locator => page.getByLabel('Message'),
  },

  recipientsTab: {
    basedOnFieldValuesSelector: (page: Page): Locator =>
      page.locator('.label:has-text("Based on Values in these Fields") + .data .onx-selector'),
    specificGroupsSelector: (page: Page): Locator =>
      page.locator('.label:has-text("Specific Groups") + .data .onx-selector'),
    specificUsersSelector: (page: Page): Locator =>
      page.locator('.label:has-text("Specific Users") + .data .onx-selector'),
  },

  frequencyTab: {
    sendOnSaveSelect: (page: Page): Locator => page.getByRole('listbox', { name: 'Send on Save' }),
  },
};
