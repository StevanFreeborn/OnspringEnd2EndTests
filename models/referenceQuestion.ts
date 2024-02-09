import { Question, QuestionObject } from './question';

type ReferenceQuestionObject = Omit<QuestionObject, 'type'> & {
  appReference: string;
  answerValues: 'ALL' | string[];
};

export class ReferenceQuestion extends Question {
  readonly appReference: string;
  readonly answerValues: 'ALL' | string[];

  constructor({
    questionText,
    questionId,
    appReference,
    answerValues,
    required = false,
    correctness = false,
    relateToContent = false,
    helpText = '',
  }: ReferenceQuestionObject) {
    super({
      questionText,
      questionId,
      required,
      correctness,
      relateToContent,
      helpText,
      type: 'Reference',
    });

    this.appReference = appReference;
    this.answerValues = answerValues;
  }
}
