import { Locator } from '@playwright/test';
import { RestApiOutcome } from '../../models/restApiOutcome';
import { DualPaneSelector } from '../controls/dualPaneSelector';

export class RestApiNotificationsTab {
  private readonly notificationGroupsDualPaneSelector: DualPaneSelector;
  private readonly notificationUsersDualPaneSelector: DualPaneSelector;

  constructor(modal: Locator) {
    this.notificationGroupsDualPaneSelector = new DualPaneSelector(
      modal.locator('.label:has-text("Notification Groups") + .data')
    );
    this.notificationUsersDualPaneSelector = new DualPaneSelector(
      modal.locator('.label:has-text("Notification Users") + .data')
    );
  }

  async fillOutForm(outcome: RestApiOutcome) {
    await this.notificationGroupsDualPaneSelector.selectOptions(outcome.notificationGroups);
    await this.notificationUsersDualPaneSelector.selectOptions(outcome.notificationUsers);
  }
}
