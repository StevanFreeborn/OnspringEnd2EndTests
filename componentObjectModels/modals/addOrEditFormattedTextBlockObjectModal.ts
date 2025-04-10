import { Locator, Page } from "@playwright/test";

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
  }
}


