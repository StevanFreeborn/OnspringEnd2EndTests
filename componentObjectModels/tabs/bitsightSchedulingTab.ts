import { Page } from '@playwright/test';
import { BitsightDataConnector } from '../../models/bitsightDataConnector';
import { SchedulingTab } from './schedulingTab';

export class BitsightSchedulingTab extends SchedulingTab {
  constructor(page: Page) {
    super(page);
  }

  async fillOutForm(dataConnector: BitsightDataConnector) {
    await this.startingOnDate.enterDate(dataConnector.startingOnDate);

    if (dataConnector.endingOnDate) {
      await this.endingOnDate.enterDate(dataConnector.endingOnDate);
    }

    await this.selectFrequencyOption(dataConnector.frequency);

    if (dataConnector.notificationGroups.length > 0) {
      await this.notificationGroupsDualPaneSelector.selectOptions(dataConnector.notificationGroups);
    }

    if (dataConnector.notificationUsers.length > 0) {
      await this.notificationUsersDualPaneSelector.selectOptions(dataConnector.notificationUsers);
    }

    await this.selectMessageCenterSettings(dataConnector.messagingCenterSettings);
  }
}
