import { Page } from '@playwright/test';
import { Role } from '../../models/role';
import { RoleAdminPage } from './roleAdminPage';

export class AddRoleAdminPage extends RoleAdminPage {
  readonly path: string;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Security/Role/Add';
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async addRole(role: Role) {
    await this.goto();
    await this.generalTab.nameInput.fill(role.name);

    if (role.description) {
      await this.generalTab.descriptionEditor.fill(role.description);
    }

    if (role.status === 'Active') {
      await this.generalTab.statusToggle.click();
    }

    if (role.appPermissions.length > 0) {
      await this.appPermissionsTabButton.click();

      for (const appPermission of role.appPermissions) {
        await this.appPermTab.filterByInput.clear();
        await this.appPermTab.filterByInput.pressSequentially(appPermission.appName, { delay: 150 });

        const appPermissionSection = this.appPermTab.getAppPermissionSection(appPermission.appName);

        if (await appPermissionSection.permissionGrid.grid.isHidden()) {
          await appPermissionSection.heading.click();
        }

        await appPermissionSection.permissionGrid.contentRecordPermissions.set(appPermission.contentRecords);
        await appPermissionSection.permissionGrid.referencedRecordPermissions.set(appPermission.referencedRecords);
        await appPermissionSection.permissionGrid.versionHistoryPermissions.set(appPermission.versionHistory);
        await appPermissionSection.permissionGrid.contentAdminPermissions.set(appPermission.contentAdmin);
        await appPermissionSection.permissionGrid.reportAdminPermissions.set(appPermission.reportAdmin);
        await appPermissionSection.permissionGrid.privateReportAdminPermissions.set(appPermission.privateReportAdmin);
      }
    }

    if (role.adminReportPermissions.length > 0) {
      await this.adminPermissionsTabButton.click();

      for (const adminReportPermission of role.adminReportPermissions) {
        const adminReportPermissionRow = this.adminPermTab.adminReportsGrid.getByRole('row', {
          name: adminReportPermission.reportName,
        });

        if (adminReportPermission.permission.read) {
          await adminReportPermissionRow.getByRole('checkbox').click();
        }
      }
    }

    await this.saveRecordButton.click();
  }
}
