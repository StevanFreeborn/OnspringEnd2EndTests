import { Locator, Page } from '../../fixtures';
import { SecureFileDataConnector } from '../../models/secureFileDataConnector';
import { DualPaneSelector } from '../controls/dualPaneSelector';
import { SchedulingTab } from './schedulingTab';

export class SecureFileSchedulingTab extends SchedulingTab {
  private readonly queueParentCheckbox: Locator;
  private readonly childrenDualPaneSelector: DualPaneSelector;

  constructor(page: Page) {
    super(page);
    this.queueParentCheckbox = this.page.getByRole('checkbox', {
      name: 'Enable connector queue. (Make this the parent connector in the processing queue.)',
    });
    this.childrenDualPaneSelector = new DualPaneSelector(
      this.page.locator('.label:has-text("Queue Children") + .data .onx-selector')
    );
  }

  async fillOutForm(dataConnector: SecureFileDataConnector) {
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

    if (dataConnector.childConnectors.length > 0) {
      await this.queueParentCheckbox.check();
      await this.childrenDualPaneSelector.selectOptions(dataConnector.childConnectors);
    }

    await this.selectMessageCenterSettings(dataConnector.messagingCenterSettings);
  }
}
