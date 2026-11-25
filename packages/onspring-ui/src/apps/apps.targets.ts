import { Page } from '@playwright/test';
import { resolveTarget, Target } from '@stevanfreeborn/screenplay-playwright';

export type FieldsAndObjectsReportExportFormat = 'Excel' | 'PDF' | 'Microsoft Word';

export type FieldsAndObjectsReportExportableField =
  | 'Name'
  | 'Description'
  | 'Type'
  | 'List Values'
  | 'Status'
  | 'Field Security'
  | 'Field ID'
  | 'Last Saved'
  | 'Help';

export type ExportFieldsAndObjectsReportOptions = {
  format: FieldsAndObjectsReportExportFormat;
  fields: FieldsAndObjectsReportExportableField[];
  includeUsage?: boolean;
  includeListValueGUIDs?: boolean;
  messageCenterAlertsOnly?: boolean;
};

export type LayoutDropzoneLocation = {
  tabName?: string;
  sectionName: string;
  column: number;
  row: number;
};

function createSettingSelector(settingName: string) {
  return `td:nth-match(td:has-text("${settingName}") + td, 1)`;
}

export const AppsPageTargets = {
  route: '/Admin/App',
  getAppsListPath: '/Admin/App/AppsListRead',
  createAppButton: (page: Page) => page.locator('.create-button'),
  filterByInput: (page: Page) => page.getByPlaceholder('Filter By'),
  appGrid: (page: Page) => page.locator('#grid'),
  rowByName: (appName: string) => (page: Page) => page.locator('#grid').getByRole('row', { name: appName }).first(),
  deleteButtonInRow: (appName: string) => (page: Page) =>
    page.locator('#grid').getByRole('row', { name: appName }).first().getByTitle('Delete App'),
};

export const CreateAppDialogTargets = {
  continueButton: (page: Page) => page.getByRole('button', { name: 'Continue' }),
  copyFromRadioButton: (page: Page) => page.getByText('Copy from'),
  copyFromDropdown: (page: Page) => page.locator('.copy-from-dropdown'),
  getAppToCopy: (appName: string) => (page: Page) => page.getByRole('option', { name: appName }),
};

export const CreateAppModalTargets = {
  nameInput: (page: Page) => page.getByLabel('Name'),
  saveButton: (page: Page) => page.getByRole('button', { name: 'Save' }),
};

export const DeleteAppDialogTargets = {
  confirmationInput: (page: Page) => page.getByLabel('Delete App').getByRole('textbox'),
  deleteButton: (page: Page) => page.getByRole('button', { name: 'Delete' }),
  dialog: (page: Page) => page.locator('.ui-dialog:has(.ui-dialog-title:has-text("Delete App"))'),
};

export const AppDetailTargets = {
  path: '/Admin/App/',
  pathRegex: /\/Admin\/App\/\d+/,
  closeButton: (page: Page) => page.locator('a:has-text("Close")'),
  generalTabButton: (page: Page) => page.getByRole('tab', { name: 'General' }),
  layoutTabButton: (page: Page) => page.getByRole('tab', { name: 'Layout' }),
  triggersTabButton: (page: Page) => page.getByRole('tab', { name: 'Triggers' }),
  documentsTabButton: (page: Page) => page.getByRole('tab', { name: 'Documents' }),
  messagingTabButton: (page: Page) => page.getByRole('tab', { name: 'Messaging' }),
  recordRetentionTabButton: (page: Page) => page.getByRole('tab', { name: 'Record Retention' }),

  generalTab: {
    name: (page: Page) => page.locator(createSettingSelector('Name')),
    status: (page: Page) => page.locator(createSettingSelector('Status')),
    description: (page: Page) => page.locator(createSettingSelector('Description')),
    contentVersionStatus: (page: Page) => page.locator(createSettingSelector('Content Versioning')),
    concurrentEditAlertStatus: (page: Page) => page.locator(createSettingSelector('Concurrent Edit Alert')),
    displayLink: (page: Page) => page.locator(createSettingSelector('Display Link Field')),
    integrationLink: (page: Page) => page.locator(createSettingSelector('Integration Link Field')),
    displayFields: (page: Page) => page.locator(createSettingSelector('Display Fields')),
    sort: (page: Page) => page.locator(createSettingSelector('Sort')),
    notes: (page: Page) => page.locator(createSettingSelector('Notes')),
    adminPermissions: (page: Page) =>
      page
        .locator('.section', { has: page.getByRole('heading', { name: 'Administration Settings' }) })
        .locator(createSettingSelector('Administration Permissions')),
    adminUsers: (page: Page) =>
      page
        .locator('.section', { has: page.getByRole('heading', { name: 'Administration Settings' }) })
        .locator(createSettingSelector('Users')),
    adminRoles: (page: Page) =>
      page
        .locator('.section', { has: page.getByRole('heading', { name: 'Administration Settings' }) })
        .locator(createSettingSelector('Roles')),
    adminGroups: (page: Page) =>
      page
        .locator('.section', { has: page.getByRole('heading', { name: 'Administration Settings' }) })
        .locator(createSettingSelector('Groups')),
    geocodingStatus: (page: Page) =>
      page.locator('section > h1:has-text("Geocoding") + div').locator(createSettingSelector('Status')),
    geocodingGrid: (page: Page) => page.locator(createSettingSelector('Geocoding Data')),
    geocodingAddress: (page: Page) =>
      page.locator(createSettingSelector('Geocoding Data')).locator(createSettingSelector('Street Address')),
    geocodingCity: (page: Page) =>
      page.locator(createSettingSelector('Geocoding Data')).locator(createSettingSelector('City')),
    geocodingState: (page: Page) =>
      page.locator(createSettingSelector('Geocoding Data')).locator(createSettingSelector('State/Province')),
    geocodingZip: (page: Page) =>
      page.locator(createSettingSelector('Geocoding Data')).locator(createSettingSelector('Zip/Postal Code')),

    editGeneralSettingsLink: (page: Page) => page.locator('a[data-dialog-name="EditGeneralSettings"]'),
    editDisplaySettingsLink: (page: Page) =>
      page.getByRole('heading', { name: 'Edit Display Settings' }).getByRole('link'),
    editAdminSettingsLink: (page: Page) =>
      page.getByRole('heading', { name: 'Edit Administration Settings' }).getByRole('link'),
    editGeocodingSettingsLink: (page: Page) => page.getByRole('heading', { name: 'Edit Geocoding' }).getByRole('link'),
    editNotesSettingLink: (page: Page) => page.getByRole('heading', { name: 'Edit Notes' }).getByRole('link'),
  },
};

export const EditGeneralSettingsModalTargets = {
  nameInput: (page: Page) => page.getByLabel('Name'),
  descriptionEditor: (page: Page) => page.locator('.content-area.mce-content-body'),
  statusSwitch: (page: Page) => page.getByRole('switch', { name: 'Status' }),
  statusToggle: (page: Page) => page.getByRole('switch', { name: 'Status' }).locator('span').nth(3),
  contentVersionStatusSwitch: (page: Page) => page.getByRole('switch', { name: 'Content Versioning' }),
  contentVersionStatusToggle: (page: Page) =>
    page.getByRole('switch', { name: 'Content Versioning' }).locator('span').nth(3),
  contentVersionTypes: (page: Page) => page.locator('#versioning-types'),
  directUserSavesCheckbox: (page: Page) => page.getByLabel('Direct User Saves', { exact: true }),
  indirectUserSavesCheckbox: (page: Page) => page.getByLabel('Indirect User Saves', { exact: true }),
  apiSavesCheckbox: (page: Page) => page.getByLabel('API Saves', { exact: true }),
  systemSavesCheckbox: (page: Page) => page.getByLabel('System Saves', { exact: true }),
  concurrentEditAlertStatusSwitch: (page: Page) =>
    page.locator('.label:has-text("Concurrent Edit Alert") + .data').getByRole('switch'),
  concurrentEditAlertStatusToggle: (page: Page) =>
    page.locator('.label:has-text("Concurrent Edit Alert") + .data').getByRole('switch').locator('span').nth(3),
  saveButton: (page: Page) => page.getByRole('button', { name: 'Save' }),
  cancelButton: (page: Page) => page.getByRole('button', { name: 'Cancel' }),
};

export const EditDisplaySettingsModalTargets = {
  displayLinkSelect: (page: Page) => page.getByRole('listbox', { name: 'Display Link Field' }),
  integrationLinkSelect: (page: Page) => page.getByRole('listbox', { name: 'Integration Link Field' }),
  displayFieldsSelect: (page: Page) => page.locator('.selector-select-list'),
  primarySortSelect: (page: Page) => page.locator('td.label:has-text("Primary Sort") + td>div').first(),
  primarySortDirectionSelect: (page: Page) =>
    page.locator('td.label:has-text("Primary Sort") + td>div>span:nth-child(2)').first(),
  secondarySortSelect: (page: Page) => page.locator('td.label:has-text("Secondary Sort") + td>div').first(),
  secondarySortDirectionSelect: (page: Page) =>
    page.locator('td.label:has-text("Secondary Sort") + td>div>span:nth-child(2)').first(),
  saveButton: (page: Page) => page.getByRole('button', { name: 'Save' }),
  unselectedDisplayOption: (field: string) => (page: Page) =>
    page.locator(`.selector-control .unselected-pane li:has-text("${field}")`),
  selectorCloseButton: (page: Page) => page.locator('.selector-control:not(.invisible)').getByTitle('Close').first(),
};

export const OptionTargets = {
  byName: (name: string) => (page: Page) => page.getByRole('option', { name }),
};

export const EditAdminSettingsModalTargets = {
  modal: (page: Page) => page.getByRole('dialog', { name: /administration settings/i }),
  adminPermissionsSelect: (page: Page) =>
    page
      .getByRole('dialog', { name: /administration settings/i })
      .getByRole('listbox', { name: 'Administration Permissions' }),
  usersSelector: (page: Page) =>
    page.getByRole('dialog', { name: /administration settings/i }).locator('.label:has-text("Users") + .data'),
  groupsSelector: (page: Page) =>
    page.getByRole('dialog', { name: /administration settings/i }).locator('.label:has-text("Groups") + .data'),
  rolesSelector: (page: Page) =>
    page.getByRole('dialog', { name: /administration settings/i }).locator('.label:has-text("Roles") + .data'),
  saveButton: (page: Page) =>
    page.getByRole('dialog', { name: /administration settings/i }).getByRole('button', { name: 'Save' }),
};

export const EditGeocodingSettingsModalTargets = {
  statusSwitch: (page: Page) => page.getByRole('switch', { name: 'Status' }),
  statusToggle: (page: Page) => page.getByRole('switch', { name: 'Status' }).locator('span').nth(3),
  geocodingDataGrid: (page: Page) => page.locator('#geocoding-data-row'),
  addressSelect: (page: Page) => page.locator('#geocoding-data-row').getByRole('listbox', { name: 'Street Address' }),
  citySelect: (page: Page) => page.locator('#geocoding-data-row').getByRole('listbox', { name: 'City' }),
  stateSelect: (page: Page) => page.locator('#geocoding-data-row').getByRole('listbox', { name: 'State/Province' }),
  zipSelect: (page: Page) => page.locator('#geocoding-data-row').getByRole('listbox', { name: 'Zip/Postal Code' }),
  saveButton: (page: Page) => page.getByRole('button', { name: 'Save' }),
};

export const EditNotesSettingsModalTargets = {
  notesEditor: (page: Page) => page.locator('.content-area.mce-content-body'),
  saveButton: (page: Page) => page.getByRole('button', { name: 'Save' }),
};

export const AppMessagingTabTargets = {
  addEmailBodyLink: (page: Page) => page.getByRole('link', { name: 'Add Email Body' }),
  emailBodyGrid: (page: Page) => page.locator('#grid-emails'),
  rowByName: (name: string) => (page: Page) => page.locator('#grid-emails').getByRole('row', { name }),
  deleteButtonInRow: (name: string) => (page: Page) =>
    page.locator('#grid-emails').getByRole('row', { name }).getByTitle('Delete Email Body'),
  editButtonInRow: (name: string) => (page: Page) =>
    page.locator('#grid-emails').getByRole('row', { name }).getByTitle('Edit Email Body'),

  addTextMessageLink: (page: Page) => page.getByRole('link', { name: 'Add Text Message' }),
  textMessageGrid: (page: Page) => page.locator('#grid-text-messages'),
  textMessageRowByName: (name: string) => (page: Page) =>
    page.locator('#grid-text-messages').getByRole('row', { name }),
  deleteTextMessageButtonInRow: (name: string) => (page: Page) =>
    page.locator('#grid-text-messages').getByRole('row', { name }).getByTitle('Delete Text Message'),
  editTextMessageButtonInRow: (name: string) => (page: Page) =>
    page.locator('#grid-text-messages').getByRole('row', { name }).getByTitle('Edit Text Message'),

  addSlackMessageLink: (page: Page) => page.getByRole('link', { name: 'Add Slack Message' }),
  slackMessageGrid: (page: Page) => page.locator('#grid-slack-messages'),
  slackMessageRowByName: (name: string) => (page: Page) =>
    page.locator('#grid-slack-messages').getByRole('row', { name }),
  deleteSlackMessageButtonInRow: (name: string) => (page: Page) =>
    page.locator('#grid-slack-messages').getByRole('row', { name }).getByTitle('Delete Slack Message'),
  editSlackMessageButtonInRow: (name: string) => (page: Page) =>
    page.locator('#grid-slack-messages').getByRole('row', { name }).getByTitle('Edit Slack Message'),
};

const appDocumentsGrid = (page: Page) => page.locator('#grid-documents');

export const AppDocumentsTabTargets = {
  addDocumentLink: (page: Page) => page.getByRole('link', { name: 'Add Document' }),
  documentsGrid: appDocumentsGrid,
  rowByName:
    (name: string): Target =>
    (page: Page) =>
      appDocumentsGrid(page).getByRole('row', { name }).first(),
  editButtonInRow:
    (name: string): Target =>
    (page: Page) =>
      appDocumentsGrid(page).getByRole('row', { name }).first().getByTitle('Edit Document'),
  deleteButtonInRow:
    (name: string): Target =>
    (page: Page) =>
      appDocumentsGrid(page).getByRole('row', { name }).first().getByTitle('Delete Document'),
};

const layoutsGrid = (page: Page) => page.locator('#grid-layouts').first();
const copyLayoutDialog = (page: Page) => page.getByRole('dialog', { name: 'Copy Layout' });
const layoutDesignerDialog = (page: Page) => page.getByRole('dialog').first();
const layoutDesignerFrame = (page: Page) => layoutDesignerDialog(page).frameLocator('iframe').first();
const layoutDesignerCanvas = (page: Page) => layoutDesignerFrame(page).locator('.canvas-section').first();
const editLayoutPropertiesModal = (page: Page) => layoutDesignerFrame(page).locator('#editLayoutPropertiesPopover');
const deleteSectionDialog = (page: Page) => page.getByRole('dialog', { name: 'Delete Section' });

const designerTabButton =
  (tabName: string): Target =>
  (page: Page) =>
    layoutDesignerCanvas(page).locator('.k-tabstrip-items').locator('div.k-item').filter({ hasText: tabName }).first();

export const AppLayoutTabTargets = {
  layoutsGrid,
  fieldsAndObjectsGrid: (page: Page) => page.locator('#grid-layout-items').first(),
  fieldsAndObjectsGridRows: (page: Page) => page.locator('#grid-layout-items').first().locator('.k-grid-content tr'),
  fieldOrObjectRowByName:
    (name: string | RegExp): Target =>
    (page: Page) =>
      page.locator('#grid-layout-items').first().getByRole('row', { name }),
  getLayoutItemPathRegex: /Admin\/App\/\d+\/Layout\/ItemListPage/,
  filterFieldsInput: (page: Page) => page.getByPlaceholder('Filter Fields'),
  exportFieldsAndObjectsReportButton: (page: Page) => page.locator('#export-layout-items'),
  exportEmailDownloadLink: (page: Page) => page.getByRole('link', { name: 'Download the export file' }),
  addLayoutLink: (page: Page) => page.getByRole('link', { name: 'Add Layout' }),
  layoutRowByName:
    (name: string): Target =>
    (page: Page) =>
      layoutsGrid(page).getByRole('row', { name }).first(),
  copyLayoutButtonInRow:
    (name: string): Target =>
    (page: Page) =>
      layoutsGrid(page).getByRole('row', { name }).first().getByTitle('Copy Layout'),
  deleteLayoutButtonInRow:
    (name: string): Target =>
    (page: Page) =>
      layoutsGrid(page).getByRole('row', { name }).first().getByTitle('Delete Layout'),
  copyLayoutDialog: {
    dialog: copyLayoutDialog,
    layoutNameInput: (page: Page) => copyLayoutDialog(page).getByLabel('Layout Name'),
    copyButton: (page: Page) => copyLayoutDialog(page).getByRole('button', { name: 'Copy' }),
  },
  getLayoutDesignPathRegex: /\/Admin\/App\/Layout\/\d+\/Design/,
  saveLayoutPathRegex: /\/Admin\/App\/\d+\/Layout\/\d+\/Save/,

  designer: {
    dialog: layoutDesignerDialog,
    frame: layoutDesignerFrame,
    editLayoutPropertiesLink: (page: Page) =>
      layoutDesignerFrame(page).getByRole('link', { name: 'Edit Layout Properties' }),
    configureTabSetLink: (page: Page) => layoutDesignerFrame(page).getByRole('link', { name: 'Configure Tab Set' }),
    tabOrientationSelected: (page: Page) => layoutDesignerFrame(page).locator('#canvas-orientation .selected'),
    fieldsTabButton: (page: Page) =>
      layoutDesignerFrame(page).locator('.item-container').first().locator('#tabstrip-container').getByText('Fields'),
    objectsTabButton: (page: Page) =>
      layoutDesignerFrame(page).locator('.item-container').first().locator('#tabstrip-container').getByText('Objects'),
    addFieldButton: (page: Page) => layoutDesignerFrame(page).getByTitle('Add Field'),
    addObjectButton: (page: Page) => layoutDesignerFrame(page).getByTitle('Add Object'),
    addFieldMenuOption:
      (fieldType: string): Target =>
      (page: Page) =>
        layoutDesignerFrame(page).locator('[data-add-menu="field"]').first().getByText(fieldType, { exact: true }),
    addObjectMenuOption:
      (objectType: string): Target =>
      (page: Page) =>
        layoutDesignerFrame(page).locator('[data-add-menu="object"]').first().getByText(objectType, { exact: true }),
    fieldFromBank:
      (fieldName: string): Target =>
      (page: Page) =>
        layoutDesignerFrame(page)
          .locator('[data-tab-content="field"]')
          .locator('div.layoutItem')
          .filter({ hasText: fieldName })
          .first(),
    objectFromBank:
      (objectName: string): Target =>
      (page: Page) =>
        layoutDesignerFrame(page)
          .locator('[data-tab-content="object"]')
          .locator('div.layoutItem')
          .filter({ hasText: objectName })
          .first(),
    canvasSection: layoutDesignerCanvas,
    canvasTabStrip: (page: Page) => layoutDesignerCanvas(page).locator('.k-tabstrip-items'),
    canvasTabButton: designerTabButton,
    editTabNameButton:
      (tabName: string): Target =>
      (page: Page) =>
        resolveTarget(page, designerTabButton(tabName)).locator('[title="Edit Tab Name"]'),
    canvasTabText:
      (tabName: string): Target =>
      (page: Page) =>
        layoutDesignerCanvas(page).locator('.k-tabstrip-items').getByText(tabName).first(),
    canvasTabDropzones: (page: Page) => layoutDesignerCanvas(page).locator('.k-tabstrip-items').locator('.tabDropArea'),
    canvasTabDropzoneAt:
      (index: number): Target =>
      (page: Page) =>
        layoutDesignerCanvas(page).locator('.k-tabstrip-items').locator('.tabDropArea').nth(index),
    hoveredTabDropzone: (page: Page) => layoutDesignerCanvas(page).locator('.tabDropArea.ui-droppable-hover'),
    standaloneSectionDropzones: (page: Page) => layoutDesignerCanvas(page).locator('.standaloneSectionDropArea'),
    standaloneSectionDropzoneAt:
      (index: number): Target =>
      (page: Page) =>
        layoutDesignerCanvas(page).locator('.standaloneSectionDropArea').nth(index),
    hoveredStandaloneSectionDropzone: (page: Page) =>
      layoutDesignerCanvas(page).locator('.standaloneSectionDropArea.ui-droppable-hover'),
    sectionDropzonesInTab:
      (tabId: string): Target =>
      (page: Page) =>
        layoutDesignerCanvas(page).locator(`[data-tab-body="${tabId}"]`).first().locator('.sectionDropArea'),
    sectionDropzoneInTabAt:
      (tabId: string, index: number): Target =>
      (page: Page) =>
        layoutDesignerCanvas(page).locator(`[data-tab-body="${tabId}"]`).first().locator('.sectionDropArea').nth(index),
    hoveredSectionDropzone: (page: Page) => layoutDesignerCanvas(page).locator('.sectionDropArea.ui-droppable-hover'),
    standaloneSectionByName:
      (sectionName: string): Target =>
      (page: Page) =>
        layoutDesignerCanvas(page).locator('.mainContainer > .section').filter({ hasText: sectionName }).first(),
    canvasSectionByName:
      (sectionName: string): Target =>
      (page: Page) =>
        layoutDesignerCanvas(page).locator('section.section').filter({ hasText: sectionName }).first(),
    canvasSectionInTab:
      (tabId: string, sectionName: string): Target =>
      (page: Page) =>
        layoutDesignerCanvas(page)
          .locator(`[data-tab-body="${tabId}"]`)
          .first()
          .locator('section')
          .filter({ hasText: sectionName })
          .first(),
    sectionHandle:
      (sectionTarget: Target): Target =>
      (page: Page) =>
        resolveTarget(page, sectionTarget).locator('[data-section-header]'),
    sectionHeading:
      (sectionTarget: Target): Target =>
      (page: Page) =>
        resolveTarget(page, sectionTarget).locator('h1'),
    editSectionNameButton:
      (sectionTarget: Target): Target =>
      (page: Page) =>
        resolveTarget(page, sectionTarget).getByTitle('Edit Section Name'),
    sectionColumnsListbox:
      (sectionTarget: Target): Target =>
      (page: Page) =>
        resolveTarget(page, sectionTarget).locator('#columns-container').getByRole('listbox'),
    sectionColumnOption:
      (columnCount: number): Target =>
      (page: Page) =>
        layoutDesignerFrame(page).getByRole('option', { name: columnCount.toString() }),
    sectionDeleteLink:
      (sectionTarget: Target): Target =>
      (page: Page) =>
        resolveTarget(page, sectionTarget).getByRole('link', { name: 'Delete' }),
    deleteSectionDialog,
    deleteSectionConfirmButton: (page: Page) => deleteSectionDialog(page).getByRole('button', { name: 'Delete' }),
    nameEditor: {
      container: (page: Page) => layoutDesignerFrame(page).locator('#name-editor'),
      input: (page: Page) => layoutDesignerFrame(page).locator('#name-editor input'),
      applyButton: (page: Page) => layoutDesignerFrame(page).locator('#name-editor').getByTitle('Apply'),
    },
    editPropertiesModal: {
      modal: editLayoutPropertiesModal,
      nameInput: (page: Page) => editLayoutPropertiesModal(page).getByLabel('Name'),
      rolesSelector: (page: Page) =>
        editLayoutPropertiesModal(page).locator('.label:has-text("Role Permissions") + .data .onx-selector'),
      statusSwitch: (page: Page) => editLayoutPropertiesModal(page).getByRole('switch', { name: 'Status' }),
      statusToggle: (page: Page) =>
        editLayoutPropertiesModal(page).getByRole('switch', { name: 'Status' }).locator('span').nth(3),
      applyButton: (page: Page) => editLayoutPropertiesModal(page).getByRole('link', { name: 'Apply' }),
      cancelButton: (page: Page) => editLayoutPropertiesModal(page).getByRole('link', { name: 'Cancel' }),
    },
    configureTabSetModal: {
      deleteTabButton:
        (tabName: string): Target =>
        (page: Page) =>
          layoutDesignerFrame(page).locator('.grid').getByRole('row', { name: tabName }).locator('[data-delete]'),
      applyButton: (page: Page) => layoutDesignerFrame(page).getByRole('link', { name: 'Apply' }),
    },
    renderedItemsInSection:
      (sectionTarget: Target): Target =>
      (page: Page) =>
        resolveTarget(page, sectionTarget).locator('.rendered-item'),
    dropzoneInSectionAt:
      (sectionTarget: Target, column: number, row: number): Target =>
      (page: Page) =>
        resolveTarget(page, sectionTarget)
          .locator(`.rendered-item[data-column="${column}"][data-row="${row}"]`)
          .first(),
    removeFieldFromDropzoneButton:
      (dropzoneTarget: Target): Target =>
      (page: Page) =>
        resolveTarget(page, dropzoneTarget).getByTitle('Remove Field from Layout'),
    removeObjectFromDropzoneButton:
      (dropzoneTarget: Target): Target =>
      (page: Page) =>
        resolveTarget(page, dropzoneTarget).getByTitle('Remove Object from Layout'),
    dropLocation: (page: Page) => layoutDesignerCanvas(page).locator('#dropLocation'),
    saveButton: (page: Page) => layoutDesignerDialog(page).getByRole('button', { name: 'Save', exact: true }),
    saveAndCloseButton: (page: Page) => layoutDesignerDialog(page).getByRole('button', { name: 'Save & Close' }),
    closeButton: (page: Page) => layoutDesignerDialog(page).getByRole('button', { name: 'Close' }),
  },

  addFieldButton: (page: Page) => page.getByText('Add Field'),
  addLayoutItemMenu: (itemType: string) => (page: Page) =>
    page.locator('[data-add-menu="layout-item"]').first().getByText(itemType, { exact: true }),
  addLayoutItemDialogContinueButton: (page: Page) => page.getByRole('button', { name: 'Continue' }),
  addItemPathRegex: /\/Admin\/App\/\d+\/(LayoutObject|Field)\/Add(TextObject|UsingSettings|LabelObject)/,
  addOrEditPathRegex: /\/Admin\/App\/\d+\/Field\/(AddUsingSettings|\d+\/Edit)/,

  fieldModal: {
    frame:
      (frameNumber: number = 0) =>
      (page: Page) =>
        page.frameLocator('iframe').nth(frameNumber),
    nameInput:
      (frameNumber: number = 0) =>
      (page: Page) =>
        page.frameLocator('iframe').nth(frameNumber).getByLabel('Field', { exact: true }),
    listValuesGrid: {
      addValueButton:
        (frameNumber: number = 0) =>
        (page: Page) =>
          page
            .frameLocator('iframe')
            .nth(frameNumber)
            .locator('.list-values')
            .first()
            .getByRole('button', { name: 'Add Value' }),
      lastRowValueInput:
        (frameNumber: number = 0) =>
        (page: Page) =>
          page
            .frameLocator('iframe')
            .nth(frameNumber)
            .locator('.list-values')
            .first()
            .locator('div.k-grid-content')
            .getByRole('row')
            .last()
            .locator('td[data-field="name"] input'),
      lastRowNumericValueInput:
        (frameNumber: number = 0) =>
        (page: Page) =>
          page
            .frameLocator('iframe')
            .nth(frameNumber)
            .locator('.list-values')
            .first()
            .locator('div.k-grid-content')
            .getByRole('row')
            .last()
            .locator('td[data-field="numericValue"] input.k-formatted-value'),
      lastRowColorPicker:
        (frameNumber: number = 0) =>
        (page: Page) =>
          page
            .frameLocator('iframe')
            .nth(frameNumber)
            .locator('.list-values')
            .first()
            .locator('div.k-grid-content')
            .getByRole('row')
            .last()
            .locator('td[data-field="color"] span.k-colorpicker'),
    },
    dateDisplaySelect:
      (frameNumber: number = 0) =>
      (page: Page) =>
        page.frameLocator('iframe').nth(frameNumber).locator('.label:has-text("Display") + .data').getByRole('listbox'),
    dateDisplayOption:
      (display: string, frameNumber: number = 0) =>
      (page: Page) =>
        page.frameLocator('iframe').nth(frameNumber).getByRole('option', { name: display, exact: true }),
    referenceSelect:
      (frameNumber: number = 0) =>
      (page: Page) =>
        page.frameLocator('iframe').nth(frameNumber).getByRole('listbox', { name: 'Reference' }),
    referenceOption:
      (reference: string, frameNumber: number = 0) =>
      (page: Page) =>
        page.frameLocator('iframe').nth(frameNumber).getByRole('option', { name: reference }),
    selectedGridFields:
      (frameNumber: number = 0) =>
      (page: Page) =>
        page
          .frameLocator('iframe')
          .nth(frameNumber)
          .locator('td:has-text("Grid Fields") + td div.onx-selector')
          .locator('.selector-select-list li')
          .first(),
    referenceDisplayFieldsPathRegex: /\/Admin\/App\/\d+\/Field\/ReferenceDisplayFields/,
    securityTabButton:
      (frameNumber: number = 0) =>
      (page: Page) =>
        page.frameLocator('iframe').nth(frameNumber).getByRole('tab', { name: 'Security' }),
    securityViewSelect:
      (frameNumber: number = 0) =>
      (page: Page) =>
        page.frameLocator('iframe').nth(frameNumber).getByRole('listbox', { name: 'View' }),
    securityOption:
      (optionName: string, frameNumber: number = 0) =>
      (page: Page) =>
        page.frameLocator('iframe').nth(frameNumber).getByRole('option', { name: optionName }),
    saveButton: (page: Page) => page.getByRole('button', { name: 'Save', exact: true }).last(),
  },

  exportFieldsAndObjectsModal: {
    modal: (page: Page) => page.getByRole('dialog', { name: 'Export Fields & Objects' }),
    formatSelect: (page: Page) =>
      page
        .getByRole('dialog', { name: 'Export Fields & Objects' })
        .locator('.label:has-text("Format") + .data')
        .getByRole('listbox'),
    fieldsSelector: (page: Page) =>
      page
        .getByRole('dialog', { name: 'Export Fields & Objects' })
        .locator('.label:has-text("Fields") + .data .onx-selector'),
    includeUsageCheckbox: (page: Page) =>
      page
        .getByRole('dialog', { name: 'Export Fields & Objects' })
        .getByRole('checkbox', { name: 'Include usage data (Word and PDF only)' }),
    includeListValueGUIDsCheckbox: (page: Page) =>
      page
        .getByRole('dialog', { name: 'Export Fields & Objects' })
        .getByRole('checkbox', { name: 'Include list value GUIDs for API development' }),
    messageCenterAlertsOnlyCheckbox: (page: Page) =>
      page
        .getByRole('dialog', { name: 'Export Fields & Objects' })
        .getByRole('checkbox', { name: 'Message Center Alerts Only' }),
    exportButton: (page: Page) =>
      page.getByRole('dialog', { name: 'Export Fields & Objects' }).getByRole('button', { name: 'Export' }),
  },
};
