import { Outcome, OutcomeObject } from './outcome';

type PrintContentRecordVisibility = 'Include content in collapsed tabs' | 'Exclude content in collapsed tabs';
type PrintContentRecordOrientation = 'Portrait' | 'Landscape';

type PrintContentRecordOutcomeObject = Omit<OutcomeObject, 'type'> & {
  layout?: string;
  contentVisibility?: PrintContentRecordVisibility;
  orientation?: PrintContentRecordOrientation;
  attachmentField: string;
};

export class PrintContentRecordOutcome extends Outcome {
  layout: string;
  contentVisibility: PrintContentRecordVisibility;
  orientation: PrintContentRecordOrientation;
  attachmentField: string;

  constructor({
    status,
    description = '',
    layout = 'Default Layout',
    contentVisibility = 'Include content in collapsed tabs',
    orientation = 'Portrait',
    attachmentField,
  }: PrintContentRecordOutcomeObject) {
    super({ type: 'Print Content Record', status, description });
    this.layout = layout;
    this.contentVisibility = contentVisibility;
    this.orientation = orientation;
    this.attachmentField = attachmentField;
  }
}
