import { Page } from '@playwright/test';
import { Target } from '@stevanfreeborn/screenplay-playwright';

const layoutObjectDialog = (page: Page) => page.locator('.ajax-form-dialog').first();

export const LayoutObjectTargets = {
  addOrEditPathRegex: /\/Admin\/App\/\d+\/LayoutObject\/(Add(Text|Label)Object|\d+\/Edit(Text|Label)Object)/,

  modal: {
    dialog: layoutObjectDialog,
    generalSettingsTabButton: (page: Page) => layoutObjectDialog(page).getByRole('tab', { name: 'General Settings' }),
    securityTabButton: (page: Page) => layoutObjectDialog(page).getByRole('tab', { name: 'Security' }),
    usageTabButton: (page: Page) => layoutObjectDialog(page).getByRole('tab', { name: 'Usage' }),
    nameInput: (page: Page) => layoutObjectDialog(page).getByLabel('Name'),
    contentEditor: (page: Page) => layoutObjectDialog(page).locator('.content-area.mce-content-body'),
    securityViewSelect: (page: Page) =>
      layoutObjectDialog(page).getByRole('listbox', { name: 'Administration Permissions' }),
    securityOption:
      (optionName: 'Public' | 'Role-Based'): Target =>
      (page: Page) =>
        page.getByRole('option', { name: optionName }),
    roleSelector: (page: Page) => layoutObjectDialog(page).locator('.onx-selector').first(),
    saveButton: (page: Page) => page.getByRole('button', { name: 'Save', exact: true }).last(),
  },
};
