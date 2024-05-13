import { Locator, Page } from '@playwright/test';
import {
  SetReferenceConfig,
  SetReferenceOutcome,
  SetSpecificSingleReferenceConfig,
} from '../../models/setReferenceOutcome';
import { EditOutcomeModal } from './editOutcomeModal';

export class EditSetReferenceOutcomeModal extends EditOutcomeModal {
  private readonly configurationContainer: Locator;
  private readonly fieldSelector: Locator;
  private readonly methodSelector: Locator;
  private readonly valueSelector: Locator;

  constructor(page: Page) {
    super(page);
    this.configurationContainer = this.modal.locator('#setReferenceOutcome_Outcomes');
    this.fieldSelector = this.configurationContainer.locator('.label:has-text("Field") + .data').getByRole('listbox');
    this.methodSelector = this.configurationContainer.locator('.label:has-text("Method") + .data').getByRole('listbox');
    this.valueSelector = this.configurationContainer.locator('.label:has-text("Value") + .data').getByRole('listbox');
  }

  private async addSetReferenceConfig(config: SetReferenceConfig) {
    const page = this.modal.page();

    if (config instanceof SetSpecificSingleReferenceConfig) {
      await this.fieldSelector.click();
      await page.getByRole('option', { name: config.fieldName }).click();

      await this.methodSelector.click();
      await page.getByRole('option', { name: config.method }).click();

      await this.valueSelector.click();
      await page.getByRole('option', { name: config.value }).click();
      return;
    }

    throw new Error(`Unsupported configuration type: ${config.constructor.name}`);
  }

  async fillOutForm(outcome: SetReferenceOutcome) {
    await super.fillOutForm(outcome);
    await this.addSetReferenceConfig(outcome.setReferenceConfig);
  }
}
