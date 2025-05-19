import { Locator, Page } from "@playwright/test";
import { DashboardFormattedTextBlock } from "../../models/dashboardFormattedTextBlock";
import { AddOrEditDashboardObjectItemModal } from "./addOrEditDashboardObjectItemModal";

export class AddOrEditFormattedTextBlockObjectModal extends AddOrEditDashboardObjectItemModal {
  private readonly formattedTextEditor: Locator;

  constructor(page: Page) {
    super(page);
    
    this.formattedTextEditor = this.modal.locator('.content-area.mce-content-body');
  }

  async fillOutForm(formattedTextBlock: DashboardFormattedTextBlock) {
    await this.fillOutGeneralTab(formattedTextBlock);
    await this.formattedTextEditor.fill(formattedTextBlock.formattedText);

    await this.fillOutSecurityTab(formattedTextBlock);
  }
}


