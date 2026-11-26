import { Response } from '@playwright/test';
import { TEST_USER_NAME, User, UserStatus } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { Retry, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { KendoGridTasks } from '../common/controls/kendoGrid.js';
import { ReferenceFieldGrid } from '../common/controls/referenceFieldGrid.js';
import { DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AdminNavTargets, AdminTileTargets } from '../common/navs/adminNav.targets.js';
import { AddUserPageTargets, CopyUserPageTargets, EditUserPageTargets, UsersPageTargets } from './users.targets.js';

async function fillAndSaveNewUser(actor: WebActor, user: User): Promise<void> {
  await actor.browse().type(AddUserPageTargets.firstNameInput, user.firstName);
  await actor.browse().type(AddUserPageTargets.lastNameInput, user.lastName);
  await actor.browse().type(AddUserPageTargets.usernameInput, user.username);
  await actor.browse().type(AddUserPageTargets.emailInput, user.email);
  await actor.browse().click(AddUserPageTargets.statusButton(user.status));

  if (user.roles.length > 0 || user.sysAdmin) {
    await actor.browse().click(AddUserPageTargets.securityTabButton);

    for (const roleName of user.roles) {
      await actor.attemptsTo(
        ReferenceFieldGrid.selectRecord({
          gridTarget: AddUserPageTargets.securityTab.rolesReferenceGrid.control,
          searchTerm: roleName,
          controlType: 'checkbox',
        })
      );
    }

    await actor.browse().setChecked(AddUserPageTargets.securityTab.sysAdminCheckbox, user.sysAdmin);
  }

  const saveResponse = actor
    .browse()
    .waitForResponse((r: Response) => EditUserPageTargets.pathRegex.test(r.url()) && r.status() === 200);
  await actor.browse().click(AddUserPageTargets.saveRecordButton);
  await saveResponse;
  await actor.browse().waitForUrl(EditUserPageTargets.pathRegex);
  await actor.browse().waitForLoadState();
}

export const UserTasks = {
  goto:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const getUsersResponse = actor
        .browse()
        .waitForResponse((r: Response) => r.url().includes(UsersPageTargets.getUsersPath) && r.status() === 200);
      await actor.browse().goto(UsersPageTargets.route);
      await getUsersResponse;
    },

  create:
    (user: User): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(AddUserPageTargets.route);
      await actor.browse().click(AddUserPageTargets.generalTabButton);
      await fillAndSaveNewUser(actor, user);
    },

  createViaHeader:
    (user: User): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('User'));
      await fillAndSaveNewUser(actor, user);
    },

  createViaSecurityTile:
    (user: User): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminTileTargets.securityTileLink);
      await actor.browse().check(AdminTileTargets.securityTileCreateButton).isVisible();
      await actor.browse().click(AdminTileTargets.securityTileCreateButton);

      await actor.browse().check(AdminTileTargets.securityCreateMenu).isVisible();
      await actor.browse().click(AdminTileTargets.securityMenuOption('User'));
      await fillAndSaveNewUser(actor, user);
    },

  createFromGrid:
    (user: User): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(UserTasks.goto());
      await actor.browse().click(UsersPageTargets.createUserButton);
      await fillAndSaveNewUser(actor, user);
    },

  copy:
    (sourceUsername: string, copiedUsername: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(UserTasks.goto());
      const row = UsersPageTargets.rowByName(sourceUsername);
      await actor.browse().hover(row);
      await actor.browse().click(UsersPageTargets.copyButtonInRow(sourceUsername));

      await actor.browse().waitForUrl(CopyUserPageTargets.pathRegex);
      await actor.browse().type(CopyUserPageTargets.generalTab.usernameInput, copiedUsername);

      const saveResponse = actor
        .browse()
        .waitForResponse((r: Response) => EditUserPageTargets.pathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().click(CopyUserPageTargets.saveRecordButton);
      await saveResponse;
      await actor.browse().waitForUrl(EditUserPageTargets.pathRegex);
    },

  updateStatus:
    (status: UserStatus): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(EditUserPageTargets.generalTab.statusButton(status));

      const saveResponse = actor
        .browse()
        .waitForResponse((r: Response) => EditUserPageTargets.pathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().click(EditUserPageTargets.saveRecordButton);
      await saveResponse;
    },

  changePassword:
    (password: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(EditUserPageTargets.securityTabButton);
      await actor.browse().click(EditUserPageTargets.securityTab.changePasswordLink);

      const dialog = EditUserPageTargets.securityTab.changePasswordDialog;
      await actor.browse().waitForState(dialog.newPasswordInput, 'visible');
      await actor.browse().fill(dialog.newPasswordInput, password);
      await actor.browse().fill(dialog.verifyPasswordInput, password);
      await actor.browse().blur(dialog.verifyPasswordInput);
      await actor.attemptsTo(
        Retry.until(
          async a => {
            if (await a.browse().isVisible(dialog.saveButton)) {
              await a.browse().click(dialog.saveButton);
            }
            await a.browse().waitForState(dialog.saveButton, 'hidden', { timeout: 3000 });
          },
          { intervals: [500, 1000], timeout: 30_000 }
        )
      );

      const saveResponse = actor
        .browse()
        .waitForResponse((r: Response) => EditUserPageTargets.pathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().click(EditUserPageTargets.saveRecordButton);
      await saveResponse;
    },

  assignRole:
    (roleName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(EditUserPageTargets.securityTabButton);
      await actor.attemptsTo(
        ReferenceFieldGrid.selectRecord({
          gridTarget: EditUserPageTargets.securityTab.rolesReferenceGrid.control,
          searchTerm: roleName,
          controlType: 'checkbox',
        })
      );

      const saveResponse = actor
        .browse()
        .waitForResponse((r: Response) => EditUserPageTargets.pathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().click(EditUserPageTargets.saveRecordButton);
      await saveResponse;
    },

  assignGroup:
    (groupName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(EditUserPageTargets.securityTabButton);
      await actor.attemptsTo(
        ReferenceFieldGrid.selectRecord({
          gridTarget: EditUserPageTargets.securityTab.groupsReferenceGrid.control,
          searchTerm: groupName,
          controlType: 'checkbox',
        })
      );

      const saveResponse = actor
        .browse()
        .waitForResponse((r: Response) => EditUserPageTargets.pathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().click(EditUserPageTargets.saveRecordButton);
      await saveResponse;
    },

  deleteUsers:
    (usernames: string[]): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      if (usernames.length === 0) return;

      await actor.attemptsTo(
        UserTasks.goto(),
        KendoGridTasks.scrollAllIntoView({
          grid: UsersPageTargets.userGrid,
          getListPagePath: UsersPageTargets.getUsersPath,
        })
      );

      for (const username of usernames) {
        const row = UsersPageTargets.rowByName(username);
        const isVisible = await actor.browse().isVisible(row);
        if (isVisible) {
          await actor.browse().hover(row);
          await actor.browse().click(UsersPageTargets.deleteButtonInRow(username));
          const deleteResponse = actor
            .browse()
            .waitForResponse((r: Response) => UsersPageTargets.deleteUserPathRegex.test(r.url()) && r.status() === 200);
          await actor.browse().click(DeleteDialogTargets.deleteButton);
          await deleteResponse;
          await actor.browse().waitForDetached(DeleteDialogTargets.dialog);
        }
      }
    },

  deleteAllTestUsers:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(
        UserTasks.goto(),
        KendoGridTasks.deleteAllMatchingRows({
          grid: UsersPageTargets.userGrid,
          rowName: new RegExp(TEST_USER_NAME, 'i'),
          deleteButtonTitle: 'Delete User',
          deleteResponseMatcher: (url: string) => UsersPageTargets.deleteUserPathRegex.test(url),
          getListPagePath: UsersPageTargets.getUsersPath,
          pick: 'last',
        })
      );
    },
};
