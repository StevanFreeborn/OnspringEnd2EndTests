import { Locator, Page } from '@playwright/test';
import { Target } from '@stevanfreeborn/screenplay-playwright';
import { DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';

export const SendingNumberAdminPageTargets = {
  route: '/Admin/TextSendingNumber',
  getListPagePath: '/Admin/TextSendingNumber/GetListPage',
  deletePath: '/Admin/TextSendingNumber/Delete',
  grid: (page: Page): Locator => page.locator('#grid'),
  rowByName:
    (name: string): Target =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).first(),
  deleteButtonInRow:
    (name: string): Target =>
    (page: Page): Locator =>
      page.locator('#grid').getByRole('row', { name }).first().getByTitle('Delete SMS Sending Number'),
};

export const AddSendingNumberPageTargets = {
  route: '/Admin/TextSendingNumber/Add',
  saveButton: (page: Page): Locator => page.getByRole('link', { name: 'Save Changes' }),
  nameInput: (page: Page): Locator => page.getByLabel('Name'),
  descriptionEditor: (page: Page): Locator => page.locator('.content-area.mce-content-body'),
  defaultCheckbox: (page: Page): Locator => page.getByRole('checkbox'),
  smsSendingNumberText: (page: Page): Locator => page.locator('#form-selected-number'),
  requestPhoneNumberLink: (page: Page): Locator => page.getByRole('link', { name: 'Request Phone Number' }),
};

export const RequestNumberDialogTargets = {
  requestNumberPath: '/Admin/TextSendingNumber/RequestNumber',
  dialog: (page: Page): Locator => page.getByRole('dialog', { name: 'Request Phone Number' }),
  countrySelector: (page: Page): Locator =>
    page
      .getByRole('dialog', { name: 'Request Phone Number' })
      .locator('.label:has-text("Country") + .data')
      .getByRole('listbox'),
  digitPatternSelector: (page: Page): Locator =>
    page
      .getByRole('dialog', { name: 'Request Phone Number' })
      .locator('.label:has-text("Digit Pattern") + .data')
      .getByRole('listbox'),
  digitPatternInput: (page: Page): Locator =>
    page
      .getByRole('dialog', { name: 'Request Phone Number' })
      .locator('.label:has-text("Digit Pattern") + .data')
      .getByRole('textbox'),
  findNumberLink: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Request Phone Number' }).getByRole('link', { name: 'Find a Matching Number' }),
  optionByName:
    (name: string): Target =>
    (page: Page): Locator =>
      page.getByRole('option', { name }),
  acceptButton: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Request Phone Number' }).getByRole('button', { name: 'Accept' }),
  cancelButton: (page: Page): Locator =>
    page.getByRole('dialog', { name: 'Request Phone Number' }).getByRole('button', { name: 'Cancel' }),
};

export const EditSendingNumberPageTargets = {
  pathRegex: /\/Admin\/TextSendingNumber\/\d+\/Edit/,
  routeForId: (id: number): string => `/Admin/TextSendingNumber/${id}/Edit`,
  saveButton: (page: Page): Locator => page.getByRole('link', { name: 'Save Changes' }),
  nameInput: (page: Page): Locator => page.getByLabel('Name'),
  descriptionEditor: (page: Page): Locator => page.locator('.content-area.mce-content-body'),
  defaultCheckbox: (page: Page): Locator => page.getByRole('checkbox'),
  smsSendingNumberText: (page: Page): Locator => page.locator('#form-selected-number'),
};

export const DeleteSendingNumberDialogTargets = {
  dialog: DeleteDialogTargets.dialog,
  overlay: DeleteDialogTargets.overlay,
  numberSelector: (page: Page): Locator => DeleteDialogTargets.dialog(page).getByRole('listbox'),
  firstNumberOption: (page: Page): Locator => page.getByRole('option').first(),
  okInput: (page: Page): Locator => DeleteDialogTargets.dialog(page).getByRole('textbox'),
  deleteButton: DeleteDialogTargets.deleteButton,
};
