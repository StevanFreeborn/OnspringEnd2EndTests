import { LayoutItemType } from '../componentObjectModels/menus/addLayoutItemMenu';

type LayoutItemPermissionObject = {
  roleName: string;
  read?: boolean;
  update?: boolean;
};

export class LayoutItemPermission {
  readonly roleName: string;
  readonly read: boolean;
  readonly update: boolean;

  constructor({ read = false, update = false, roleName }: LayoutItemPermissionObject) {
    this.roleName = roleName;
    this.read = read;
    this.update = update;
  }
}

export type LayoutItemObject = {
  id?: number;
  name: string;
  permissions?: LayoutItemPermission[];
  type: LayoutItemType;
};

export abstract class LayoutItem {
  id: number;
  readonly name: string;
  readonly type: LayoutItemType;
  readonly permissions: LayoutItemPermission[];

  constructor({ name, type, id = 0, permissions = [] }: LayoutItemObject) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.permissions = permissions;
  }
}
