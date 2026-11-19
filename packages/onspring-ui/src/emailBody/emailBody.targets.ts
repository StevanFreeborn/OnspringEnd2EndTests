import { Locator, Page } from '@playwright/test';

export const EmailBodyAdminPageTargets = {
  route: '/Admin/Messaging/EmailBody',
  createEmailBodyButton: (page: Page): Locator => page.getByRole('button', { name: 'Create Email Body' }),
  grid: (page: Page): Locator => page.locator('#grid'),
  rowByName:
    (name: string) =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }),
  deleteButtonInRow:
    (name: string) =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).getByTitle('Delete Email Body'),
  editButtonInRow:
    (name: string) =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).getByTitle('Edit Email Body'),
};

export const EditEmailBodyPageTargets = {
  pathRegex: /\/Admin\/Messaging\/EmailBody\/\d+\/Edit/,
  saveChangesButton: (page: Page): Locator => page.getByRole('link', { name: 'Save Changes' }),

  generalTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'General' }),
  contentsTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Contents' }),
  recipientsTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Recipients' }),
  senderTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Sender' }),
  frequencyTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Frequency' }),
  rulesTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Rules' }),

  generalTab: {
    nameInput: (page: Page): Locator => page.getByLabel('Name', { exact: true }),
    descriptionEditor: (page: Page): Locator => page.locator('.content-area.mce-content-body:visible'),
    statusSwitch: (page: Page): Locator => page.getByRole('switch'),
    statusToggle: (page: Page): Locator => page.getByRole('switch').locator('span').nth(3),
    templateSelect: (page: Page): Locator => page.getByRole('listbox', { name: 'Template' }),
    templateOption:
      (template: string) =>
      (page: Page): Locator =>
        page.locator('.k-list-optionlabel', { hasText: template }),
  },

  contentsTab: {
    subjectInput: (page: Page): Locator => page.getByLabel('Subject'),
    bodyEditor: (page: Page): Locator => page.locator('.content-area.mce-content-body:visible'),
    fieldsBank: (page: Page): Locator => page.locator('.fields-list'),
    allowDownloadsCheckbox: (page: Page): Locator =>
      page.getByLabel('Allow downloadable attachments from attachment fields'),
    recordLinkTextInput: (page: Page): Locator => page.getByLabel('Record Link Text'),
  },

  recipientsTab: {
    basedOnFieldValuesSelector: (page: Page): Locator =>
      page.locator('.label:has-text("Based on Values in these Fields") + .data .onx-selector'),
    specificGroupsSelector: (page: Page): Locator =>
      page.locator('.label:has-text("Specific Groups") + .data .onx-selector'),
    specificUsersSelector: (page: Page): Locator =>
      page.locator('.label:has-text("Specific Users") + .data .onx-selector'),
    subscriptionSelect: (page: Page): Locator => page.getByRole('listbox', { name: 'Subscription' }),
    subscriptionOption:
      (subscription: string) =>
      (page: Page): Locator =>
        page.getByRole('option', { name: subscription }),
    emailAddressesInTextField: (page: Page): Locator =>
      page.locator('.label:has-text("Email Addresses in this Text Field") + .data .onx-selector'),
    treeItem:
      (name: string) =>
      (page: Page): Locator =>
        page.getByRole('treeitem', { name }).getByText(name),
    specificExternalUsersTextBox: (page: Page): Locator =>
      page.getByRole('textbox', { name: 'Specific External Users' }),
    optInCertCheckbox: (page: Page): Locator =>
      page.getByLabel(
        'Any external recipients have opted-in to this email message and should not be allowed to opt-out'
      ),
  },

  senderTab: {
    fromNameInput: (page: Page): Locator => page.getByLabel('From Name'),
    fromAddressContainer: (page: Page): Locator => page.locator('.from-email-container'),
    fromAddressLocalPartInput: (page: Page): Locator => page.locator('.from-email-container #local-part'),
    fromAddressDomainSelect: (page: Page): Locator =>
      page.locator('.from-email-container').getByRole('listbox', { includeHidden: true }),
    fromAddressDomainOption:
      (domain: string) =>
      (page: Page): Locator =>
        page.getByRole('option', { name: domain }),
    prioritySelect: (page: Page): Locator => page.getByRole('listbox', { name: 'Priority' }),
    priorityOption:
      (priority: string) =>
      (page: Page): Locator =>
        page.getByRole('option', { name: priority }),
  },

  frequencyTab: {
    sendOnSaveSelect: (page: Page): Locator => page.getByRole('listbox', { name: 'Send on Save' }),
    sendOnSaveOption:
      (frequency: string) =>
      (page: Page): Locator =>
        page.getByRole('option', { name: frequency }),
  },

  rulesTab: {
    ruleContainer: (page: Page): Locator => page.locator('.label:has-text("Send Logic") + .data .rule-config'),
    fieldSelector: (page: Page): Locator =>
      page.locator('.label:has-text("Send Logic") + .data .rule-config .field .onx-selector'),
    ruleOperatorSelect: (page: Page): Locator =>
      page.locator('.label:has-text("Send Logic") + .data .rule-config .rule-operator[role="listbox"]'),
    ruleOperatorOption:
      (op: string) =>
      (page: Page): Locator =>
        page.getByRole('option', { name: op }),
    valueInput: (page: Page): Locator =>
      page.locator('.label:has-text("Send Logic") + .data .rule-config .between-container input:visible'),
    addRuleButton: (page: Page): Locator =>
      page.locator('.label:has-text("Send Logic") + .data .rule-config').getByRole('button', { name: 'Add' }),
  },
};
