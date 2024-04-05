import { FrameLocator, Locator, Page } from '@playwright/test';
import { ObjectVisibilityOutcome } from '../../models/objectVisibilityOutcome';
import { Outcome, OutcomeType } from '../../models/outcome';
import { EditObjectVisibilityOutcomeModal } from '../modals/editObjectVisibilityOutcomeModal';
import { EditOutcomeModal } from '../modals/editOutcomeModal';

export class TriggerOutcomesTab {
  private readonly page: Page;
  readonly outcomesGrid: Locator;

  constructor(frame: FrameLocator, page: Page) {
    this.page = page;
    this.outcomesGrid = frame.locator('#outcome-grid');
  }

  private getEditOutcomeModal(itemType: 'Object Visibility'): EditObjectVisibilityOutcomeModal;
  private getEditOutcomeModal(outcomeType: OutcomeType): EditOutcomeModal {
    switch (outcomeType) {
      case 'Object Visibility':
        return new EditObjectVisibilityOutcomeModal(this.page);
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
      default:
        throw new Error(`Unsupported outcome type: ${outcome.type}`);
    }

    const modal = this.getEditOutcomeModal(outcome.type);
    await modal.okButton.click();
  }
}
