import { Locator, Page } from '@playwright/test';
import { Target } from '@stevanfreeborn/screenplay-playwright';

const documentsAdminGrid = (page: Page): Locator => page.locator('#grid');

export const DynamicDocumentAdminPageTargets = {
  route: '/Admin/Document',
  getListPagePath: '/Admin/Document/GetListPage',
  createDocumentButton: (page: Page): Locator => page.getByRole('button', { name: 'Create Document' }),
  documentsGrid: documentsAdminGrid,
  rowByName:
    (name: string): Target =>
    (page: Page): Locator =>
      documentsAdminGrid(page).getByRole('row', { name }).first(),
  editButtonInRow:
    (name: string): Target =>
    (page: Page): Locator =>
      documentsAdminGrid(page).getByRole('row', { name }).first().getByTitle('Edit Document'),
  deleteButtonInRow:
    (name: string): Target =>
    (page: Page): Locator =>
      documentsAdminGrid(page).getByRole('row', { name }).first().getByTitle('Delete Document'),
};

export const EditDynamicDocumentPageTargets = {
  pathRegex: /\/Admin\/Document\/\d+\/Edit/,
  saveFilePathRegex: /\/Admin\/Document\/SaveDocumentFiles/,
  saveChangesButton: (page: Page): Locator => page.getByRole('link', { name: 'Save Changes' }),

  informationTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Document Information' }),
  displayRulesTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Display Rules' }),
  securityTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Security' }),
  outputTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Output' }),

  optionByName:
    (name: string, exact: boolean = false): Target =>
    (page: Page): Locator =>
      page.getByRole('option', { name, exact }),

  informationTab: {
    documentNameInput: (page: Page): Locator => page.getByLabel('Document Name'),
    statusSwitch: (page: Page): Locator => page.getByRole('switch', { name: 'Status' }),
    statusToggle: (page: Page): Locator => page.getByRole('switch', { name: 'Status' }).locator('span').nth(3),
    fileOptionsButton: (page: Page): Locator => page.locator('#file-options-button'),
    uploadNewFileOption: (page: Page): Locator => page.locator('#document-file-options').getByText('Upload New File'),
  },

  securityTab: {
    fieldSecurityOverridesSelector: (page: Page): Locator =>
      page.locator('.label:has-text("Field Security Overrides") + .data .onx-selector'),
    contentSecurityOverrideCheckbox: (page: Page): Locator =>
      page.locator('.label:has-text("Content Security Overrides") + .text').getByRole('checkbox'),
    roleAccessSelect: (page: Page): Locator =>
      page.locator('.label:has-text("Role Access") + .data').getByRole('listbox'),
    rolesSelector: (page: Page): Locator => page.locator('.label:has-text("Roles") + .data .onx-selector'),
  },

  outputTab: {
    emailSelect: (page: Page): Locator => page.locator('.label:has-text("Email") + .data').getByRole('listbox'),
    fileTypeSelect: (page: Page): Locator => page.locator('.label:has-text("File Type") + .data').getByRole('listbox'),
    saveToFieldSelect: (page: Page): Locator =>
      page.locator('.label:has-text("Save To Field") + .data').getByRole('listbox'),
    attachmentFieldSelect: (page: Page): Locator =>
      page.locator('.label:has-text("Attachment Field") + .data').getByRole('listbox'),
  },
};
