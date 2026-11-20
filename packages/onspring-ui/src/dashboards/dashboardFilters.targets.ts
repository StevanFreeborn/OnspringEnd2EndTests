import { Locator, Page } from '@playwright/test';
import { Target } from '@stevanfreeborn/screenplay-playwright';

const filterBar = (page: Page): Locator => page.locator('[data-dashboard-filters]');
const filterModal = (page: Page): Locator => page.getByRole('dialog', { name: /(Add|Edit) Dashboard Filter/ });
const filterByLabel = (page: Page, label: string): Locator =>
  filterBar(page).locator('.dashboard-filter', {
    has: page.locator(`.dashboard-filter-label:has-text("${label}")`),
  });

export const DashboardFilterTargets = {
  moveFilterPathRegex: /\/DashboardFilter\/\d+\/Move/,
  saveFilterDefaultsPathRegex: /\/DashboardFilter\/\d+\/SaveAsDashboardDefault/,
  saveEndUserFilterDefaultsPathRegex: /\/DashboardFilter\/\d+\/SaveAsUserDefault/,
  resetDashboardFiltersToDefaultPathRegex: /\/DashboardFilter\/\d+\/Reset/,

  toggleDashboardFilteringLink: (page: Page): Locator =>
    page.locator('#dashboard-action-menu').getByText('Dashboard Filtering'),
  toggleEndUserDefaultsLink: (page: Page): Locator =>
    page.locator('#dashboard-action-menu').getByText('End User Default Saving '),

  filterBar: (page: Page): Locator => filterBar(page),
  addFilterButton: (page: Page): Locator => filterBar(page).getByTitle('Add Dashboard Filter'),
  filterByLabel:
    (label: string): Target =>
    (page: Page): Locator =>
      filterByLabel(page, label),
  filterMenuButton:
    (label: string): Target =>
    (page: Page): Locator =>
      filterByLabel(page, label).locator('.dashboard-filter-menu'),
  filterMenuOption:
    (label: string, option: 'Edit' | 'Delete' | 'Move Right' | 'Move Left'): Target =>
    (page: Page): Locator =>
      filterByLabel(page, label).getByText(option),
  filterSelection:
    (label: string): Target =>
    (page: Page): Locator =>
      filterByLabel(page, label).locator('.dashboard-filter-selection'),

  ruleOperatorSelector: (page: Page): Locator =>
    page.locator('.dashboard-filter-container:visible').locator('.rule-operator:visible'),
  applyCriteriaButton: (page: Page): Locator =>
    page.locator('.dashboard-filter-container:visible').getByRole('button', { name: 'Apply' }),
  pageOptionByName:
    (name: string): Target =>
    (page: Page): Locator =>
      page.getByRole('option', { name }),

  saveAsDefaultButton: (page: Page): Locator => filterBar(page).getByTitle('Save Filter Criteria as Dashboard Default'),
  adminSaveMenuButton: (page: Page): Locator => filterBar(page).locator('.dashboard-filter-admin-save-btn'),
  saveAsDashboardDefaultOption: (page: Page): Locator =>
    filterBar(page).getByText('Save Filter Criteria as Dashboard Default'),
  saveAsMyDefaultOption: (page: Page): Locator => filterBar(page).getByText('Save Filter Criteria as My Default'),
  restoreDefaultButton: (page: Page): Locator =>
    filterBar(page).getByTitle('Restore Dashboard Default Filter Criteria'),

  filterModal: {
    dialog: (page: Page): Locator => filterModal(page),
    filterLabelInput: (page: Page): Locator =>
      filterModal(page).locator('.label:has-text("Filter Label") + .data').getByRole('textbox'),
    dataTypeSelector: (page: Page): Locator =>
      filterModal(page).locator('.label:has-text("Data Type") + .data').getByRole('listbox'),
    referencedAppSelector: (page: Page): Locator =>
      filterModal(page).locator('.label:has-text("Referenced App") + .data').getByRole('listbox'),
    fieldMappingSelectorForObject:
      (dashboardObject: string): Target =>
      (page: Page): Locator =>
        filterModal(page)
          .locator('#FilterFieldMappingGrid')
          .getByRole('row', { name: dashboardObject })
          .locator('td')
          .nth(1),
    saveButton: (page: Page): Locator => filterModal(page).getByRole('button', { name: 'Save' }),
  },
};
