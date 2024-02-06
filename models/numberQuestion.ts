import { Question, QuestionObject } from './question';

type NumberQuestionObject = Omit<QuestionObject, 'type'>;

export class NumberQuestion extends Question {
  constructor({
    questionText,
    questionId,
    required = false,
    correctness = false,
    relateToContent = false,
    helpText = '',
  }: NumberQuestionObject) {
    super({
      questionText,
      questionId,
      required,
      correctness,
      relateToContent,
      helpText,
      type: 'Number',
    });
  }
}
