import { FrameLocator, Locator } from '@playwright/test';
import { LayoutItemPermission } from '../../models/layoutItem';

export class LayoutItemSecurityTab {
  private readonly frame: FrameLocator;
  readonly viewSelect: Locator;
  readonly permissionsGrid: FieldPermissionGrid;

  constructor(frame: FrameLocator) {
    this.frame = frame;
    this.viewSelect = frame.getByRole('listbox', { name: 'View' });
    this.permissionsGrid = new FieldPermissionGrid(frame.locator('#field-access-table').first());
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

class FieldPermissionGrid {
  readonly grid: Locator;
  readonly editAllCheckbox: Locator;
  readonly readAllCheckbox: Locator;

  constructor(grid: Locator) {
    this.grid = grid;
    this.editAllCheckbox = grid.locator('thead').locator('[data-permission-type="update"]');
    this.readAllCheckbox = grid.locator('thead').locator('[data-permission-type="read"]');
  }

  getRolePermissionRow(roleName: string) {
    return new RolePermissionRow(this.grid.getByRole('row', { name: roleName }));
  }
}

class RolePermissionRow {
  readonly editCheckbox: Locator;
  readonly readCheckbox: Locator;

  constructor(row: Locator) {
    this.editCheckbox = row.locator('[data-permission-type="update"]');
    this.readCheckbox = row.locator('[data-permission-type="read"]');
  }

  async set(permissions: LayoutItemPermission) {
    if ((await this.editCheckbox.isVisible()) && (await this.editCheckbox.isEditable())) {
      await this.editCheckbox.setChecked(permissions.update);
    }
    7;

    if ((await this.readCheckbox.isVisible()) && (await this.readCheckbox.isEditable())) {
      await this.readCheckbox.setChecked(permissions.read);
    }
  }
}
