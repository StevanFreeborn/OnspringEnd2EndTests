import { Locator, Page } from '@playwright/test';

export const EmailSyncPageTargets = {
  route: '/Admin/Integration/EmailSync',
  getEmailSyncsPath: '/Admin/Integration/EmailSync/EmailSyncList',
  deleteSyncPathRegex: /\/Admin\/Integration\/EmailSync\/\d+\/Delete/,
  createEmailSyncButton: (page: Page): Locator => page.getByRole('button', { name: 'Create Email Integration (Sync)' }),

  grid: (page: Page): Locator => page.locator('#grid'),
  pagerInfo: (page: Page): Locator => page.locator('#grid .k-pager-info'),
  scrollingContent: (page: Page): Locator => page.locator('#grid .k-grid-content.k-auto-scrollable'),

  rowByName:
    (name: string) =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }),

  deleteButtonInRow:
    (name: string) =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).first().getByTitle('Delete Email Integration (Sync)'),
};

export const EditEmailSyncPageTargets = {
  pathRegex: /\/Admin\/Integration\/EmailSync\/\d+\/Edit/,
  saveChangesLink: (page: Page): Locator => page.getByRole('link', { name: 'Save Changes' }),
  optionByName:
    (name: string) =>
    (page: Page): Locator =>
      page.getByRole('option', { name }),

  dataSyncTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Data Sync', exact: true }),
  dataMappingTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Data Mapping' }),
  dataSyncSettingsTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Data Sync Settings' }),

  dataSyncTab: {
    nameInput: (page: Page): Locator => page.locator('.label:has-text("Name") + .data').getByRole('textbox'),
    appOrSurveySelector: (page: Page): Locator =>
      page.locator('.label:has-text("App/Survey") + .data').getByRole('listbox'),
    emailKeyInput: (page: Page): Locator => page.locator('.label:has-text("Email Key") + .data').getByRole('textbox'),
    statusSwitch: (page: Page): Locator => page.locator('.label:has-text("Status") + .data'),
    statusSwitchToggle: (page: Page): Locator => page.locator('.label:has-text("Status") + .data .k-switch'),
  },

  dataMappingTab: {
    sourceField:
      (key: string) =>
      (page: Page): Locator =>
        page.locator(`.drag-items-container .draggable:has-text("${key}")`),
    targetRow:
      (value: string) =>
      (page: Page): Locator =>
        page.locator('.mappable-items').locator('tr', {
          has: page.locator(`.field-cell:has-text("${value}")`),
        }),
    targetDropZone:
      (value: string) =>
      (page: Page): Locator =>
        page
          .locator('.mappable-items')
          .locator('tr', {
            has: page.locator(`.field-cell:has-text("${value}")`),
          })
          .locator('.drag-and-drop-cell'),
    mappedItem:
      (value: string) =>
      (page: Page): Locator =>
        page
          .locator('.mappable-items')
          .locator('tr', {
            has: page.locator(`.field-cell:has-text("${value}")`),
          })
          .locator('.map-item-container'),
  },

  dataSyncSettingsTab: {
    syncTypeSelector: (page: Page): Locator =>
      page.locator('.label:has-text("Sync Type") + .data').getByRole('listbox'),
    messagingSelector: (page: Page): Locator =>
      page.locator('.label:has-text("Messaging") + .data').getByRole('listbox'),
  },
};
