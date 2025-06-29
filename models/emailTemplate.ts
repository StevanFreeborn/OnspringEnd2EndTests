type EmailTemplateObject = {
  name: string;
};

export class EmailTemplate {
  id?: number;
  name: string;

  constructor({ name }: EmailTemplateObject) {
    this.name = name;
  }
}
