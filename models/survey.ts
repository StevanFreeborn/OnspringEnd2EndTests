type SurveyObject = {
  id?: number;
  name: string;
};

export class Survey {
  id: number;
  readonly name: string;

  constructor({ id = 0, name }: SurveyObject) {
    this.id = id;
    this.name = name;
  }
}
