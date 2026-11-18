import { ListValue } from './listValue.js';
import { Question, QuestionObject } from './question.js';

type MultiSelectQuestionObject = Omit<QuestionObject, 'type'> & {
  answerValues: ListValue[];
};

export class MultiSelectQuestion extends Question {
  readonly answerValues: ListValue[];

  constructor({
    questionText,
    questionId,
    required = false,
    correctness = false,
    relateToContent = false,
    helpText = '',
    answerValues = [],
  }: MultiSelectQuestionObject) {
    super({
      questionText,
      questionId,
      required,
      correctness,
      relateToContent,
      helpText,
      type: 'Multi Select',
    });

    this.answerValues = answerValues;
  }
}
