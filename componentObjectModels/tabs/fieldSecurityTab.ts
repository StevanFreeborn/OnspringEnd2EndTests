import { FrameLocator, Locator } from '@playwright/test';
import { LayoutItemPermission } from '../../models/layoutItem';
import { FieldPermissionGrid } from '../controls/fieldPermissionsGrid';

export class FieldSecurityTab {
  private readonly frame: FrameLocator;
  readonly viewSelect: Locator;
  readonly permissionsGrid: FieldPermissionGrid;

  constructor(frame: FrameLocator) {
    this.frame = frame;
    this.viewSelect = this.frame.getByRole('listbox', { name: 'View' });
    this.permissionsGrid = new FieldPermissionGrid(this.frame.locator('#field-access-table').first());
  }

  async setPermissions(permissions: LayoutItemPermission[]) {
    if (permissions.length) {
      await this.viewSelect.click();
      await this.frame.getByRole('option', { name: 'Private by Role' }).click();

      for (const permission of permissions) {
        await this.permissionsGrid.getRolePermissionRow(permission.roleName).set(permission);
      }
    } else {
      await this.viewSelect.click();
      await this.frame.getByRole('option', { name: 'Public' }).click();
    }
  }
}
