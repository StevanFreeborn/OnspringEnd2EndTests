type FormattedTextObject = {
  formattedText: string;
  objectId: string;
};

export class FormattedText {
  readonly formattedText: string;
  readonly objectId: string;

  constructor({ formattedText, objectId }: FormattedTextObject) {
    this.formattedText = formattedText;
    this.objectId = objectId;
  }
}
