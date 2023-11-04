export class App {
  id: number = 0;
  name: string = '';

  constructor(obj: App = {} as App) {
    const { id, name } = obj;

    this.id = id;
    this.name = name;
  }
}
