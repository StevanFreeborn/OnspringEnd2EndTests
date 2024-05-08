import { FrameLocator, Locator, Page } from '@playwright/test';
import { CreateMultipleRecordsOutcome } from '../../models/createMultipleRecordsOutcome';
import { CreateOneRecordOutcome } from '../../models/createOneRecordOutcome';
import { FilterListValueOutcome } from '../../models/filterListValueOutcome';
import { ObjectVisibilityOutcome } from '../../models/objectVisibilityOutcome';
import { Outcome, OutcomeType } from '../../models/outcome';
import { PrintContentRecordOutcome } from '../../models/printContentRecordOutcome';
import { RequiredFieldsOutcome } from '../../models/requiredFieldsOutcome';
import { SetDateOutcome } from '../../models/setDateOutcome';
import { SetListValueOutcome } from '../../models/setListValueOutcome';
import { SetReferenceOutcome } from '../../models/setReferenceOutcome';
import { StopCalculationOutcome } from '../../models/stopCalculationOutcome';
import { BaseEditOutcomeModal } from '../modals/baseEditOutcomeModal';
import { EditCreateMultipleRecordsOutcomeModal } from '../modals/editCreateMultipleRecordsOutcomeModal';
import { EditCreateOneRecordOutcomeModal } from '../modals/editCreateOneRecordOutcomeModal';
import { EditFilterListValueOutcomeModal } from '../modals/editFilterListValueOutcomeModal';
import { EditObjectVisibilityOutcomeModal } from '../modals/editObjectVisibilityOutcomeModal';
import { EditPrintContentRecordOutcomeModal } from '../modals/editPrintContentRecordOutcomeModal';
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

  private getEditOutcomeModal(outcomeType: 'Create Multiple Records'): EditCreateMultipleRecordsOutcomeModal;
  private getEditOutcomeModal(outcomeType: 'Create One Record'): EditCreateOneRecordOutcomeModal;
  private getEditOutcomeModal(outcomeType: 'Print Content Record'): EditPrintContentRecordOutcomeModal;
  private getEditOutcomeModal(outcomeType: 'Filter List Values'): EditFilterListValueOutcomeModal;
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
      case 'Filter List Values':
        return new EditFilterListValueOutcomeModal(this.page);
      case 'Print Content Record':
        return new EditPrintContentRecordOutcomeModal(this.page);
      case 'Create One Record':
        return new EditCreateOneRecordOutcomeModal(this.page);
      case 'Create Multiple Records':
        return new EditCreateMultipleRecordsOutcomeModal(this.page);
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
      case 'Filter List Values': {
        const modal = this.getEditOutcomeModal('Filter List Values');
        await modal.fillOutForm(outcome as FilterListValueOutcome);
        break;
      }
      case 'Print Content Record': {
        const modal = this.getEditOutcomeModal('Print Content Record');
        await modal.fillOutForm(outcome as PrintContentRecordOutcome);
        break;
      }
      case 'Create One Record': {
        const modal = this.getEditOutcomeModal('Create One Record');
        await modal.fillOutForm(outcome as CreateOneRecordOutcome);
        break;
      }
      case 'Create Multiple Records': {
        const modal = this.getEditOutcomeModal('Create Multiple Records');
        await modal.fillOutForm(outcome as CreateMultipleRecordsOutcome);
        break;
      }
      default:
        throw new Error(`Unsupported outcome type: ${outcome.type}`);
    }

    const modal = this.getEditOutcomeModal(outcome.type);
    await modal.okButton.click();
  }
}
