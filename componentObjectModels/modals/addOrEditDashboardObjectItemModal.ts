import { Locator, Page } from "@playwright/test";
import { DualPaneSelector } from "../controls/dualPaneSelector";
import { DashboardObjectItem } from "../../models/dashboardObjectItem";

export abstract class AddOrEditDashboardObjectItemModal {
  private readonly viewSelector: Locator;
  private readonly saveButton: Locator;
  protected readonly modal: Locator;
  protected readonly generalTabButton: Locator;
  protected readonly nameInput: Locator;
  protected readonly hideHeaderCheckbox: Locator;
  protected readonly hideContainerCheckbox: Locator;
  protected readonly securityTabButton: Locator;
  protected readonly rolesSelector: DualPaneSelector;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: /Object/ });
    this.generalTabButton = this.modal.getByRole('tab', { name: 'General' });
    this.nameInput = this.modal.locator('.label:has-text("Name") + .data').getByRole('textbox');
    this.hideHeaderCheckbox = this.modal.getByRole('checkbox', { name: 'Hide object header' });
    this.hideContainerCheckbox = this.modal.getByRole('checkbox', { name: 'Hide object container' });
    this.securityTabButton = this.modal.getByRole('tab', { name: 'Security' });
    this.viewSelector = this.modal.locator('.label:has-text("View") + .data').getByRole('listbox');
    this.rolesSelector = new DualPaneSelector(this.modal.locator('.label:has-text("Roles") + .data .onx-selector'));
    this.saveButton = this.modal.getByRole('button', { name: 'Save' });
  }

  private async selectView(view: string) {
    await this.viewSelector.click();
    await this.viewSelector.page().getByRole('option', { name: view }).click();
  }

  protected async fillOutGeneralTab(dashboardObjectItem: DashboardObjectItem) {
    await this.generalTabButton.click();
    await this.nameInput.fill(dashboardObjectItem.name);
    await this.hideHeaderCheckbox.setChecked(dashboardObjectItem.hideHeader);
    await this.hideContainerCheckbox.setChecked(dashboardObjectItem.hideContainer);
  }

  protected async fillOutSecurityTab(dashboardObjectItem: DashboardObjectItem) {
    await this.securityTabButton.click();
    await this.selectView(dashboardObjectItem.view);

    if (dashboardObjectItem.view === 'Private by Role') {
      await this.rolesSelector.selectOptions(dashboardObjectItem.roles);
    }
  }

  abstract fillOutForm(dashboardObjectItem: DashboardObjectItem): Promise<void>;

  async save() {
    await this.saveButton.click();
    await this.modal.waitFor({ state: 'hidden' });
  }
}
