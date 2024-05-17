import { ListValue } from './listValue';

type SharedListObject = {
  name: string;
  description?: string;
  status?: boolean;
  values?: ListValue[];
  customSort?: boolean;
  appsAvailableTo?: string[];
};

export class SharedList {
  name: string;
  description: string;
  status: boolean;
  values: ListValue[];
  customSort: boolean;
  appsAvailableTo: string[];

  constructor({
    name,
    description = '',
    status = true,
    values = [],
    customSort = true,
    appsAvailableTo = [],
  }: SharedListObject) {
    this.name = name;
    this.description = description;
    this.status = status;
    this.values = values;
    this.customSort = customSort;
    this.appsAvailableTo = appsAvailableTo;
  }
}
