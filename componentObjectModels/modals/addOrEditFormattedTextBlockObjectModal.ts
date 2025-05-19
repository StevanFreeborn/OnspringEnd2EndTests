import { Locator, Page } from "@playwright/test";
import { DualPaneSelector } from "../controls/dualPaneSelector";
import { DashboardFormattedTextBlock } from "../../models/dashboardFormattedTextBlock";

export class AddOrEditFormattedTextBlockObjectModal {
  private readonly modal: Locator;
  private readonly generalTabButton: Locator;
  private readonly nameInput: Locator;
  private readonly hideHeaderCheckbox: Locator;
  private readonly hideContainerCheckbox: Locator;
  private readonly securityTabButton: Locator;
  private readonly viewSelector: Locator;
  private readonly rolesSelector: DualPaneSelector;
  private readonly saveButton: Locator;
  
  constructor(page: Page) {
    this.modal = page.getByRole("dialog", { name: /Add.*Object/ });
    this.generalTabButton = this.modal.getByRole("tab", { name: "General" });
    this.nameInput = this.modal.locator('.label:has-text("Name") + .data').getByRole("textbox");
    this.hideHeaderCheckbox = this.modal.getByRole("checkbox", { name: "Hide object header" });
    this.hideContainerCheckbox = this.modal.getByRole("checkbox", { name: "Hide object container" });
    this.securityTabButton = this.modal.getByRole("tab", { name: "Security" });
    this.viewSelector = this.modal.locator('.label:has-text("View") + .data').getByRole("listbox");
    this.rolesSelector = new DualPaneSelector(this.modal.locator('.label:has-text("Roles") + .data .onx-selector'));
    this.saveButton = this.modal.getByRole("button", { name: "Save" });
  }

  private async selectView(view: string) {
    await this.viewSelector.click();
    await this.viewSelector.page().getByRole("option", { name: view }).click();
  }

  async fillOutForm(formattedTextBlock: DashboardFormattedTextBlock) {
    await this.generalTabButton.click();
    await this.nameInput.fill(formattedTextBlock.name);
    await this.hideHeaderCheckbox.setChecked(formattedTextBlock.hideHeader);
    await this.hideContainerCheckbox.setChecked(formattedTextBlock.hideContainer);
    await this.securityTabButton.click();
    await this.selectView(formattedTextBlock.view);

    if (formattedTextBlock.view === 'Private by Role') {
      await this.rolesSelector.selectOptions(formattedTextBlock.roles);
    }
  }

  async save() {
    await this.saveButton.click();
    await this.modal.waitFor({ state: "hidden" });
  }
}


