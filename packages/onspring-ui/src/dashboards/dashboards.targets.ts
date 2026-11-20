import { Locator, Page } from '@playwright/test';
import { Target } from '@stevanfreeborn/screenplay-playwright';

const designerFrame = (page: Page) => page.frameLocator('.dialog');
const propertiesPopover = (page: Page) => designerFrame(page).locator('#editDashboardPropertiesPopover');
const permissionsPopover = (page: Page) => designerFrame(page).locator('#editDashboardPermissionsPopover');
const scheduleModal = (page: Page) => page.getByRole('dialog', { name: 'Configure Scheduled Exports' });

export const DashboardsAdminPageTargets = {
  route: '/Admin/Dashboard',
  getListPagePath: '/Admin/Dashboard/GetListPage',
  deletePathRegex: /\/Admin\/Dashboard\/\d+\/Delete/,
  createDashboardButton: (page: Page): Locator => page.getByRole('button', { name: 'Create Dashboard' }),
  grid: (page: Page): Locator => page.locator('#grid'),
  rowByName:
    (name: string): Target =>
    (page: Page): Locator =>
      page
        .locator('#grid')
        .getByRole('row', { name: new RegExp(name, 'i') })
        .first(),
  editButtonInRow:
    (name: string): Target =>
    (page: Page): Locator =>
      page
        .locator('#grid')
        .getByRole('row', { name: new RegExp(name, 'i') })
        .first()
        .getByTitle('Edit Dashboard'),
  deleteButtonInRow:
    (name: string): Target =>
    (page: Page): Locator =>
      page
        .locator('#grid')
        .getByRole('row', { name: new RegExp(name, 'i') })
        .first()
        .getByTitle('Delete Dashboard'),
};

export const DashboardPageTargets = {
  route: '/Dashboard',
  routeForId: (id: number): string => `/Dashboard/${id}`,
  printEndpoint: (id: number): string => `/Dashboard/${id}/Print`,
  copyrightPatentInfo: (page: Page): Locator => page.getByText('U.S. Patent No. 11,507,628'),
  actionMenuButton: (page: Page): Locator => page.locator('#breadcrumb-action-menu-button'),
  editDashboardLink: (page: Page): Locator => page.locator('#dashboard-action-menu').getByText('Edit Dashboard'),
  printDashboardLink: (page: Page): Locator => page.locator('#dashboard-action-menu').getByText('Print Dashboard'),
  exportDashboardLink: (page: Page): Locator => page.locator('#dashboard-action-menu').getByText('Export Dashboard'),
  getDashboardUrlLink: (page: Page): Locator => page.locator('#dashboard-action-menu').getByText('Get Dashboard Link'),
  breadcrumbTitle: (page: Page): Locator => page.locator('#dashboard-breadcrumbs .bcrumb-end'),
  dashboardTitle: (page: Page): Locator => page.locator('#dashboard-title-container'),
  dashboardContents: (page: Page): Locator => page.locator('#dashboard-contents'),
  exportEmailDownloadLink: (page: Page): Locator => page.getByRole('link'),

  printModal: {
    dialog: (page: Page): Locator => page.getByRole('dialog', { name: 'Print Dashboard' }),
    okButton: (page: Page): Locator =>
      page.getByRole('dialog', { name: 'Print Dashboard' }).getByRole('button', { name: 'OK' }),
  },

  exportModal: {
    dialog: (page: Page): Locator => page.getByRole('dialog', { name: 'Export Dashboard' }),
    okButton: (page: Page): Locator =>
      page.getByRole('dialog', { name: 'Export Dashboard' }).getByRole('button', { name: 'OK' }),
  },

  exportUnderwayDialog: {
    dialog: (page: Page): Locator => page.getByRole('dialog', { name: 'Export Underway' }),
    closeButton: (page: Page): Locator =>
      page.getByRole('dialog', { name: 'Export Underway' }).getByRole('button', { name: 'Close' }),
  },

  dashboardLinkModal: {
    modal: (page: Page): Locator => page.locator('#messageDialog'),
    linkText: (page: Page): Locator => page.locator('#messageDialog').getByText(/\/Dashboard\/\d+/),
    closeButton: (page: Page): Locator => page.getByRole('button', { name: 'Close' }),
  },
};

export const DashboardDesignerTargets = {
  frameSelector: '.dialog',
  savePathRegex: /\/Admin\/Dashboard\/\d+\/Design/,
  designerOwner: (page: Page): Locator => designerFrame(page).owner(),
  title: (page: Page): Locator => designerFrame(page).locator('.ui-dialog-title .bcrumb-end'),
  closeButton: (page: Page): Locator => page.getByRole('button', { name: 'Close' }),
  saveButton: (page: Page): Locator => page.getByRole('button', { name: 'Save' }),
  saveAndCloseButton: (page: Page): Locator => page.getByRole('button', { name: 'Save & Close' }),
  propertiesLink: (page: Page): Locator => designerFrame(page).getByRole('link', { name: 'Properties' }),
  permissionsLink: (page: Page): Locator => designerFrame(page).getByRole('link', { name: 'Permissions' }),
  schedulingLink: (page: Page): Locator => designerFrame(page).getByRole('link', { name: 'Scheduling' }),
  frameOptionByName:
    (name: string): Target =>
    (page: Page): Locator =>
      designerFrame(page).getByRole('option', { name }),
  pageOptionByName:
    (name: string): Target =>
    (page: Page): Locator =>
      page.getByRole('option', { name }),

  propertiesModal: {
    modal: (page: Page): Locator => propertiesPopover(page),
    nameInput: (page: Page): Locator => propertiesPopover(page).getByLabel('Name'),
    displayTitleSwitch: (page: Page): Locator =>
      propertiesPopover(page).locator('.label:has-text("Display Title") + .data').getByRole('switch'),
    displayTitleToggle: (page: Page): Locator =>
      propertiesPopover(page).locator('.label:has-text("Display Title") + .data').locator('span').nth(3),
    titleInput: (page: Page): Locator => propertiesPopover(page).getByLabel('Title', { exact: true }),
    titleTextColorPicker: (page: Page): Locator =>
      propertiesPopover(page).locator('.label:has-text("Title Text Color") + .data .k-colorpicker .k-picker-wrap'),
    titleTextFormatRadio:
      (format: string): Target =>
      (page: Page): Locator =>
        propertiesPopover(page)
          .locator('.label:has-text("Title Text Format") + .data')
          .getByRole('radio', { name: format }),
    titleAlignmentRadio:
      (alignment: string): Target =>
      (page: Page): Locator =>
        propertiesPopover(page)
          .locator('.label:has-text("Title Alignment") + .data')
          .getByRole('radio', { name: alignment }),
    titleBackgroundColorPicker: (page: Page): Locator =>
      propertiesPopover(page).locator(
        '.label:has-text("Title Background Color") + .data .k-colorpicker .k-picker-wrap'
      ),
    dashboardLink: (page: Page): Locator =>
      propertiesPopover(page).locator('.label:has-text("Dashboard Link") + .text'),
    statusSwitch: (page: Page): Locator =>
      propertiesPopover(page).locator('.label:has-text("Status") + .data').getByRole('switch'),
    statusToggle: (page: Page): Locator =>
      propertiesPopover(page).locator('.label:has-text("Status") + .data').locator('span').nth(3),
    containersSelector: (page: Page): Locator =>
      propertiesPopover(page).locator('.label:has-text("Container(s)") + .data'),
    applyButton: (page: Page): Locator => propertiesPopover(page).getByRole('link', { name: 'Apply' }),
    cancelButton: (page: Page): Locator => propertiesPopover(page).getByRole('link', { name: 'Cancel' }),
  },

  permissionsModal: {
    modal: (page: Page): Locator => permissionsPopover(page),
    permissionsSelector: (page: Page): Locator =>
      permissionsPopover(page).locator('.label:has-text("Dashboard Permissions") + .data').getByRole('listbox'),
    usersSelector: (page: Page): Locator => permissionsPopover(page).locator('.label:has-text("Users") + .data'),
    groupsSelector: (page: Page): Locator => permissionsPopover(page).locator('.label:has-text("Groups") + .data'),
    rolesSelector: (page: Page): Locator => permissionsPopover(page).locator('.label:has-text("Roles") + .data'),
    applyButton: (page: Page): Locator => permissionsPopover(page).getByRole('link', { name: 'Apply' }),
    cancelButton: (page: Page): Locator => permissionsPopover(page).getByRole('link', { name: 'Cancel' }),
  },

  scheduleModal: {
    modal: (page: Page): Locator => scheduleModal(page),
    scheduleSwitch: (page: Page): Locator =>
      scheduleModal(page).locator('.label:has-text("Schedule") + .data').getByRole('switch'),
    scheduleToggle: (page: Page): Locator =>
      scheduleModal(page).locator('.label:has-text("Schedule") + .data').locator('span').nth(3),
    frequencySelector: (page: Page): Locator =>
      scheduleModal(page).locator('.label:has-text("Send") + .data').getByRole('listbox'),
    startingOnDate: (page: Page): Locator =>
      scheduleModal(page).locator('.label:has-text("Starting On") + .data .k-datetimepicker'),
    endingOnDate: (page: Page): Locator =>
      scheduleModal(page).locator('.label:has-text("Ending On") + .data .k-datetimepicker'),
    defaultFilteringCheckbox: (page: Page): Locator =>
      scheduleModal(page).locator('.label:has-text("Default Filtering") + .text').getByRole('checkbox'),
    contentSelector: (page: Page): Locator =>
      scheduleModal(page).locator('.label:has-text("Content") + .data').getByRole('listbox'),
    paperSizeSelector: (page: Page): Locator =>
      scheduleModal(page).locator('.label:has-text("Paper Size") + .data').getByRole('listbox'),
    marginsInput: (page: Page): Locator =>
      scheduleModal(page).locator('.label:has-text("Margins") + .data input:visible'),
    includeFooterCheckbox: (page: Page): Locator =>
      scheduleModal(page).locator('.label:has-text("Include Footer") + .data').getByRole('checkbox'),
    orientationSelector: (page: Page): Locator =>
      scheduleModal(page).locator('.label:has-text("Orientation") + .data').getByRole('listbox'),
    scaleInput: (page: Page): Locator => scheduleModal(page).locator('.label:has-text("Scale") + .data input:visible'),
    specificUsersSelector: (page: Page): Locator =>
      scheduleModal(page).locator('.label:has-text("Specific Users") + .data .onx-selector'),
    specificGroupsSelector: (page: Page): Locator =>
      scheduleModal(page).locator('.label:has-text("Specific Groups") + .data .onx-selector'),
    fromNameInput: (page: Page): Locator => scheduleModal(page).getByLabel('From Name'),
    fromAddressContainer: (page: Page): Locator => scheduleModal(page).locator('.from-email-container'),
    subjectInput: (page: Page): Locator => scheduleModal(page).getByLabel('Subject'),
    bodyEditor: (page: Page): Locator => scheduleModal(page).locator('.content-area.mce-content-body:visible'),
    saveButton: (page: Page): Locator => scheduleModal(page).getByRole('button', { name: 'Save' }),
    cancelButton: (page: Page): Locator => scheduleModal(page).getByRole('button', { name: 'Cancel' }),
  },

  resources: {
    tabButton:
      (tabName: 'Reports' | 'Key Metrics' | 'Layouts' | 'Objects'): Target =>
      (page: Page): Locator =>
        designerFrame(page).locator('.item-container').first().locator('#tabstrip-container').getByRole('tab', {
          name: tabName,
        }),
    itemInBank:
      (bankName: 'report' | 'object' | 'keymetric', itemName: string): Target =>
      (page: Page): Locator =>
        designerFrame(page)
          .locator(`[data-tab-content="${bankName}"]`)
          .locator('div.layoutItem')
          .filter({ hasText: itemName })
          .first(),
  },

  canvas: {
    layoutSection: (page: Page): Locator =>
      designerFrame(page).locator('.canvas-section').first().locator('.mainContainer .section'),
    renderedItems: (page: Page): Locator =>
      designerFrame(page).locator('.canvas-section').first().locator('.mainContainer .section .rendered-item'),
    dropzoneAt:
      (column: number, row: number): Target =>
      (page: Page): Locator =>
        designerFrame(page)
          .locator('.canvas-section')
          .first()
          .locator(`.mainContainer .section .rendered-item[data-column="${column}"][data-row="${row}"]`)
          .first(),
    dropLocation: (page: Page): Locator =>
      designerFrame(page).locator('.canvas-section').first().locator('#dropLocation'),
  },
};
