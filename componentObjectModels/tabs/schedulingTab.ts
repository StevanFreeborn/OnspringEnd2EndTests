import { Locator, Page } from '@playwright/test';
import { DataConnector } from '../../models/dataConnector';
import { DateFieldControl } from '../controls/dateFieldControl';
import { DualPaneSelector } from '../controls/dualPaneSelector';

export abstract class SchedulingTab {
  protected readonly startingOnDate: DateFieldControl;
  protected readonly endingOnDate: DateFieldControl;
  private readonly frequencySelector: Locator;
  protected readonly notificationGroupsDualPaneSelector: DualPaneSelector;
  protected readonly notificationUsersDualPaneSelector: DualPaneSelector;

  constructor(page: Page) {
    const startingOn = page.locator('.label:has-text("Starting On") + .data .k-datetimepicker');
    this.startingOnDate = new DateFieldControl(startingOn);

    const endingOn = page.locator('.label:has-text("Ending On") + .data .k-datetimepicker');
    this.endingOnDate = new DateFieldControl(endingOn);

    this.frequencySelector = page.locator('.label:has-text("Frequency") + .data').getByRole('listbox');

    const notificationGroups = page.locator('.label:has-text("Notification Groups") + .data .onx-selector');
    this.notificationGroupsDualPaneSelector = new DualPaneSelector(notificationGroups);

    const notificationUsers = page.locator('.label:has-text("Notification Users") + .data .onx-selector');
    this.notificationUsersDualPaneSelector = new DualPaneSelector(notificationUsers);
  }

  protected async selectFrequencyOption(option: string) {
    await this.frequencySelector.click();
    await this.frequencySelector.page().getByRole('option', { name: option }).click();
  }

  abstract fillOutForm(dataConnector: DataConnector): Promise<void>;
}
