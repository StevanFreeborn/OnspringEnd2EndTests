import { Page } from '@playwright/test';
import { StopCalculationOutcome } from '../../models/stopCalculationOutcome';
import { DualPaneSelector } from '../controls/dualPaneSelector';
import { EditOutcomeModal } from './editOutcomeModal';

export class EditStopCalculationOutcomeModal extends EditOutcomeModal {
  readonly stopCalculationSelector: DualPaneSelector;

  constructor(page: Page) {
    super(page);
    this.stopCalculationSelector = new DualPaneSelector(
      this.modal.locator('.label:has-text("Stop Calculation") + .data .onx-selector')
    );
  }

  async fillOutForm(outcome: StopCalculationOutcome) {
    await super.fillOutForm(outcome);

    for (const field of outcome.fieldsToStop) {
      await this.stopCalculationSelector.selectOption(field);
    }
  }
}
