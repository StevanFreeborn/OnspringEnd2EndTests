import { Question, QuestionObject } from './question';

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
