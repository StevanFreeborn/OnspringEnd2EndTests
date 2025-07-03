type EmailTemplateObject = {
  name: string;
  status?: boolean;
  description?: string;
};

export class EmailTemplate {
  id?: number;
  name: string;
  status: boolean;
  description: string;

  constructor({ name, status = true, description = '' }: EmailTemplateObject) {
    this.name = name;
    this.status = status;
    this.description = description;
  }
}
