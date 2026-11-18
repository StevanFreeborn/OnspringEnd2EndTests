export type QuestionType =
  | 'Single Select'
  | 'Multi Select'
  | 'Number'
  | 'Text'
  | 'Date/Time'
  | 'Likert Scale'
  | 'Matrix'
  | 'Attachment'
  | 'Reference';

export type QuestionObject = {
  questionText: string;
  questionId: string;
  required?: boolean;
  correctness?: boolean;
  relateToContent?: boolean;
  helpText?: string;
  type: QuestionType;
};

export abstract class Question {
  readonly questionText: string;
  readonly questionId: string;
  readonly required: boolean = false;
  readonly correctness: boolean = false;
  readonly relateToContent: boolean = false;
  readonly helpText: string = '';
  readonly type: QuestionType;

  protected constructor({
    questionText,
    questionId,
    required = false,
    correctness = false,
    relateToContent = false,
    helpText = '',
    type,
  }: QuestionObject) {
    this.questionText = questionText;
    this.questionId = questionId;
    this.required = required;
    this.correctness = correctness;
    this.relateToContent = relateToContent;
    this.helpText = helpText;
    this.type = type;
  }
}
