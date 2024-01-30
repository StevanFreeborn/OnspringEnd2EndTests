import { ListValue } from './listValue';
import { Question, QuestionObject } from './question';

type SingleSelectQuestionObject = Omit<QuestionObject, 'type'> & {
  answerValues: ListValue[];
};

export class SingleSelectQuestion extends Question {
  readonly answerValues: ListValue[];

  constructor({
    questionText,
    questionId,
    required = false,
    correctness = false,
    relateToContent = false,
    helpText = '',
    answerValues = [],
  }: SingleSelectQuestionObject) {
    super({
      questionText,
      questionId,
      required,
      correctness,
      relateToContent,
      helpText,
      type: 'Single Select',
    });

    this.answerValues = answerValues;
  }
}
