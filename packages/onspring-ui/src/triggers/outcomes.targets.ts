import { Locator, Page } from '@playwright/test';

const outcomeModal = (page: Page): Locator => page.getByRole('dialog', { name: /outcome/i });

const customBatchModal = (page: Page): Locator => page.getByRole('dialog', { name: /content definition/i });

const addAppDefinitionDialog = (page: Page): Locator => page.getByRole('dialog', { name: 'Add App Definition' });

const libraryModal = (page: Page): Locator => page.getByRole('dialog', { name: /app definition/i });

const setDateInputContainer = (page: Page): Locator =>
  outcomeModal(page).locator('.label:has-text("Field") + .data .input-container');

const setListValueInputContainer = (page: Page): Locator =>
  outcomeModal(page).locator('.label:has-text("Field / Value") + .data .input-container');

const setReferenceContainer = (page: Page): Locator => outcomeModal(page).locator('#setReferenceOutcome_Outcomes');

const filterListValueInputContainer = (page: Page): Locator =>
  outcomeModal(page).locator('.label:has-text("Field") + .data .input-container');

const creationTypeSection = (page: Page): Locator =>
  outcomeModal(page).locator('.section', {
    has: page.getByRole('heading', { name: 'Creation Type' }),
  });

const creationConfigurationSection = (page: Page): Locator =>
  outcomeModal(page).locator('.section', {
    has: page.getByRole('heading', { name: 'Creation Configuration' }),
  });

const lastFieldMappingRow = (page: Page): Locator =>
  outcomeModal(page).locator('#FieldMappingGrid .k-grid-content').getByRole('row').last();

const objectVisibilitySection =
  (tabName: string, sectionName: string) =>
  (page: Page): Locator =>
    outcomeModal(page)
      .locator('.outcome-layout .tab', { hasText: tabName })
      .locator('.outcome-section', { hasText: sectionName });

const objectVisibilityDisplayModeMenu =
  (tabName: string, sectionName: string) =>
  (page: Page): Locator =>
    objectVisibilitySection(
      tabName,
      sectionName
    )(page).locator('.display-mode-menu', {
      hasText: 'Section Visibility',
    });

export const OutcomeModalTargets = {
  modal: outcomeModal,
  okButton: (page: Page): Locator => outcomeModal(page).getByRole('button', { name: 'OK' }),
  cancelButton: (page: Page): Locator => outcomeModal(page).getByRole('button', { name: 'Cancel' }),
  optionByName:
    (name: string) =>
    (page: Page): Locator =>
      page.getByRole('option', { name }),
  generalTabButton: (page: Page): Locator => outcomeModal(page).getByRole('tab', { name: 'General' }),
  generalTab: {
    descriptionEditor: (page: Page): Locator => outcomeModal(page).locator('.content-area.mce-content-body'),
    statusSwitch: (page: Page): Locator => outcomeModal(page).getByRole('switch'),
    statusToggle: (page: Page): Locator => outcomeModal(page).getByRole('switch').locator('span').nth(3),
  },
  objectVisibility: {
    displayTabButton: (page: Page): Locator => outcomeModal(page).getByRole('tab', { name: 'Display' }),
    layoutSelect: (page: Page): Locator =>
      outcomeModal(page).locator('.label:has-text("Layout") + .data').getByRole('listbox'),
    layoutOption:
      (layoutName: string) =>
      (page: Page): Locator =>
        page.getByRole('option', { name: layoutName }),
    layoutTab:
      (tabName: string) =>
      (page: Page): Locator =>
        outcomeModal(page).locator('.outcome-layout .tab', { hasText: tabName }),
    layoutSection: objectVisibilitySection,
    sectionVisibilityButton:
      (tabName: string, sectionName: string) =>
      (page: Page): Locator =>
        objectVisibilitySection(tabName, sectionName)(page).getByRole('button', { name: 'Section:' }),
    sectionDisplayModeMenu: objectVisibilityDisplayModeMenu,
    sectionDisplayModeOption:
      (tabName: string, sectionName: string, visibility: string) =>
      (page: Page): Locator =>
        objectVisibilityDisplayModeMenu(tabName, sectionName)(page).getByText(visibility),
  },
  stopCalculation: {
    fieldsSelector: (page: Page): Locator =>
      outcomeModal(page).locator('.label:has-text("Stop Calculation") + .data .onx-selector'),
  },
  setDate: {
    fieldSelect: (page: Page): Locator => setDateInputContainer(page).locator('.field-list').getByRole('listbox'),
    typeSelect: (page: Page): Locator =>
      setDateInputContainer(page).locator('.outcome-type-container').getByRole('listbox'),
    addRuleButton: (page: Page): Locator => setDateInputContainer(page).getByRole('button', { name: 'Add' }),
  },
  setListValue: {
    fieldSelect: (page: Page): Locator => setListValueInputContainer(page).locator('.field-list').getByRole('listbox'),
    singleValueSelect: (page: Page): Locator =>
      setListValueInputContainer(page).locator('.value-container').getByRole('listbox'),
  },
  setReference: {
    fieldSelect: (page: Page): Locator =>
      setReferenceContainer(page).locator('.label:has-text("Field") + .data').getByRole('listbox'),
    methodSelect: (page: Page): Locator =>
      setReferenceContainer(page).locator('.label:has-text("Method") + .data').getByRole('listbox'),
    valueSelect: (page: Page): Locator =>
      setReferenceContainer(page).locator('.label:has-text("Value") + .data').getByRole('listbox'),
  },
  requiredFields: {
    fieldsSelector: (page: Page): Locator =>
      outcomeModal(page).locator('.label:has-text("Required Fields") + .data .onx-selector'),
  },
  filterListValue: {
    fieldSelect: (page: Page): Locator =>
      filterListValueInputContainer(page).locator('.field-list').getByRole('listbox'),
    valuesSelector: (page: Page): Locator =>
      filterListValueInputContainer(page).locator('.value-container .onx-selector'),
    addRuleButton: (page: Page): Locator => filterListValueInputContainer(page).getByRole('button', { name: 'Add' }),
  },
  printContentRecord: {
    layoutSelect: (page: Page): Locator =>
      outcomeModal(page).locator('.label:has-text("Layout") + .data').getByRole('listbox'),
    orientationSelect: (page: Page): Locator =>
      outcomeModal(page).locator('.label:has-text("Orientation") + .data').getByRole('listbox'),
    contentVisibilitySelect: (page: Page): Locator =>
      outcomeModal(page).locator('.label:has-text("Content Visibility") + .data').getByRole('listbox'),
    attachmentFieldSelect: (page: Page): Locator =>
      outcomeModal(page).locator('.label:has-text("Attachment Field") + .data').getByRole('listbox'),
  },
  createOneRecord: {
    creationSettingsTabButton: (page: Page): Locator =>
      outcomeModal(page).getByRole('tab', { name: 'Creation Settings' }),
    appSelect: (page: Page): Locator =>
      outcomeModal(page).locator('.label:has-text("App/Survey") + .data').getByRole('listbox'),
    frequencySelect: (page: Page): Locator =>
      outcomeModal(page).locator('.label:has-text("Frequency") + .data').getByRole('listbox'),
    layoutSelect: (page: Page): Locator =>
      outcomeModal(page).locator('.label:has-text("Layout") + .data').getByRole('listbox'),
  },
  createMultipleRecords: {
    creationSettingsTabButton: (page: Page): Locator =>
      outcomeModal(page).getByRole('tab', { name: 'Creation Settings' }),
    frequencySelect: (page: Page): Locator =>
      outcomeModal(page).locator('.label:has-text("Frequency") + .data').getByRole('listbox'),
    batchTypeSelect: (page: Page): Locator =>
      outcomeModal(page).locator('.label:has-text("Batch Type") + .data').getByRole('listbox'),
    addDefinitionLink: (page: Page): Locator =>
      outcomeModal(page).getByRole('link', { name: /add (?:app|content) definition/i }),
    customBatchModal: {
      modal: customBatchModal,
      generalSettingsTabButton: (page: Page): Locator =>
        customBatchModal(page).getByRole('tab', { name: 'General Settings' }),
      contentSettingsTabButton: (page: Page): Locator =>
        customBatchModal(page).getByRole('tab', { name: 'Content Settings' }),
      batchRecordNameInput: (page: Page): Locator => customBatchModal(page).locator('#CustomContentName'),
      descriptionEditor: (page: Page): Locator => customBatchModal(page).locator('.content-area.mce-content-body'),
      appSelect: (page: Page): Locator =>
        customBatchModal(page).locator('.label:has-text("App/Survey") + .data').getByRole('listbox'),
      layoutSelect: (page: Page): Locator =>
        customBatchModal(page).locator('.label:has-text("Layout") + .data').getByRole('listbox'),
      okButton: (page: Page): Locator => customBatchModal(page).getByRole('button', { name: 'OK' }),
    },
    addAppDefinitionDialog: {
      dialog: addAppDefinitionDialog,
      sourceAppSelect: (page: Page): Locator =>
        addAppDefinitionDialog(page).locator('.label:has-text("Source App") + .data').getByRole('listbox'),
      okButton: (page: Page): Locator => addAppDefinitionDialog(page).getByRole('button', { name: 'OK' }),
    },
    libraryModal: {
      modal: libraryModal,
      contentSelectionSettingsTabButton: (page: Page): Locator =>
        libraryModal(page).getByRole('tab', { name: 'Content Selection Settings' }),
      contentCopySettingsTabButton: (page: Page): Locator =>
        libraryModal(page).getByRole('tab', { name: 'Content Copy Settings' }),
      dataFilterRuleControl: (page: Page): Locator =>
        libraryModal(page).locator('.label:has-text("Data Filter") + .data .rule-config'),
      dynamicFilterCheckbox: (page: Page): Locator =>
        libraryModal(page).locator('.label:has-text("Dynamic Filter") + .data').getByRole('checkbox'),
      dynamicFilterFieldsSelector: (page: Page): Locator =>
        libraryModal(page).locator('[data-dynamic-fields] .onx-selector'),
      generateRecordsButton: (page: Page): Locator =>
        libraryModal(page).getByRole('button', { name: 'Generate Records' }),
      generateDefinedRecordsPathRegex: /\/Admin\/App\/\d+\/Trigger\/GenerateDefinedRecords/,
      getDefinedRecordPagePathRegex: /\/Admin\/App\/\d+\/Trigger\/GetDefinedRecordPage/,
      targetAppSelect: (page: Page): Locator =>
        libraryModal(page).locator('.label:has-text("Target App") + .data').getByRole('listbox'),
      layoutSelect: (page: Page): Locator =>
        libraryModal(page).locator('.label:has-text("Layout") + .data').getByRole('listbox'),
      okButton: (page: Page): Locator => libraryModal(page).getByRole('button', { name: 'OK' }),
    },
  },
  generateDocument: {
    creationSettingsTabButton: (page: Page): Locator =>
      outcomeModal(page).getByRole('tab', { name: 'Creation Settings' }),
    documentTypeSelect: (page: Page): Locator =>
      creationTypeSection(page).locator('.label:has-text("Document Type") + .data').getByRole('listbox'),
    documentSelect: (page: Page): Locator =>
      creationConfigurationSection(page).locator('.label:has-text("Document") + .data').getByRole('listbox'),
    fileTypeSelect: (page: Page): Locator =>
      creationConfigurationSection(page).locator('.label:has-text("File Type") + .data').getByRole('listbox'),
    attachmentFieldSelect: (page: Page): Locator =>
      creationConfigurationSection(page).locator('.label:has-text("Attachment Field") + .data').getByRole('listbox'),
  },
  restApi: {
    restApiSettingsTabButton: (page: Page): Locator =>
      outcomeModal(page).getByRole('tab', { name: 'REST API Settings' }),
    notificationsTabButton: (page: Page): Locator => outcomeModal(page).getByRole('tab', { name: 'Notifications' }),
    requestTabButton: (page: Page): Locator => outcomeModal(page).getByRole('tab', { name: 'Request' }),
    httpMethodSelect: (page: Page): Locator =>
      outcomeModal(page).locator('.label:has-text("HTTP Method") + .data').getByRole('listbox'),
    restUrlInput: (page: Page): Locator =>
      outcomeModal(page).locator('.label:has-text("REST URL") + .data').getByRole('textbox'),
    authorizationTypeSelect: (page: Page): Locator =>
      outcomeModal(page).locator('.label:has-text("Authorization Type") + .data').getByRole('listbox'),
    notificationGroupsSelector: (page: Page): Locator =>
      outcomeModal(page).locator('.label:has-text("Notification Groups") + .data'),
    notificationUsersSelector: (page: Page): Locator =>
      outcomeModal(page).locator('.label:has-text("Notification Users") + .data'),
    addFieldButton: (page: Page): Locator => outcomeModal(page).getByRole('button', { name: 'Add Field' }),
    lastMappingRow: lastFieldMappingRow,
    lastMappingSourceInput: (page: Page): Locator =>
      lastFieldMappingRow(page).locator('td').first().locator('input:visible'),
    lastMappingOnspringFieldSelector: (page: Page): Locator =>
      lastFieldMappingRow(page).locator('td').nth(1).locator('.data .onx-selector'),
  },
};
