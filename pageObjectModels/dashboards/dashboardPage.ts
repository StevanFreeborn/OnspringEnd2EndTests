import { Locator, Page } from '@playwright/test';
import { ExportUnderwayDialog } from '../../componentObjectModels/dialogs/reportExportUnderwayDialog';
import { DashboardActionMenu } from '../../componentObjectModels/menus/dashboardActionMenu';
import { AddOrEditDashboardFilterModal } from '../../componentObjectModels/modals/addOrEditDashboardFilterModal';
import { DashboardDesignerModal } from '../../componentObjectModels/modals/dashboardDesignerModal';
import { DashboardLinkModal } from '../../componentObjectModels/modals/dashboardLinkModal';
import { ExportDashboardModal } from '../../componentObjectModels/modals/exportDashboardModal';
import { PrintDashboardModal } from '../../componentObjectModels/modals/printDashboardModal';
import { DashboardFilter } from '../../models/dashboardFilter';
import { DashboardFilterCriteria, TextDashboardFilterCriteria } from '../../models/dashboardFilterCriteria';
import { BasePage } from '../basePage';

export class DashboardPage extends BasePage {
  private readonly actionMenuButton: Locator;
  private readonly actionMenu: DashboardActionMenu;
  private readonly dashboardContents: Locator;
  private readonly addDashboardFilterButton: Locator;
  private readonly addOrEditDashboardFilterModal: AddOrEditDashboardFilterModal;
  private readonly moveFilterPathRegex: RegExp;
  private readonly saveFilterDefaultsPathRegex: RegExp;
  readonly path: string;
  readonly dashboardDesigner: DashboardDesignerModal;
  readonly printDashboardModal: PrintDashboardModal;
  readonly exportDashboardModal: ExportDashboardModal;
  readonly exportUnderwayDialog: ExportUnderwayDialog;
  readonly dashboardLinkModal: DashboardLinkModal;
  readonly dashboardBreadcrumbTitle: Locator;
  readonly dashboardTitle: Locator;
  readonly dashboardFilterBar: Locator;

  constructor(page: Page) {
    super(page);
    this.path = '/Dashboard';
    this.moveFilterPathRegex = /\/DashboardFilter\/\d+\/Move/;
    this.saveFilterDefaultsPathRegex = /\/DashboardFilter\/\d+\/SaveAsDashboardDefault/;
    this.actionMenuButton = this.page.locator('#breadcrumb-action-menu-button');
    this.actionMenu = new DashboardActionMenu(this.page.locator('#dashboard-action-menu'));
    this.dashboardDesigner = new DashboardDesignerModal(this.page);
    this.printDashboardModal = new PrintDashboardModal(this.page);
    this.exportDashboardModal = new ExportDashboardModal(this.page);
    this.exportUnderwayDialog = new ExportUnderwayDialog(this.page);
    this.dashboardLinkModal = new DashboardLinkModal(this.page);
    this.dashboardFilterBar = this.page.locator('[data-dashboard-filters]');
    this.addDashboardFilterButton = this.dashboardFilterBar.getByTitle('Add Dashboard Filter');
    this.addOrEditDashboardFilterModal = new AddOrEditDashboardFilterModal(this.page);
    this.dashboardBreadcrumbTitle = this.page.locator('#dashboard-breadcrumbs .bcrumb-end');
    this.dashboardTitle = this.page.locator('#dashboard-title-container');
    this.dashboardContents = this.page.locator('#dashboard-contents');
  }

  async goto(dashboardId?: number) {
    const path = dashboardId ? `${this.path}/${dashboardId}` : this.path;
    await this.page.goto(path);
    await this.copyrightPatentInfo.waitFor({ state: 'hidden' });
  }

  async openDashboardDesigner() {
    await this.actionMenuButton.click();
    await this.actionMenu.editDashboardLink.click();
    await this.dashboardDesigner.waitFor();
  }

  async printDashboard() {
    await this.actionMenuButton.click();
    await this.actionMenu.printDashboardLink.click();
    await this.printDashboardModal.waitFor();
    await this.printDashboardModal.okButton.click();
  }

  async exportDashboard() {
    await this.actionMenuButton.click();
    await this.actionMenu.exportDashboardLink.click();

    await this.exportDashboardModal.okButton.click();

    await this.exportUnderwayDialog.waitFor();
    await this.exportUnderwayDialog.close();
  }

  async getDashboardLink() {
    await this.actionMenuButton.click();
    await this.actionMenu.getDashboardUrlLink.click();

    await this.dashboardLinkModal.waitFor();

    const linkLocator = await this.dashboardLinkModal.getLink();
    const textWithLink = await linkLocator.textContent();
    const link = textWithLink?.match(/https:\/\/.*\/Dashboard\/\d+/);

    if (link === null || link === undefined) {
      throw new Error('Link not found');
    }

    return link[0];
  }

  getDashboardItem(name: string) {
    return this.dashboardContents.locator('.dashboard-item', { has: this.page.locator(`.title:has-text("${name}")`) });
  }

  async toggleDashboardFilters() {
    await this.actionMenuButton.click();
    await this.actionMenu.toggleDashboardFilteringLink.click();
  }

  async addDashboardFilter(filter: DashboardFilter) {
    await this.addDashboardFilterButton.click();
    await this.addOrEditDashboardFilterModal.fillOutForm(filter);
    await this.addOrEditDashboardFilterModal.save();
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(2_000);
  }

  getDashboardFilterByLabel(label: string) {
    return this.dashboardFilterBar.locator('.dashboard-filter', {
      has: this.page.locator(`.dashboard-filter-label:has-text("${label}")`),
    });
  }

  async editDashboardFilterByLabel(label: string, filter: DashboardFilter) {
    const filterLocator = this.getDashboardFilterByLabel(label);
    const menuButton = filterLocator.locator('.dashboard-filter-menu');

    await menuButton.click();

    const editButton = filterLocator.getByText('Edit');

    await editButton.click();
    await this.addOrEditDashboardFilterModal.fillOutForm(filter);
    await this.addOrEditDashboardFilterModal.save();
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(2_000);
  }

  async applyFilterCriteria(filterCriteria: DashboardFilterCriteria) {
    const filterLocator = this.getDashboardFilterByLabel(filterCriteria.filterLabel);
    const filterSelection = filterLocator.locator('.dashboard-filter-selection');

    await filterSelection.click();

    const filterMenu = this.page.locator('.dashboard-filter-container:visible');
    const ruleOperatorSelector = filterMenu.locator('.rule-operator:visible');
    const applyButton = filterMenu.getByRole('button', { name: 'Apply' });

    if (filterCriteria instanceof TextDashboardFilterCriteria) {
      await ruleOperatorSelector.click();
      await this.page.getByRole('option', { name: filterCriteria.operator }).click();
      await applyButton.click();
    }
  }

  async saveFilterCriteriaAsDefault() {
    const response = this.page.waitForResponse(this.saveFilterDefaultsPathRegex);
    await this.dashboardFilterBar.getByTitle('Save Filter Criteria as Dashboard Default').click();
    await response;
  }

  async moveDashboardFilterRight(filterLabel: string) {
    const filterLocator = this.getDashboardFilterByLabel(filterLabel);
    const menuButton = filterLocator.locator('.dashboard-filter-menu');

    await menuButton.click();

    const moveRightButton = filterLocator.getByText('Move Right');

    const moveResponse = this.page.waitForResponse(this.moveFilterPathRegex);
    await moveRightButton.click();
    await moveResponse;
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(2_000);
  }
}
