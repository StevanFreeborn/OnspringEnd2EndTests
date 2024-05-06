import { FrameLocator, Locator, Page } from '@playwright/test';
import { ObjectVisibilityOutcome } from '../../models/objectVisibilityOutcome';
import { Outcome, OutcomeType } from '../../models/outcome';
import { SetDateOutcome } from '../../models/setDateOutcome';
import { StopCalculationOutcome } from '../../models/stopCalculationOutcome';
import { BaseEditOutcomeModal } from '../modals/baseEditOutcomeModal';
import { EditObjectVisibilityOutcomeModal } from '../modals/editObjectVisibilityOutcomeModal';
import { EditSetDateOutcomeModal } from '../modals/editSetDateOutcomeModal';
import { EditStopCalculationOutcomeModal } from '../modals/editStopCalculationOutcomeModal';

export class TriggerOutcomesTab {
  private readonly page: Page;
  readonly outcomesGrid: Locator;

  constructor(frame: FrameLocator, page: Page) {
    this.page = page;
    this.outcomesGrid = frame.locator('#outcome-grid');
  }

  private getEditOutcomeModal(outcomeType: 'Set Date'): EditSetDateOutcomeModal;
  private getEditOutcomeModal(outcomeType: 'Stop Calculation'): EditStopCalculationOutcomeModal;
  private getEditOutcomeModal(outcomeType: 'Object Visibility'): EditObjectVisibilityOutcomeModal;
  private getEditOutcomeModal(outcomeType: OutcomeType): BaseEditOutcomeModal;
  private getEditOutcomeModal(outcomeType: OutcomeType): BaseEditOutcomeModal {
    switch (outcomeType) {
      case 'Object Visibility':
        return new EditObjectVisibilityOutcomeModal(this.page);
      case 'Stop Calculation':
        return new EditStopCalculationOutcomeModal(this.page);
      case 'Set Date':
        return new EditSetDateOutcomeModal(this.page);
      default:
        throw new Error(`Unsupported outcome type: ${outcomeType}`);
    }
  }

  async addOutcome(outcome: Outcome) {
    await this.outcomesGrid.getByRole('row', { name: outcome.type }).click();

    switch (outcome.type) {
      case 'Object Visibility': {
        const modal = this.getEditOutcomeModal('Object Visibility');
        await modal.fillOutForm(outcome as ObjectVisibilityOutcome);
        break;
      }
      case 'Stop Calculation': {
        const modal = this.getEditOutcomeModal('Stop Calculation');
        await modal.fillOutForm(outcome as StopCalculationOutcome);
        break;
      }
      case 'Set Date': {
        const modal = this.getEditOutcomeModal('Set Date');
        await modal.fillOutForm(outcome as SetDateOutcome);
        break;
      }
      default:
        throw new Error(`Unsupported outcome type: ${outcome.type}`);
    }

    const modal = this.getEditOutcomeModal(outcome.type);
    await modal.okButton.click();
  }
}
