import { Page } from '../../fixtures';
import { AppSearch } from '../../models/appSearch';
import { DualPaneSelector } from '../controls/dualPaneSelector';
import { AddOrEditDashboardObjectItemModal } from './addOrEditDashboardObjectItemModal';

export class AddOrEditAppSearchObjectModal extends AddOrEditDashboardObjectItemModal {
  private readonly appsSelector: DualPaneSelector;

  constructor(page: Page) {
    super(page);

    this.appsSelector = new DualPaneSelector(this.modal.locator('.label:has-text("Apps") + .data .onx-selector'));
  }

  async fillOutForm(appSearch: AppSearch) {
    await this.fillOutGeneralTab(appSearch);
    await this.appsSelector.selectOptions(appSearch.apps);

    await this.fillOutSecurityTab(appSearch);
  }
}
