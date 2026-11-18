type AppObject = {
  id?: number;
  name: string;
};

export class App {
  id: number;
  readonly name: string;

  constructor({ id = 0, name }: AppObject) {
    this.id = id;
    this.name = name;
  }
}
