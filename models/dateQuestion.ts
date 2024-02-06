import { Question, QuestionObject } from './question';

type DateQuestionObject = Omit<QuestionObject, 'type'>;

export class DateQuestion extends Question {
  constructor({
    questionText,
    questionId,
    required = false,
    correctness = false,
    relateToContent = false,
    helpText = '',
  }: DateQuestionObject) {
    super({
      questionText,
      questionId,
      required,
      correctness,
      relateToContent,
      helpText,
      type: 'Date/Time',
    });
  }
}
