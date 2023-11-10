import { LayoutItemPermission } from '../../models/layoutItem';

export abstract class LayoutItemSecurityTab {
  abstract setPermissions(permissions: LayoutItemPermission[]): Promise<void>;
}
