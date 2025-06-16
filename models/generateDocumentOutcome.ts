import { Outcome, OutcomeObject } from './outcome';

type GenerateDocumentType = 'Generate Document' | 'Generate Signature Document(s)';

type FileType = 'Microsoft Word' | 'PDF';

type GenerateDocumentOutcomeObject = Omit<OutcomeObject, 'type'> & {
  document: string;
  fileType: FileType;
  attachmentField: string;
  documentType?: GenerateDocumentType;
};

export class GenerateDocumentOutcome extends Outcome {
  readonly document: string;
  readonly fileType: FileType;
  readonly attachmentField: string;
  readonly documentType: GenerateDocumentType;

  constructor({
    status,
    description,
    document,
    fileType,
    attachmentField,
    documentType = 'Generate Document',
  }: GenerateDocumentOutcomeObject) {
    super({ type: 'Generate Document', status, description });
    this.document = document;
    this.fileType = fileType;
    this.attachmentField = attachmentField;
    this.documentType = documentType;
  }
}
