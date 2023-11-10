import { LayoutItemPermission } from '../../models/layoutItem';

export abstract class LayoutItemSecurityTab {
  /**
   * Sets the permissions for the layout item. An empty array will set the layout item to public.
   * @param permissions The permissions to set.
   * @returns A promise that resolves when the permissions have been set.
   */
  abstract setPermissions(permissions: LayoutItemPermission[]): Promise<void>;
}
