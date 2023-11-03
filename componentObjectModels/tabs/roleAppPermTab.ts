import { Locator, Page } from '@playwright/test';
import {
  CRUDPermission,
  EnableOnlyPermission,
  Permission,
  ReadAndUpdatePermission,
  ReadOnlyPermission,
} from '../../models/role';
import { RoleAdminPage } from '../../pageObjectModels/roles/roleAdminPage';

export class RoleAppPermTab {
  private readonly page: Page;
  readonly filterByInput: Locator;

  constructor(roleAdminPage: RoleAdminPage) {
    this.page = roleAdminPage.page;
    this.filterByInput = this.page.locator('#app-filter-input > input');
  }

  getAppPermissionSection(appName: string) {
    return new AppPermissionSection(this.page, appName);
  }
}

class AppPermissionSection {
  private readonly section: Locator;
  readonly heading: Locator;
  readonly permissionGrid: PermissionGrid;

  constructor(page: Page, appName: string) {
    this.section = page
      .locator('section.section')
      .filter({ has: page.locator('h1').filter({ hasText: appName }) })
      .first();
    this.heading = this.section.locator('h1');
    this.permissionGrid = new PermissionGrid(this.section);
  }
}

class PermissionGrid {
  readonly grid: Locator;
  readonly contentRecordPermissions: CRUDPermissionRow;
  readonly referencedRecordPermissions: ReadAndUpdatePermissionRow;
  readonly versionHistoryPermissions: ReadOnlyPermissionRow;
  readonly contentAdminPermissions: EnableOnlyPermissionRow;
  readonly reportAdminPermissions: EnableOnlyPermissionRow;
  readonly privateReportAdminPermissions: EnableOnlyPermissionRow;

  constructor(section: Locator) {
    this.grid = section.locator('table');
    this.contentRecordPermissions = new PermissionRow(this.grid.getByRole('row', { name: 'Content Records' }));
    this.referencedRecordPermissions = new PermissionRow(this.grid.getByRole('row', { name: 'Referenced Records' }));
    this.versionHistoryPermissions = new PermissionRow(this.grid.getByRole('row', { name: 'Version History' }));
    this.contentAdminPermissions = new PermissionRow(this.grid.getByRole('row', { name: 'Content Administrator' }));
    this.reportAdminPermissions = new PermissionRow(this.grid.getByRole('row', { name: 'Report Administrator' }));
    this.privateReportAdminPermissions = new PermissionRow(
      this.grid.getByRole('row', {
        name: 'Private to me Reports',
      })
    );
  }
}

class BasePermissionRow {
  protected readonly row: Locator;

  constructor(row: Locator) {
    this.row = row;
  }
}

interface ReadOnlyPermissionRow {
  readonly readCheckbox: Locator;
  set(permissions: ReadOnlyPermission): Promise<void>;
}

interface ReadAndUpdatePermissionRow extends ReadOnlyPermissionRow {
  readonly updateCheckbox: Locator;
  set(permissions: ReadAndUpdatePermission): Promise<void>;
}

interface EnableOnlyPermissionRow {
  readonly enableCheckbox: Locator;
  set(permissions: EnableOnlyPermission): Promise<void>;
}

interface CRUDPermissionRow extends ReadAndUpdatePermissionRow {
  readonly createCheckbox: Locator;
  readonly deleteCheckbox: Locator;
  set(permissions: CRUDPermission): Promise<void>;
}

class PermissionRow
  extends BasePermissionRow
  implements ReadOnlyPermissionRow, ReadAndUpdatePermissionRow, EnableOnlyPermissionRow, CRUDPermissionRow
{
  readonly createCheckbox: Locator;
  readonly readCheckbox: Locator;
  readonly updateCheckbox: Locator;
  readonly deleteCheckbox: Locator;
  readonly enableCheckbox: Locator;

  constructor(row: Locator) {
    super(row);
    this.createCheckbox = row.locator('[data-permission-type="create"]').first();
    this.readCheckbox = row.locator('[data-permission-type="read"]').first();
    this.updateCheckbox = row.locator('[data-permission-type="update"]').first();
    this.deleteCheckbox = row.locator('[data-permission-type="delete"]').first();
    this.enableCheckbox = row.locator('[data-permission-type="enabled"]').first();
  }

  async set(permissions: Permission): Promise<void> {
    if ((await this.createCheckbox.isVisible()) && (await this.createCheckbox.isEnabled())) {
      await this.createCheckbox.setChecked(permissions.create);
    }

    if ((await this.readCheckbox.isVisible()) && (await this.readCheckbox.isEnabled())) {
      await this.readCheckbox.setChecked(permissions.read);
    }

    if ((await this.updateCheckbox.isVisible()) && (await this.updateCheckbox.isEnabled())) {
      await this.updateCheckbox.setChecked(permissions.update);
    }

    if ((await this.deleteCheckbox.isVisible()) && (await this.deleteCheckbox.isEnabled())) {
      await this.deleteCheckbox.setChecked(permissions.delete);
    }

    if ((await this.enableCheckbox.isVisible()) && (await this.enableCheckbox.isEnabled())) {
      await this.enableCheckbox.setChecked(permissions.enable);
    }
  }
}
