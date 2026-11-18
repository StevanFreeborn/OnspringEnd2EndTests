import { BaseListValue } from './listValue.js';
import { Question, QuestionObject } from './question.js';

type LikertQuestionObject = Omit<QuestionObject, 'type'> & {
  answerValues: BaseListValue[];
};

export class LikertQuestion extends Question {
  readonly answerValues: BaseListValue[];

  constructor({
    questionText,
    questionId,
    required = false,
    correctness = false,
    relateToContent = false,
    helpText = '',
    answerValues = [],
  }: LikertQuestionObject) {
    super({
      questionText,
      questionId,
      required,
      correctness,
      relateToContent,
      helpText,
      type: 'Likert Scale',
    });

    this.answerValues = answerValues;
  }
}
