import { Response } from '@playwright/test';
import { Role } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AdminNavTargets, AdminTileTargets } from '../common/navs/adminNav.targets.js';
import {
  AddRolePageTargets,
  CopyRolePageTargets,
  EditRolePageTargets,
  RolesSecurityPageTargets,
} from './roles.targets.js';

export const RoleTasks = {
  goto:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const getRolesResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => r.url().includes(RolesSecurityPageTargets.getRolesPath) && r.status() === 200
        );
      await actor.browse().goto(RolesSecurityPageTargets.route);
      await getRolesResponse;
    },

  create:
    (role: Role): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(AddRolePageTargets.route);
      await actor.browse().type(AddRolePageTargets.nameInput, role.name);

      if (role.description) {
        await actor.browse().type(AddRolePageTargets.descriptionEditor, role.description);
      }

      if (role.status === 'Active') {
        await actor.browse().click(AddRolePageTargets.statusToggle);
      }

      if (role.appPermissions.length > 0) {
        await actor.browse().click(AddRolePageTargets.appPermissionsTabButton);

        for (const appPerm of role.appPermissions) {
          await actor.browse().type(AddRolePageTargets.appPermTab.filterByInput, appPerm.appName);

          const gridTarget = AddRolePageTargets.appPermTab.appSectionGrid(appPerm.appName);
          const isGridVisible = await actor.browse().isVisible(gridTarget);
          if (!isGridVisible) {
            await actor.browse().click(AddRolePageTargets.appPermTab.appSectionHeading(appPerm.appName));
          }

          if (appPerm.contentRecords.read) {
            const readCheckboxTarget = AddRolePageTargets.appPermTab.permissionCheckbox(
              appPerm.appName,
              'Content Records',
              'read'
            );
            await actor.browse().checkControl(readCheckboxTarget);
          }
        }
      }

      const editPageUrlWait = actor.browse().waitForUrl(AddRolePageTargets.editPathRegex);
      await actor.browse().click(AddRolePageTargets.saveRecordButton);
      await editPageUrlWait;

      const urlParts = actor.browse().url().split('/');
      const roleId = parseInt(urlParts[urlParts.length - 2]);
      role.id = roleId;
    },

  createViaHeader:
    (roleName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('Role'));
      await actor.browse().type(AddRolePageTargets.nameInput, roleName);

      // Double-click status toggle workaround if needed
      await actor.browse().click(AddRolePageTargets.statusToggle);
      await actor.browse().click(AddRolePageTargets.statusToggle);

      const editPageUrlWait = actor.browse().waitForUrl(AddRolePageTargets.editPathRegex);
      await actor.browse().click(AddRolePageTargets.saveRecordButton);
      await editPageUrlWait;
    },

  createViaSecurityTile:
    (roleName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminTileTargets.securityTileLink);
      await actor.browse().check(AdminTileTargets.securityTileCreateButton).isVisible();
      await actor.browse().click(AdminTileTargets.securityTileCreateButton);
      await actor.browse().check(AdminTileTargets.securityCreateMenu).isVisible();
      await actor.browse().click(AdminTileTargets.securityMenuOption('Role'));
      await actor.browse().type(AddRolePageTargets.nameInput, roleName);

      await actor.browse().click(AddRolePageTargets.statusToggle);
      await actor.browse().click(AddRolePageTargets.statusToggle);

      const editPageUrlWait = actor.browse().waitForUrl(AddRolePageTargets.editPathRegex);
      await actor.browse().click(AddRolePageTargets.saveRecordButton);
      await editPageUrlWait;
    },

  createFromGrid:
    (roleName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(RolesSecurityPageTargets.createRoleButton);
      await actor.browse().type(AddRolePageTargets.nameInput, roleName);

      await actor.browse().click(AddRolePageTargets.statusToggle);
      await actor.browse().click(AddRolePageTargets.statusToggle);

      const editPageUrlWait = actor.browse().waitForUrl(AddRolePageTargets.editPathRegex);
      await actor.browse().click(AddRolePageTargets.saveRecordButton);
      await editPageUrlWait;
    },

  save:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const saveResponse = actor
        .browse()
        .waitForResponse((r: Response) => r.url().match(EditRolePageTargets.pathRegex) !== null && r.status() === 200);
      await actor.browse().click(EditRolePageTargets.saveRecordButton);
      await saveResponse;
    },

  copy:
    (sourceRoleName: string, copiedRoleName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(RoleTasks.goto());
      const roleRow = RolesSecurityPageTargets.rowByName(sourceRoleName);
      await actor.browse().hover(roleRow);
      await actor.browse().click(RolesSecurityPageTargets.copyButtonInRow(sourceRoleName));

      await actor.browse().check(CopyRolePageTargets.generalTab.nameInput).hasValue(sourceRoleName);
      await actor.browse().type(CopyRolePageTargets.generalTab.nameInput, copiedRoleName);

      const navWait = actor.browse().waitForUrl(EditRolePageTargets.pathRegex);
      await actor.browse().click(CopyRolePageTargets.saveRecordButton);
      await navWait;
    },

  deleteRoles:
    (rolesToDelete: string[]): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      if (rolesToDelete.length === 0) return;

      await actor.attemptsTo(RoleTasks.goto());

      for (const roleName of rolesToDelete) {
        const row = RolesSecurityPageTargets.rowByName(roleName);
        const isVisible = await actor.browse().isVisible(row);
        if (isVisible) {
          await actor.browse().hover(row);
          await actor.browse().click(RolesSecurityPageTargets.deleteButtonInRow(roleName));
          const deleteResponse = actor
            .browse()
            .waitForResponse(
              (r: Response) =>
                r.url().match(RolesSecurityPageTargets.deleteRolePathRegex) !== null && r.status() === 200
            );
          await actor.browse().click(DeleteDialogTargets.deleteButton);
          await deleteResponse;
          await actor.browse().waitForDetached(DeleteDialogTargets.dialog);
        }
      }
    },
};
