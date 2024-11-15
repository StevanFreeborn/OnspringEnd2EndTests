type DashboardObject = {
  id?: number;
  name: string;
};

export class Dashboard {
  id: number;
  name: string;

  constructor({ id = 0, name }: DashboardObject) {
    this.id = id;
    this.name = name;
  }
}
