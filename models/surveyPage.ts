import { Question } from './question';

type SurveyPageObject = {
  name: string;
  description?: string;
  questions?: Question[];
};

export class SurveyPage {
  name: string;
  description: string;
  questions: Question[];

  constructor({ name, description = '', questions = [] }: SurveyPageObject) {
    this.name = name;
    this.description = description;
    this.questions = questions;
  }
}
