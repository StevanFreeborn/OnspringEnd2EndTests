import { Locator, Page } from '@playwright/test';
import { EditOutcomeModal } from './editOutcomeModal';
import { RestApiOutcome } from '../../models/restApiOutcome';
import { RestApiRequestTab } from '../tabs/restApiRequestTab';
import { RestApiNotificationsTab } from '../tabs/restApiNotificationsTab';
import { RestApiSettingsTab } from '../tabs/restApiSettingsTab';

export class EditRestApiOutcomeModal extends EditOutcomeModal {
  private readonly restApiSettingsTabButton: Locator;
  private readonly notificationsTabButton: Locator;
  private readonly requestTabButton: Locator;
  private readonly restApiSettingsTab: RestApiSettingsTab;
  private readonly restApiNotificationsTab: RestApiNotificationsTab;
  private readonly restApiRequestTab: RestApiRequestTab;

  constructor(page: Page) {
    super(page);

    this.restApiSettingsTabButton = this.modal.getByRole('tab', { name: 'REST API Settings' });
    this.notificationsTabButton = this.modal.getByRole('tab', { name: 'Notifications' });
    this.requestTabButton = this.modal.getByRole('tab', { name: 'Request' });
    this.restApiSettingsTab = new RestApiSettingsTab(this.modal);
    this.restApiNotificationsTab = new RestApiNotificationsTab(this.modal);
    this.restApiRequestTab = new RestApiRequestTab(this.modal);
  }

  async fillOutForm(outcome: RestApiOutcome) {
    await super.fillOutForm(outcome);

    await this.restApiSettingsTabButton.click();
    await this.restApiSettingsTab.fillOutForm(outcome);

    await this.notificationsTabButton.click();
    await this.restApiNotificationsTab.fillOutForm(outcome);

    await this.requestTabButton.click();
    await this.restApiRequestTab.fillOutForm(outcome);
  }
}
