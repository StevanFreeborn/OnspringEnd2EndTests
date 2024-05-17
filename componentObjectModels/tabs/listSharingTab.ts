import { Locator, Page } from '@playwright/test';
import { SharedList } from '../../models/sharedList';
import { DualPaneSelector } from '../controls/dualPaneSelector';

export class ListSharingTab {
  private readonly availableToSelector: Locator;
  private readonly selectedAppsDualPaneSelector: DualPaneSelector;

  constructor(page: Page) {
    this.availableToSelector = page.locator('.label:has-text("Available to") + .data');
    this.selectedAppsDualPaneSelector = new DualPaneSelector(
      page.locator('.label:has-text("Selected Apps & Surveys") + .data')
    );
  }

  async fillOutForm(list: SharedList) {
    if (list.appsAvailableTo.length === 0) {
      return;
    }

    await this.availableToSelector.click();
    await this.availableToSelector.page().getByRole('option', { name: 'Selected Apps & Surveys' }).click();
    await this.selectedAppsDualPaneSelector.selectOptions(list.appsAvailableTo);
  }
}
