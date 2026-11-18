import { Question, QuestionObject } from './question.js';

type TextQuestionObject = Omit<QuestionObject, 'type'>;

export class TextQuestion extends Question {
  constructor({
    questionText,
    questionId,
    required = false,
    correctness = false,
    relateToContent = false,
    helpText = '',
  }: TextQuestionObject) {
    super({
      questionText,
      questionId,
      required,
      correctness,
      relateToContent,
      helpText,
      type: 'Text',
    });
  }
}
