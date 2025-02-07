import { Locator, Page } from "@playwright/test";
import { WaitForOptions } from "../../utils";

export class ViewVersionHistoryModal {
  private readonly _modal: Locator;

  modal() {
    return this._modal;
  }

  constructor(page: Page) {
    this._modal = page.getByRole("dialog", { name: "Version History" });
  }

  async waitFor(options?: WaitForOptions) {
    await this._modal.waitFor(options);
  }
}
