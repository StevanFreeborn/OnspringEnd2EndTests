import { BaseListValue } from './listValue';
import { Question, QuestionObject } from './question';

type MatrixQuestionObject = Omit<QuestionObject, 'type'> & {
  rowValues: BaseListValue[];
  columnValues: BaseListValue[];
};

export class MatrixQuestion extends Question {
  readonly rowValues: BaseListValue[];
  readonly columnValues: BaseListValue[];

  constructor({
    questionText,
    questionId,
    required = false,
    correctness = false,
    relateToContent = false,
    helpText = '',
    rowValues = [],
    columnValues = [],
  }: MatrixQuestionObject) {
    super({
      questionText,
      questionId,
      required,
      correctness,
      relateToContent,
      helpText,
      type: 'Matrix',
    });

    this.rowValues = rowValues;
    this.columnValues = columnValues;
  }
}
