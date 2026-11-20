import { Locator, Page } from '@playwright/test';
import { Target } from '@stevanfreeborn/screenplay-playwright';

const reportDesignerFrame = (page: Page) =>
  page.getByRole('dialog', { name: /report designer/i }).frameLocator('iframe');

export const ReportAppPageTargets = {
  routeForApp: (appId: number): string => `/Report/App/${appId}`,
  getReportsPathRegex: /\/Report\/ReportList\/\d+/,
  createReportButton: (page: Page): Locator => page.getByRole('button', { name: 'Create Report' }),
};

export const AddReportDialogTargets = {
  blankReportRadioButton: (page: Page): Locator => page.getByRole('radio', { name: 'A blank report' }),
  savedReportRadioButton: (page: Page): Locator => page.getByRole('radio', { name: 'Create as a saved report' }),
  reportNameInput: (page: Page): Locator => page.getByPlaceholder('Report Name', { exact: true }),
  securitySelector: (page: Page): Locator => page.locator('.label:has-text("Security") + .data').getByRole('listbox'),
  optionByName:
    (name: string): Target =>
    (page: Page): Locator =>
      page.getByRole('option', { name }),
  saveButton: (page: Page): Locator => page.getByRole('button', { name: 'Save' }),
};

export const ReportDesignerTargets = {
  modal: (page: Page): Locator => page.getByRole('dialog', { name: /report designer/i }),
  saveAndRunButton: (page: Page): Locator =>
    page.getByRole('dialog', { name: /report designer/i }).getByRole('button', { name: 'Save Changes & Run' }),
  generalTabButton: (page: Page): Locator => reportDesignerFrame(page).getByRole('tab', { name: 'General' }),
  visualTabButton: (page: Page): Locator => reportDesignerFrame(page).getByRole('tab', { name: 'Visual' }),
  optionByName:
    (name: string): Target =>
    (page: Page): Locator =>
      reportDesignerFrame(page).getByRole('option', { name }),
  generalTab: {
    nameInput: (page: Page): Locator => reportDesignerFrame(page).getByLabel('Report Name'),
    descriptionEditor: (page: Page): Locator =>
      reportDesignerFrame(page)
        .locator('.label:has-text("Description") + .data')
        .locator('.content-area.mce-content-body'),
  },
  visualTab: {
    displayTypeSelector: (page: Page): Locator =>
      reportDesignerFrame(page).locator('.label:has-text("Display Type") + .data').getByRole('listbox'),
    bulkEditCheckbox: (page: Page): Locator => reportDesignerFrame(page).getByLabel('Allow bulk edit'),
    bulkDeleteCheckbox: (page: Page): Locator => reportDesignerFrame(page).getByLabel('Allow bulk delete'),
  },
};

export const ReportPageTargets = {
  pathRegex: /\/Report\/\d+\/Display/,
  copyrightPatentInfo: (page: Page): Locator => page.getByText('U.S. Patent No. 11,507,628'),
};
