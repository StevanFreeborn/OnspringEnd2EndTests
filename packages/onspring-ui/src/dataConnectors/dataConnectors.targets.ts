import { Locator, Page } from '@playwright/test';

function labeledControl(label: string) {
  return (page: Page): Locator => page.locator(`.label:has-text("${label}") + .data`);
}

function labeledListbox(label: string) {
  return (page: Page): Locator => labeledControl(label)(page).getByRole('listbox');
}

function labeledTextbox(label: string) {
  return (page: Page): Locator => labeledControl(label)(page).getByRole('textbox');
}

function dataRulesListbox(settingName: string) {
  return (page: Page): Locator =>
    page
      .locator('section', {
        has: page.getByRole('heading', { name: /data rules/i }),
      })
      .locator(`.label:has-text("${settingName}") + .data`)
      .getByRole('listbox');
}

export const DataConnectorsPageTargets = {
  route: '/Admin/Integration/DataConnector',
  getConnectorsPath: '/Admin/Integration/DataConnector/DataConnectorList',
  deletePathRegex: /\/Admin\/Integration\/DataConnector\/\d+\/Delete/,
  createDataConnectorButton: (page: Page): Locator => page.getByRole('button', { name: 'Create Data Connector' }),
  grid: (page: Page): Locator => page.locator('#grid'),
  rowByName:
    (name: string | RegExp) =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).first(),
  deleteButtonInRow:
    (name: string | RegExp) =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).first().getByTitle('Delete Data Connector'),
};

export const CreateDataConnectorDialogTargets = {
  connectorTypeSelector: (page: Page): Locator => page.getByRole('listbox', { name: 'Connector Type' }),
  optionByName:
    (name: string) =>
    (page: Page): Locator =>
      page.getByRole('option', { name }),
};

export const EditDataConnectorPageTargets = {
  route: (id: number): string => `/Admin/Integration/DataConnector/${id}/Edit`,
  pathRegex: /\/Admin\/Integration\/DataConnector\/\d+\/Edit/,
  saveChangesLink: (page: Page): Locator => page.getByRole('link', { name: 'Save Changes' }),
  optionByName:
    (name: string) =>
    (page: Page): Locator =>
      page.getByRole('option', { name }),

  connectionTab: {
    nameInput: (page: Page): Locator => page.getByRole('textbox', { name: 'Name', exact: true }),
    descriptionEditor: (page: Page): Locator => page.locator('.content-area.mce-content-body'),
    statusSwitch: (page: Page): Locator => page.getByRole('switch', { name: 'Status' }),
    statusToggle: (page: Page): Locator => page.getByRole('switch', { name: 'Status' }).locator('span').nth(3),
    viewRunHistoryLink: (page: Page): Locator => page.getByRole('link', { name: 'View Run History' }),
  },

  schedulingTab: {
    startingOnDate: (page: Page): Locator => page.locator('.label:has-text("Starting On") + .data .k-datetimepicker'),
    endingOnDate: (page: Page): Locator => page.locator('.label:has-text("Ending On") + .data .k-datetimepicker'),
    frequencySelector: labeledListbox('Frequency'),
    notificationGroupsSelector: (page: Page): Locator =>
      page.locator('.label:has-text("Notification Groups") + .data .onx-selector'),
    notificationUsersSelector: (page: Page): Locator =>
      page.locator('.label:has-text("Notification Users") + .data .onx-selector'),
    messageCenterSettingsSelector: labeledListbox('Message Center Settings'),
  },
};

export const EditBitsightConnectorPageTargets = {
  savePathRegex: /\/Admin\/Integration\/DataConnector\/EditBitsightConnector/,
  connectionTabButton: (page: Page): Locator => page.getByRole('tab', { name: /connection/i }),
  appMappingTabButton: (page: Page): Locator => page.getByRole('tab', { name: /app mapping/i }),
  dataMappingTabButton: (page: Page): Locator => page.getByRole('tab', { name: /data mapping/i }),
  schedulingTabButton: (page: Page): Locator => page.getByRole('tab', { name: /scheduling/i }),

  connectionTab: {
    apiKeyInput: (page: Page): Locator => page.getByLabel('BitSight API Token'),
  },

  appMappingTab: {
    mappingGridContainer: (page: Page): Locator =>
      page.locator('.section', {
        has: page.getByRole('heading', { name: /app mapping/i }),
      }),
  },

  dataMappingTab: {
    expandButtonByAppName:
      (appName: string) =>
      (page: Page): Locator =>
        page
          .locator('#field-mapping-container')
          .locator('.app-summary', {
            has: page.locator(`.app-name:has-text("${appName}")`),
          })
          .getByRole('button', { name: /expand/i }),
    mappingGridContainer: (page: Page): Locator => page.locator('#field-mapping-designer .layoutDesigner'),
    recordHandlingSelector: dataRulesListbox('Record Handling'),
    sourceMatchFieldSelector: dataRulesListbox('Source Match Field'),
    appMatchFieldSelector: dataRulesListbox('App Match Field'),
    messagingSelector: dataRulesListbox('Messaging'),
  },
};

export const EditSecureFileConnectorPageTargets = {
  savePath: '/Admin/Integration/DataConnector/EditSecureFile',
  getDataPath: '/Admin/Integration/DataConnector/GetDataAsync',
  connectionTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Connection' }),
  dataMappingTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Data Mapping' }),
  integrationSettingsTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Integration Settings' }),
  schedulingTabButton: (page: Page): Locator => page.getByRole('tab', { name: 'Scheduling' }),

  connectionTab: {
    appSurveySelector: labeledListbox('App/Survey'),
    hostNameInput: labeledTextbox('Host Name'),
    portNumberInput: (page: Page): Locator => page.locator('.label:has-text("Port Number") + .data input:visible'),
    fileLocationInput: labeledTextbox('File Location'),
    fileNameInput: labeledTextbox('File Name'),
    fileTypeSelector: labeledListbox('File Type'),
    headerRowCheckbox: (page: Page): Locator => page.getByRole('checkbox', { name: 'File contains a header row' }),
    trimLeadingSpacesCheckbox: (page: Page): Locator =>
      page.getByRole('checkbox', { name: 'Trim leading spaces from all fields' }),
    trimTrailingSpacesCheckbox: (page: Page): Locator =>
      page.getByRole('checkbox', { name: 'Trim trailing spaces from all fields' }),
    authenticationTypeSelector: labeledListbox('Authentication Type'),
    usernameInput: labeledTextbox('Username'),
    passwordInput: labeledTextbox('Password'),
    privateKeyInput: labeledTextbox('Private Key'),
    connectAndRefreshLink: (page: Page): Locator =>
      page.getByRole('link', { name: 'Connect and refresh Data Source fields' }),
    connectionFailedDialogCloseButton: (page: Page): Locator =>
      page.getByRole('dialog', { name: 'Connection Failed' }).getByRole('button', { name: 'Close' }),
    authSuccessDialogCloseButton: (page: Page): Locator =>
      page.getByRole('dialog', { name: 'Authentication Successful' }).getByRole('button', { name: 'Close' }),
  },

  dataMappingTab: {
    mappingGridContainer: (page: Page): Locator => page.locator('#mapping-container .layoutDesigner'),
  },

  integrationSettingsTab: {
    recordHandlingSelector: labeledListbox('Record Handling'),
    sourceMatchFieldSelector: labeledListbox('Source Match Field'),
    appMatchFieldSelector: labeledListbox('App Match Field'),
    messagingSelector: labeledListbox('Messaging'),
    workflowSelector: labeledListbox('Workflow'),
    fieldsToDefaultSelector: (page: Page): Locator =>
      page.locator('.label:has-text("Fields To Default") + .data .onx-selector'),
  },

  schedulingTab: {
    queueParentCheckbox: (page: Page): Locator =>
      page.getByRole('checkbox', {
        name: 'Enable connector queue. (Make this the parent connector in the processing queue.)',
      }),
    queueChildrenSelector: (page: Page): Locator =>
      page.locator('.label:has-text("Queue Children") + .data .onx-selector'),
  },
};
