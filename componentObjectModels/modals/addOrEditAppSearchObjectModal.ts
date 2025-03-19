import { Locator, Page } from "../../fixtures";
import { AppSearch } from "../../models/appSearch";
import { DualPaneSelector } from "../controls/dualPaneSelector";

export class AddOrEditAppSearchObjectModal {
  private readonly modal: Locator;
  private readonly generalTabButton: Locator;
  private readonly nameInput: Locator;
  private readonly appsSelector: DualPaneSelector;
  private readonly hideHeaderCheckbox: Locator;
  private readonly hideContainerCheckbox: Locator;
  private readonly securityTabButton: Locator;
  private readonly viewSelector: Locator;
  private readonly rolesSelector: DualPaneSelector;
  private readonly saveButton: Locator;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: /Add.*Object/ });
    this.generalTabButton = this.modal.getByRole('tab', { name: 'General' });
    this.nameInput = this.modal.locator('.label:has-text("Name") + .data').getByRole('textbox');
    this.appsSelector = new DualPaneSelector(this.modal.locator('.label:has-text("Apps") + .data .onx-selector'));
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

  async fillOutForm(appSearch: AppSearch) {
    await this.generalTabButton.click();
    await this.nameInput.fill(appSearch.name);
    await this.appsSelector.selectOptions(appSearch.apps);
    await this.hideHeaderCheckbox.setChecked(appSearch.hideHeader);
    await this.hideContainerCheckbox.setChecked(appSearch.hideContainer);

    await this.securityTabButton.click();
    await this.selectView(appSearch.view);
    
    if (appSearch.view === 'Private by Role') {
      await this.rolesSelector.selectOptions(appSearch.roles);
    }
  }

  async save() {
    await this.saveButton.click();
    await this.modal.waitFor({ state: 'hidden' });
  }
}
