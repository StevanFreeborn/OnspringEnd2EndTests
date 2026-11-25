import { Locator, Page } from '@playwright/test';

const outcomeModal = (page: Page): Locator => page.getByRole('dialog', { name: /outcome/i });

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
};
