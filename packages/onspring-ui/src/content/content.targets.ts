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

export const ContentRecordTargets = {
  appContentRoute: (appId: number) => `/Content/${appId}/App`,
  addRoute: (appId: number) => `/Content/${appId}/Add`,
  viewRoute: (appId: number, recordId: number) => `/Content/${appId}/${recordId}/View`,
  addPathRegex: /\/Content\/\d+\/Add/,
  editPathRegex: /\/Content\/\d+\/\d+\/Edit/,
  appContentPathRegex: /\/Content\/\d+\/App/,
  quickContentAddForm: (page: Page): Locator => page.locator('form', { hasText: 'Quick Content Add' }),
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
  saveRecordButton: (page: Page): Locator => page.getByRole('link', { name: 'Save Record' }),
  saveAndCloseButton: (page: Page): Locator => page.getByRole('link', { name: 'Save & Close' }),

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
