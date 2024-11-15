import { Report } from './report';

type DashboardObject = {
  id?: number;
  name: string;
  containers?: string[];
  items?: DashboardItem[];
};

export type DashboardItem = {
  object: Report;
  row: number;
  column: number;
};

export class Dashboard {
  id: number;
  name: string;
  containers: string[];
  items: DashboardItem[];

  constructor({ id = 0, name, containers = [], items = [] }: DashboardObject) {
    this.id = id;
    this.name = name;
    this.containers = containers;
    this.items = items;
  }
}
