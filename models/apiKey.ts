type ApiKeyObject = {
  name: string;
  role: string;
  description?: string;
  status?: boolean;
  key?: string;
};

export class ApiKey {
  name: string;
  description: string;
  role: string;
  status: boolean;
  key: string;

  constructor({ name, description = '', role, status = false, key = '' }: ApiKeyObject) {
    this.name = name;
    this.description = description;
    this.role = role;
    this.status = status;
    this.key = key;
  }
}
