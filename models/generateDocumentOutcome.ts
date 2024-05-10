import { Outcome, OutcomeObject } from './outcome';

type FileType = 'Microsoft Word' | 'PDF';

type GenerateDocumentOutcomeObject = Omit<OutcomeObject, 'type'> & {
  document: string;
  fileType: FileType;
  attachmentField: string;
};

export class GenerateDocumentOutcome extends Outcome {
  readonly document: string;
  readonly fileType: FileType;
  readonly attachmentField: string;

  constructor({ status, description, document, fileType, attachmentField }: GenerateDocumentOutcomeObject) {
    super({ type: 'Generate Document', status, description });
    this.document = document;
    this.fileType = fileType;
    this.attachmentField = attachmentField;
  }
}
