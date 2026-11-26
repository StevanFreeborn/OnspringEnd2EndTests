import { Locator, Page } from '@playwright/test';
import { DashboardObjectItem } from '@stevanfreeborn/onspring-models';
import { Target } from '@stevanfreeborn/screenplay-playwright';

const designerFrame = (page: Page) => page.frameLocator('.dialog');
const objectModal = (page: Page): Locator => page.getByRole('dialog', { name: /Object/ });
const objectInBank = (page: Page, name: string): Locator =>
  designerFrame(page).locator('[data-tab-content="object"] div.layoutItem').filter({ hasText: name }).first();
const lastObjectInBank = (page: Page, name: string | RegExp): Locator =>
  designerFrame(page).locator('[data-tab-content="object"] div.layoutItem').filter({ hasText: name }).last();
const linksGridRows = (page: Page): Locator =>
  objectModal(page).locator('.label:has-text("Links") + .data .k-grid-content tr');

export const DashboardObjectTargets = {
  deletePathRegex: /\/Admin\/Dashboard\/DashboardObject\/\d+\/Delete/,
  addObjectButton: (page: Page): Locator =>
    designerFrame(page).locator('.item-container').first().getByTitle('Add Object'),
  addObjectMenu: (page: Page): Locator => designerFrame(page).locator('[data-add-menu="object"]'),
  addObjectMenuOption:
    (objectType: DashboardObjectItem['type']): Target =>
    (page: Page): Locator =>
      designerFrame(page).locator('[data-add-menu="object"]').getByText(objectType),
  editObjectButtonInBank:
    (name: string): Target =>
    (page: Page): Locator =>
      objectInBank(page, name).getByTitle('Edit Object Properties'),
  deleteObjectButtonInBank:
    (name: string): Target =>
    (page: Page): Locator =>
      objectInBank(page, name).getByTitle('Delete Object'),
  deleteLastObjectButtonInBank:
    (name: string | RegExp): Target =>
    (page: Page): Locator =>
      lastObjectInBank(page, name).getByTitle('Delete Object'),

  modal: {
    dialog: (page: Page): Locator => objectModal(page),
    generalTabButton: (page: Page): Locator => objectModal(page).getByRole('tab', { name: 'General' }),
    nameInput: (page: Page): Locator =>
      objectModal(page).locator('.label:has-text("Name") + .data').getByRole('textbox'),
    hideHeaderCheckbox: (page: Page): Locator =>
      objectModal(page).getByRole('checkbox', { name: 'Hide object header' }),
    hideContainerCheckbox: (page: Page): Locator =>
      objectModal(page).getByRole('checkbox', { name: 'Hide object container' }),
    securityTabButton: (page: Page): Locator => objectModal(page).getByRole('tab', { name: 'Security' }),
    viewSelector: (page: Page): Locator =>
      objectModal(page).locator('.label:has-text("View") + .data').getByRole('listbox'),
    rolesSelector: (page: Page): Locator => objectModal(page).locator('.label:has-text("Roles") + .data .onx-selector'),
    saveButton: (page: Page): Locator => objectModal(page).getByRole('button', { name: 'Save' }),
    pageOptionByName:
      (name: string): Target =>
      (page: Page): Locator =>
        page.getByRole('option', { name }),

    appsSelector: (page: Page): Locator => objectModal(page).locator('.label:has-text("Apps") + .data .onx-selector'),

    addLinkButton: (page: Page): Locator => objectModal(page).getByRole('button', { name: 'Add a Link' }),
    linkRows: (page: Page): Locator => linksGridRows(page),
    linkRowAt:
      (index: number): Target =>
      (page: Page): Locator =>
        linksGridRows(page).nth(index),
    linkRowDeleteButtonAt:
      (index: number): Target =>
      (page: Page): Locator =>
        linksGridRows(page).nth(index).getByTitle('Delete'),
    lastLinkRowAppSelector: (page: Page): Locator =>
      linksGridRows(page).last().locator('td').nth(1).getByRole('listbox'),
    lastLinkRowImageSourceSelector: (page: Page): Locator =>
      linksGridRows(page).last().locator('td').nth(2).getByRole('listbox'),
    lastLinkRowLinkTextInput: (page: Page): Locator =>
      linksGridRows(page).last().locator('td').nth(4).getByRole('textbox'),

    formattedTextEditor: (page: Page): Locator => objectModal(page).locator('.content-area.mce-content-body'),

    urlInput: (page: Page): Locator => objectModal(page).locator('.label:has-text("URL") + .data').getByRole('textbox'),
    forceRefreshCheckbox: (page: Page): Locator =>
      objectModal(page).getByRole('checkbox', {
        name: 'Automatically refresh the content of the web page every 60 seconds',
      }),
  },
};
