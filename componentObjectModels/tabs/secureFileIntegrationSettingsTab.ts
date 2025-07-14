import { Locator, Page } from '../../fixtures';
import { SecureFileDataConnector } from '../../models/secureFileDataConnector';
import { DualPaneSelector } from '../controls/dualPaneSelector';

export class SecureFileIntegrationSettingsTab {
  private readonly recordHandlingSelector: Locator;
  private readonly sourceMatchFieldSelector: Locator;
  private readonly appMatchFieldSelector: Locator;
  private readonly messagingSelector: Locator;
  private readonly workflowSelector: Locator;
  private readonly fieldsToDefaultDualPaneSelector: DualPaneSelector;

  constructor(page: Page) {
    this.recordHandlingSelector = page.locator('.label:has-text("Record Handling") + .data').getByRole('listbox');
    this.sourceMatchFieldSelector = page.locator('.label:has-text("Source Match Field") + .data').getByRole('listbox');
    this.appMatchFieldSelector = page.locator('.label:has-text("App Match Field") + .data').getByRole('listbox');
    this.messagingSelector = page.locator('.label:has-text("Messaging") + .data').getByRole('listbox');
    this.workflowSelector = page.locator('.label:has-text("Workflow") + .data').getByRole('listbox');
    this.fieldsToDefaultDualPaneSelector = new DualPaneSelector(
      page.locator('.label:has-text("Fields To Default") + .data .onx-selector')
    );
  }

  private async selectRecordHandlingOption(option: string) {
    await this.recordHandlingSelector.click();
    await this.recordHandlingSelector.page().getByRole('option', { name: option }).click();
  }

  private async selectFileMatchFieldOption(option: string) {
    await this.sourceMatchFieldSelector.click();
    await this.sourceMatchFieldSelector.page().getByRole('option', { name: option }).click();
  }

  private async selectAppMatchFieldOption(option: string) {
    await this.appMatchFieldSelector.click();
    await this.appMatchFieldSelector.page().getByRole('option', { name: option }).click();
  }

  private async selectMessagingOption(option: string) {
    await this.messagingSelector.click();
    await this.messagingSelector.page().getByRole('option', { name: option }).click();
  }

  private async selectWorkflowOption(option: string) {
    await this.workflowSelector.click();
    await this.workflowSelector.page().getByRole('option', { name: option }).click();
  }

  async fillOutForm(dataConnector: SecureFileDataConnector) {
    await this.selectRecordHandlingOption(dataConnector.recordHandling.type);

    if (dataConnector.recordHandling.type !== 'Add new content for each record in the file') {
      await this.selectFileMatchFieldOption(dataConnector.recordHandling.sourceMatchField);
      await this.selectAppMatchFieldOption(dataConnector.recordHandling.appMatchField);
    }

    if (dataConnector.recordHandling.type === 'Update content that matches and add new content') {
      await this.selectWorkflowOption(dataConnector.recordHandling.workflow);
    }

    await this.selectMessagingOption(dataConnector.messaging);
    await this.fieldsToDefaultDualPaneSelector.selectOptions(dataConnector.fieldsToDefault);
  }
}
