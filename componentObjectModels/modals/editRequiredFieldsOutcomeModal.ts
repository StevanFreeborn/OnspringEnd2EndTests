import { Page } from '@playwright/test';
import { RequiredFieldsOutcome } from '../../models/requiredFieldsOutcome';
import { DualPaneSelector } from '../controls/dualPaneSelector';
import { EditOutcomeModal } from './editOutcomeModal';

export class EditRequiredFieldsOutcomeModal extends EditOutcomeModal {
  private readonly requiredFieldsDualPaneSelector: DualPaneSelector;

  constructor(page: Page) {
    super(page);
    this.requiredFieldsDualPaneSelector = new DualPaneSelector(
      this.modal.locator('.label:has-text("Required Fields") + .data .onx-selector')
    );
  }

  async fillOutForm(outcome: RequiredFieldsOutcome) {
    await super.fillOutForm(outcome);
    await this.requiredFieldsDualPaneSelector.selectOptions(outcome.requiredFields);
  }
}
