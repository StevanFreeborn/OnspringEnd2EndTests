import { Locator, Page } from '@playwright/test';
import { DataConnector } from '../../models/dataConnector';
import { DateFieldControl } from '../controls/dateFieldControl';
import { DualPaneSelector } from '../controls/dualPaneSelector';

export abstract class SchedulingTab {
  protected readonly page: Page;
  protected readonly startingOnDate: DateFieldControl;
  protected readonly endingOnDate: DateFieldControl;
  private readonly frequencySelector: Locator;
  protected readonly notificationGroupsDualPaneSelector: DualPaneSelector;
  protected readonly notificationUsersDualPaneSelector: DualPaneSelector;
  private readonly messageCenterSettingsSelector: Locator;

  constructor(page: Page) {
    this.page = page;

    const startingOn = this.page.locator('.label:has-text("Starting On") + .data .k-datetimepicker');
    this.startingOnDate = new DateFieldControl(startingOn);

    const endingOn = this.page.locator('.label:has-text("Ending On") + .data .k-datetimepicker');
    this.endingOnDate = new DateFieldControl(endingOn);

    this.frequencySelector = this.page.locator('.label:has-text("Frequency") + .data').getByRole('listbox');

    const notificationGroups = this.page.locator('.label:has-text("Notification Groups") + .data .onx-selector');
    this.notificationGroupsDualPaneSelector = new DualPaneSelector(notificationGroups);

    const notificationUsers = this.page.locator('.label:has-text("Notification Users") + .data .onx-selector');
    this.notificationUsersDualPaneSelector = new DualPaneSelector(notificationUsers);

    this.messageCenterSettingsSelector = this.page
      .locator('.label:has-text("Message Center Settings") + .data')
      .getByRole('listbox');
  }

  protected async selectFrequencyOption(option: string) {
    await this.frequencySelector.click();
    await this.frequencySelector.page().getByRole('option', { name: option }).click();
  }

  protected async selectMessageCenterSettings(option: string) {
    await this.messageCenterSettingsSelector.click();
    await this.messageCenterSettingsSelector.page().getByRole('option', { name: option }).click();
  }

  abstract fillOutForm(dataConnector: DataConnector): Promise<void>;
}
