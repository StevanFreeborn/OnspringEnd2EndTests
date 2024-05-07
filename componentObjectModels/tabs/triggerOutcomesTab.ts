import { FrameLocator, Locator, Page } from '@playwright/test';
import { ObjectVisibilityOutcome } from '../../models/objectVisibilityOutcome';
import { Outcome, OutcomeType } from '../../models/outcome';
import { RequiredFieldsOutcome } from '../../models/requiredFieldsOutcome';
import { SetDateOutcome } from '../../models/setDateOutcome';
import { SetListValueOutcome } from '../../models/setListValueOutcome';
import { SetReferenceOutcome } from '../../models/setReferenceOutcome';
import { StopCalculationOutcome } from '../../models/stopCalculationOutcome';
import { BaseEditOutcomeModal } from '../modals/baseEditOutcomeModal';
import { EditObjectVisibilityOutcomeModal } from '../modals/editObjectVisibilityOutcomeModal';
import { EditRequiredFieldsOutcomeModal } from '../modals/editRequiredFieldsOutcomeModal';
import { EditSetDateOutcomeModal } from '../modals/editSetDateOutcomeModal';
import { EditSetListValueOutcomeModal } from '../modals/editSetListValueOutcomeModal';
import { EditSetReferenceOutcomeModal } from '../modals/editSetReferenceOutcomeModal';
import { EditStopCalculationOutcomeModal } from '../modals/editStopCalculationOutcomeModal';

export class TriggerOutcomesTab {
  private readonly page: Page;
  readonly outcomesGrid: Locator;

  constructor(frame: FrameLocator, page: Page) {
    this.page = page;
    this.outcomesGrid = frame.locator('#outcome-grid');
  }

  private getEditOutcomeModal(outcomeType: 'Required Fields'): EditRequiredFieldsOutcomeModal;
  private getEditOutcomeModal(outcomeType: 'Set Reference'): EditSetReferenceOutcomeModal;
  private getEditOutcomeModal(outcomeType: 'Set List Value'): EditSetListValueOutcomeModal;
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
      case 'Set List Value':
        return new EditSetListValueOutcomeModal(this.page);
      case 'Set Reference':
        return new EditSetReferenceOutcomeModal(this.page);
      case 'Required Fields':
        return new EditRequiredFieldsOutcomeModal(this.page);
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
      case 'Set List Value': {
        const modal = this.getEditOutcomeModal('Set List Value');
        await modal.fillOutForm(outcome as SetListValueOutcome);
        break;
      }
      case 'Set Reference': {
        const modal = this.getEditOutcomeModal('Set Reference');
        await modal.fillOutForm(outcome as SetReferenceOutcome);
        break;
      }
      case 'Required Fields': {
        const modal = this.getEditOutcomeModal('Required Fields');
        await modal.fillOutForm(outcome as RequiredFieldsOutcome);
        break;
      }
      default:
        throw new Error(`Unsupported outcome type: ${outcome.type}`);
    }

    const modal = this.getEditOutcomeModal(outcome.type);
    await modal.okButton.click();
  }
}
