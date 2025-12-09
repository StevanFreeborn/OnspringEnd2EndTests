import { Locator } from '@playwright/test';
import { LayoutItemPermission } from '../../models/layoutItem';

export class FieldPermissionGrid {
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

    if ((await this.readCheckbox.isVisible()) && (await this.readCheckbox.isEditable())) {
      await this.readCheckbox.setChecked(permissions.read);
    }
  }
}
