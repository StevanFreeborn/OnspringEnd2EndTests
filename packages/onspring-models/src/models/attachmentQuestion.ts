import { Question, QuestionObject } from './question.js';

type AttachmentQuestionObject = Omit<QuestionObject, 'type'>;

export class AttachmentQuestion extends Question {
  constructor({
    questionText,
    questionId,
    required = false,
    correctness = false,
    relateToContent = false,
    helpText = '',
  }: AttachmentQuestionObject) {
    super({
      questionText,
      questionId,
      required,
      correctness,
      relateToContent,
      helpText,
      type: 'Attachment',
    });
  }
}
