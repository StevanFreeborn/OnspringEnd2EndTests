type ContainerObject = {
  id?: number;
  name: string;
};

export class Container {
  id: number;
  name: string;

  constructor({ id = 0, name }: ContainerObject) {
    this.id = id;
    this.name = name;
  }
}
