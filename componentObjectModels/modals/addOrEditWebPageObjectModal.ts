import { Locator, Page } from '@playwright/test';
import { WebPage } from '../../models/webPage';
import { AddOrEditDashboardObjectItemModal } from './addOrEditDashboardObjectItemModal';

export class AddOrEditWebPageObjectModal extends AddOrEditDashboardObjectItemModal {
  private readonly urlInput: Locator;
  private readonly forceRefreshCheckbox: Locator;

  constructor(page: Page) {
    super(page);

    this.urlInput = this.modal.locator('.label:has-text("URL") + .data').getByRole('textbox');
    this.forceRefreshCheckbox = this.modal.getByRole('checkbox', {
      name: 'Automatically refresh the content of the web page every 60 seconds',
    });
  }

  async fillOutForm(webPage: WebPage) {
    await this.fillOutGeneralTab(webPage);
    await this.urlInput.fill(webPage.url);
    await this.forceRefreshCheckbox.setChecked(webPage.forceRefresh);

    await this.fillOutSecurityTab(webPage);
  }
}
