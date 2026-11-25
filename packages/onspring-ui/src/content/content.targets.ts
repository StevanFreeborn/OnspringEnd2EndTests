import { Locator, Page } from '@playwright/test';
import { resolveTarget, Target } from '@stevanfreeborn/screenplay-playwright';

export type ContentSectionLocation = {
  tabName?: string;
  sectionName: string;
};

export type ContentFieldLocation = ContentSectionLocation & {
  fieldName: string;
};

function toPascalCase(text: string): string {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function escapeCssClassPart(text: string): string {
  return text.replace(/([^\w-])/g, '\\$1');
}

function fieldContainerSelector(fieldName: string): string {
  return `.data-${escapeCssClassPart(toPascalCase(fieldName))}`;
}

const contentContainer = (page: Page): Locator => page.locator('div.contentContainer').first();

const createRecordDialog = (page: Page): Locator =>
  page
    .getByRole('dialog')
    .filter({
      has: page.locator('.ui-dialog-title').filter({ hasText: /Create Record/ }),
    })
    .first();

const generateDocumentDialog = (page: Page): Locator =>
  page.getByRole('dialog', { name: /generate dynamic document/i });

const printRecordDialog = (page: Page): Locator => page.getByRole('dialog', { name: 'Print Content Record' });

const versionHistoryDialog = (page: Page): Locator => page.getByRole('dialog', { name: 'Version History' });

const versionHistoryExportReportDialog = (page: Page): Locator => page.getByRole('dialog', { name: 'Export Report' });

const concurrentEditAlertDialog = (page: Page): Locator =>
  page.getByRole('dialog', { name: 'Concurrent Editing Alert' });

const quickContentAddContainer = (page: Page): Locator => page.locator('form', { hasText: 'Quick Content Add' });

export const ContentRecordTargets = {
  homeRoute: '/Content',
  appContentRoute: (appId: number) => `/Content/${appId}/App`,
  addRoute: (appId: number) => `/Content/${appId}/Add`,
  editRoute: (appId: number, recordId: number) => `/Content/${appId}/${recordId}/Edit`,
  viewRoute: (appId: number, recordId: number) => `/Content/${appId}/${recordId}/View`,
  addPathRegex: /\/Content\/\d+\/Add/,
  editPathRegex: /\/Content\/\d+\/\d+\/Edit/,
  viewPathRegex: /\/Content\/\d+\/\d+\/View/,
  copyPathRegex: /\/Content\/\d+\/\d+\/CopyRecord/,
  appContentPathRegex: /\/Content\/\d+\/App/,
  backToOriginPathRegex: /BackToOrigin/,
  createContentButton: (page: Page): Locator => page.getByRole('button', { name: 'Create Content' }),
  createContentMenuOption:
    (appName: string): Target =>
    (page: Page): Locator =>
      page.locator('#create-menu').getByText(appName),
  actionMenuButton: (page: Page): Locator => page.locator('#action-menu-button'),
  actionMenu: (page: Page): Locator => page.locator('#action-menu'),
  actionMenuOption:
    (name: string): Target =>
    (page: Page): Locator =>
      page.locator('#action-menu').getByText(name),
  generateDocumentModal: {
    dialog: generateDocumentDialog,
    fileTypeSelect: (page: Page): Locator =>
      generateDocumentDialog(page).locator('.label:has-text("File Type") + .data').getByRole('listbox'),
    documentActionSelect: (page: Page): Locator =>
      generateDocumentDialog(page).locator('.label:has-text("Document Action") + .data').getByRole('listbox'),
    emailDeliverySelect: (page: Page): Locator =>
      generateDocumentDialog(page).locator('.label:has-text("Email Delivery") + .data').getByRole('listbox'),
    optionByName:
      (name: string, exact: boolean = false): Target =>
      (page: Page): Locator =>
        page.getByRole('option', { name, exact }),
    okButton: (page: Page): Locator => generateDocumentDialog(page).getByRole('button', { name: 'OK' }),
    cancelButton: (page: Page): Locator => generateDocumentDialog(page).getByRole('button', { name: 'Cancel' }),
    closeButton: (page: Page): Locator => generateDocumentDialog(page).getByRole('button', { name: 'Close' }),
  },
  quickContentAddForm: quickContentAddContainer,
  quickContentAdd: {
    openAfterSaveCheckbox: (page: Page): Locator =>
      quickContentAddContainer(page).getByRole('checkbox', { name: 'Open this content record on save' }),
    saveButton: (page: Page): Locator => quickContentAddContainer(page).getByRole('button', { name: 'Save' }),
  },
  tabByName:
    (tabName: string): Target =>
    (page: Page): Locator =>
      page.getByRole('tab', { name: tabName }),
  sectionByHeading:
    (sectionName: string): Target =>
    (page: Page): Locator =>
      page.locator('.section', { has: page.getByRole('heading', { name: sectionName }) }),
  sectionHeading:
    (sectionName: string): Target =>
    (page: Page): Locator =>
      page.getByRole('heading', { name: sectionName }),
  standaloneSectionContainer: (page: Page): Locator => page.locator('.standalone-section-container'),
  saveAttachmentPathRegex: /\/Content\/(\d+\/)?\d+\/SaveAttachments/,
  saveImagePathRegex: /\/Content\/(\d+\/)?\d+\/SaveImages/,
  fileUploadErrorDialog: (page: Page): Locator => page.getByRole('dialog', { name: 'File Upload Error' }),
  dropdownOption:
    (name: string): Target =>
    (page: Page): Locator =>
      page.getByRole('option', { name }),
  contentContainer,
  tabStrip: (page: Page): Locator => contentContainer(page).locator('.k-tabstrip-items'),
  horizontalTabButton:
    (tabName: string): Target =>
    (page: Page): Locator =>
      contentContainer(page).getByRole('tab').filter({ hasText: tabName }).first(),
  standaloneSection:
    (sectionName: string): Target =>
    (page: Page): Locator =>
      contentContainer(page)
        .locator('.standalone-section-container section.section')
        .filter({ hasText: sectionName })
        .first(),
  sectionByName:
    (sectionName: string): Target =>
    (page: Page): Locator =>
      contentContainer(page).locator('section.section').filter({ hasText: sectionName }).first(),
  sectionInHorizontalTab:
    (tabId: string, sectionName: string): Target =>
    (page: Page): Locator =>
      contentContainer(page)
        .locator(`section[data-tab-id="${tabId}"]`)
        .first()
        .locator('section.section')
        .filter({ has: page.locator('h1').filter({ hasText: sectionName }) })
        .first(),
  sectionInVerticalTab:
    (tabName: string, sectionName: string): Target =>
    (page: Page): Locator =>
      contentContainer(page)
        .locator('section.tab')
        .filter({ has: contentContainer(page).locator('h1').filter({ hasText: tabName }) })
        .first()
        .locator('section.section')
        .filter({ has: page.locator('h1').filter({ hasText: sectionName }) })
        .first(),
  textFieldInSection:
    (sectionTarget: Target, fieldName: string): Target =>
    (page: Page): Locator =>
      resolveTarget(page, sectionTarget)
        .locator(`${fieldContainerSelector(fieldName)} input[data-field-type="textBox"]`)
        .first(),
  numberFieldInSection:
    (sectionTarget: Target, fieldName: string): Target =>
    (page: Page): Locator =>
      resolveTarget(page, sectionTarget)
        .locator(`${fieldContainerSelector(fieldName)} input[data-field-type="number"]`)
        .first(),
  listFieldInSection:
    (sectionTarget: Target, fieldName: string): Target =>
    (page: Page): Locator =>
      resolveTarget(page, sectionTarget)
        .locator(`${fieldContainerSelector(fieldName)} div.type-list`)
        .getByRole('listbox'),
  dateFieldInSection:
    (sectionTarget: Target, fieldName: string): Target =>
    (page: Page): Locator =>
      resolveTarget(page, sectionTarget)
        .locator(`${fieldContainerSelector(fieldName)} span.k-datetimepicker`)
        .first(),
  dateFieldInputInSection:
    (sectionTarget: Target, fieldName: string): Target =>
    (page: Page): Locator =>
      resolveTarget(page, sectionTarget)
        .locator(`${fieldContainerSelector(fieldName)} span.k-datetimepicker input`)
        .first(),
  dateFieldCalendarButtonInSection:
    (sectionTarget: Target, fieldName: string): Target =>
    (page: Page): Locator =>
      resolveTarget(page, sectionTarget)
        .locator(`${fieldContainerSelector(fieldName)} span.k-datetimepicker .k-link-date`)
        .first(),
  timeSpanFieldInSection:
    (sectionTarget: Target, fieldName: string): Target =>
    (page: Page): Locator =>
      resolveTarget(page, sectionTarget)
        .locator(`${fieldContainerSelector(fieldName)} div.timespan-base`)
        .first(),
  formulaFieldInSection:
    (sectionTarget: Target, fieldName: string): Target =>
    (page: Page): Locator =>
      resolveTarget(page, sectionTarget)
        .locator(`${fieldContainerSelector(fieldName)} div.data-text-only`)
        .first(),
  attachmentFieldInSection:
    (sectionTarget: Target, fieldName: string): Target =>
    (page: Page): Locator =>
      resolveTarget(page, sectionTarget)
        .locator(`${fieldContainerSelector(fieldName)} div.type-attachment`)
        .first(),
  attachmentUploadButtonInSection:
    (sectionTarget: Target, fieldName: string): Target =>
    (page: Page): Locator =>
      resolveTarget(page, sectionTarget)
        .locator(`${fieldContainerSelector(fieldName)} div.type-attachment .k-upload-button`)
        .first(),
  attachmentRowInSection:
    (sectionTarget: Target, fieldName: string, fileName: string): Target =>
    (page: Page): Locator =>
      resolveTarget(page, sectionTarget)
        .locator(`${fieldContainerSelector(fieldName)} div.type-attachment .k-grid-content tr`)
        .filter({ hasText: fileName })
        .first(),
  imageFieldInSection:
    (sectionTarget: Target, fieldName: string): Target =>
    (page: Page): Locator =>
      resolveTarget(page, sectionTarget)
        .locator(`${fieldContainerSelector(fieldName)} div.type-image`)
        .first(),
  imageBrowseButtonInSection:
    (sectionTarget: Target, fieldName: string): Target =>
    (page: Page): Locator =>
      resolveTarget(page, sectionTarget)
        .locator(`${fieldContainerSelector(fieldName)} div.type-image .k-upload-button`)
        .first(),
  readOnlyImageInSection:
    (sectionTarget: Target, fieldName: string): Target =>
    (page: Page): Locator =>
      resolveTarget(page, sectionTarget)
        .locator(`${fieldContainerSelector(fieldName)} div.type-image .image`)
        .first(),
  referenceFieldInSection:
    (sectionTarget: Target, fieldName: string): Target =>
    (page: Page): Locator =>
      resolveTarget(page, sectionTarget)
        .locator(`${fieldContainerSelector(fieldName)} div.onx-reference-grid`)
        .first(),
  referenceCreateNewButtonInSection:
    (sectionTarget: Target, fieldName: string): Target =>
    (page: Page): Locator =>
      resolveTarget(page, sectionTarget)
        .locator(`${fieldContainerSelector(fieldName)} div.onx-reference-grid`)
        .first()
        .getByTitle('Create New'),
  referenceRecordRowInSection:
    (sectionTarget: Target, fieldName: string, rowName: string | RegExp): Target =>
    (page: Page): Locator =>
      resolveTarget(page, sectionTarget)
        .locator(`${fieldContainerSelector(fieldName)} div.onx-reference-grid`)
        .first()
        .getByRole('grid')
        .getByRole('row', { name: rowName }),
  readOnlyReferenceFieldInSection:
    (sectionTarget: Target, fieldName: string): Target =>
    (page: Page): Locator =>
      resolveTarget(page, sectionTarget)
        .locator(`${fieldContainerSelector(fieldName)} div.type-reference`)
        .first(),
  readOnlyReferenceRecordRowInSection:
    (sectionTarget: Target, fieldName: string, recordId: number): Target =>
    (page: Page): Locator =>
      resolveTarget(page, sectionTarget)
        .locator(`${fieldContainerSelector(fieldName)} div.type-reference`)
        .first()
        .getByRole('row', { name: recordId.toString() }),
  readOnlyTextFieldInSection:
    (sectionTarget: Target, fieldName: string): Target =>
    (page: Page): Locator =>
      resolveTarget(page, sectionTarget)
        .locator(`${fieldContainerSelector(fieldName)} div.data-text-only`)
        .first(),
  objectInSection:
    (sectionTarget: Target, objectName: string): Target =>
    (page: Page): Locator =>
      resolveTarget(page, sectionTarget).locator(`td.object-cell-${objectName}`).first(),
  saveRecordButton: (page: Page): Locator => page.getByRole('link', { name: 'Save Record' }),
  saveAndCloseButton: (page: Page): Locator => page.getByRole('link', { name: 'Save & Close' }),
  viewRecordButton: (page: Page): Locator => page.getByRole('link', { name: 'View Record' }),
  editRecordButton: (page: Page): Locator => page.getByRole('link', { name: 'Edit Record' }),
  cancelButton: (page: Page): Locator => page.getByRole('link', { name: 'Cancel' }),
  pinRecordButton: (page: Page): Locator => page.getByTitle('Pin Record', { exact: true }),
  notFoundMessage: (page: Page): Locator => page.getByText("Oops! The page you're trying to view doesn't exist"),
  versionHistoryEmailDownloadLink: (page: Page): Locator => page.getByRole('link'),
  validationErrors: (page: Page): Locator => page.locator('#validation-error-popover'),

  concurrentEditAlertModal: {
    dialog: concurrentEditAlertDialog,
    closeButton: (page: Page): Locator => concurrentEditAlertDialog(page).getByRole('button', { name: 'Close' }),
  },

  printRecordModal: {
    dialog: printRecordDialog,
    printActionSelect: (page: Page): Locator => printRecordDialog(page).getByRole('listbox', { name: 'Print Action' }),
    orientationSelect: (page: Page): Locator => printRecordDialog(page).getByRole('listbox', { name: 'Orientation' }),
    contentVisibilitySelect: (page: Page): Locator =>
      printRecordDialog(page).getByRole('listbox', { name: 'Content Visibility' }),
    okButton: (page: Page): Locator => printRecordDialog(page).getByRole('button', { name: 'OK' }),
    cancelButton: (page: Page): Locator => printRecordDialog(page).getByRole('button', { name: 'Cancel' }),
  },

  versionHistoryModal: {
    getRecordVersionsPathRegex: /\/Content\/\d+\/\d+\/GetRecordVersionsPaged/,
    filterRecordVersionsPathRegex: /\/Content\/\d+\/\d+\/GetRecordVersionsPage/,
    dialog: versionHistoryDialog,
    fromDateField: (page: Page): Locator => versionHistoryDialog(page).locator('.k-datetimepicker').first(),
    toDateField: (page: Page): Locator => versionHistoryDialog(page).locator('.k-datetimepicker').last(),
    versionRows: (page: Page): Locator => versionHistoryDialog(page).locator('.k-grid-content tr.k-master-row'),
    exportReportButton: (page: Page): Locator =>
      versionHistoryDialog(page).getByRole('button', { name: 'Export Report' }),
    exportReportDialog: {
      dialog: versionHistoryExportReportDialog,
      exportButton: (page: Page): Locator =>
        versionHistoryExportReportDialog(page).getByRole('button', { name: 'Export' }),
      closeButton: (page: Page): Locator =>
        versionHistoryExportReportDialog(page).getByRole('button', { name: 'Close' }),
    },
  },

  createRecordModal: {
    popupAddPathRegex: /\/Content\/\d+\/PopupAdd/,
    getReferenceRecordsPathRegex: /\/Content\/ReferenceGrid\/GetReferenceRecords/,
    dialog: createRecordDialog,
    saveButton: (page: Page): Locator => createRecordDialog(page).getByRole('button', { name: 'Save' }),
  },

  tab:
    (tabName: string) =>
    (page: Page): Locator =>
      page.locator(`section[data-tab-name="${tabName}"]`),

  textField:
    (fieldName: string) =>
    (page: Page): Locator => {
      const pascal = toPascalCase(fieldName);
      return page
        .locator(
          `.data-${pascal} input[data-field-type="textBox"], .data-${pascal} input, [data-field-name="${fieldName}"] input, .data-${fieldName} input`
        )
        .first();
    },
};
