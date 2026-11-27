import { LayoutItem, LayoutItemObject } from './layoutItem.js';

type SurveyAnswerFieldObject = Omit<LayoutItemObject, 'type'> & {
  questionText: string;
  description?: string;
};

export class SurveyAnswerField extends LayoutItem {
  readonly questionText: string;
  readonly description: string;

  constructor({ id = 0, name, permissions = [], questionText, description = '' }: SurveyAnswerFieldObject) {
    super({ id, name, permissions, type: 'Survey Answer' });
    this.questionText = questionText;
    this.description = description;
  }
}
