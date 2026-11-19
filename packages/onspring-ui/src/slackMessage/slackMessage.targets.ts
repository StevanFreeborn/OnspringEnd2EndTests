import { Locator, Page } from '@playwright/test';
import { Target } from '@stevanfreeborn/screenplay-playwright';

export const SlackMessageAdminPageTargets = {
  route: '/Admin/Messaging/Slack',
  createSlackMessageButton: (page: Page): Locator => page.getByRole('button', { name: 'Create Slack Message' }),
  grid: (page: Page): Locator => page.locator('#grid'),
  rowByName:
    (name: string): Target =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).first(),
  editButtonInRow:
    (name: string): Target =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).first().getByTitle('Edit Slack Message'),
  deleteButtonInRow:
    (name: string): Target =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).first().getByTitle('Delete Slack Message'),
};

export const EditSlackMessagePageTargets = {
  pathRegex: /\/Admin\/Messaging\/Slack\/\d+\/Edit/,
  routeForId: (id: number): string => `/Admin/Messaging/Slack/${id}/Edit`,
  saveChangesButton: (page: Page): Locator => page.getByRole('link', { name: 'Save Changes' }),
  optionByName:
    (name: string): Target =>
    (page: Page): Locator =>
      page.getByRole('option', { name }),

  generalTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'General' }),
  contentsTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Contents' }),
  frequencyTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Frequency' }),
  rulesTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Rules' }),

  generalTab: {
    nameInput: (page: Page): Locator => page.getByLabel('Name', { exact: true }),
    descriptionEditor: (page: Page): Locator => page.locator('.content-area.mce-content-body:visible'),
    statusSwitch: (page: Page): Locator => page.getByRole('switch'),
    statusToggle: (page: Page): Locator => page.getByRole('switch').locator('span').nth(3),
    channelNameInput: (page: Page): Locator =>
      page.locator('.label:has-text("Channel Name") + .data').locator('input[type="text"]'),
  },

  contentsTab: {
    messageTitleInput: (page: Page): Locator => page.getByLabel('Message Title'),
    messageEditor: (page: Page): Locator => page.locator('.content-area.mce-content-body:visible'),
    recordLinkTextInput: (page: Page): Locator => page.getByLabel('Record Link Text'),
    viewRecordButtonCheckbox: (page: Page): Locator => page.getByLabel('"View Record" Button'),
    sidebarColorSelector: (page: Page): Locator => page.getByLabel('Sidebar Color Based On'),
    sidebarColorInput: (page: Page): Locator => page.getByLabel(/Current selected color is/),
  },

  frequencyTab: {
    sendOnSaveSelect: (page: Page): Locator => page.getByRole('listbox', { name: 'Send on Save' }),
  },
};
