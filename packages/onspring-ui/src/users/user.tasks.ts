import { User, UserStatus } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ReferenceFieldGridControl } from '../common/controls/referenceFieldGrid.js';
import { DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AdminNavTargets, AdminTileTargets } from '../common/navs/adminNav.targets.js';
import {
  AddUserPageTargets,
  CopyUserPageTargets,
  EditUserPageTargets,
  UsersPageTargets,
} from './users.targets.js';

export const UserTasks = {
  goto: (): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    const getUsersResponse = actor.page.waitForResponse(
      r => r.url().includes(UsersPageTargets.getUsersPath) && r.status() === 200
    );
    await actor.browse().goto(UsersPageTargets.route);
    await getUsersResponse;
  },

  create: (user: User): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().goto(AddUserPageTargets.route);
    await actor.browse().click(AddUserPageTargets.generalTabButton);

    await actor.browse().type(AddUserPageTargets.firstNameInput, user.firstName);
    await actor.browse().type(AddUserPageTargets.lastNameInput, user.lastName);
    await actor.browse().type(AddUserPageTargets.usernameInput, user.username);
    await actor.browse().type(AddUserPageTargets.emailInput, user.email);
    await actor.browse().click(AddUserPageTargets.statusButton(user.status));

    const saveResponse = actor.page.waitForResponse(
      r => EditUserPageTargets.pathRegex.test(r.url()) && r.status() === 200
    );
    await actor.browse().click(AddUserPageTargets.saveRecordButton);
    await saveResponse;
    await actor.page.waitForURL(EditUserPageTargets.pathRegex);
  },

  createViaHeader: (user: User): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().hover(AdminNavTargets.adminCreateButton);
    await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
    await actor.browse().click(AdminNavTargets.menuOption('User'));

    await actor.browse().type(AddUserPageTargets.firstNameInput, user.firstName);
    await actor.browse().type(AddUserPageTargets.lastNameInput, user.lastName);
    await actor.browse().type(AddUserPageTargets.usernameInput, user.username);
    await actor.browse().type(AddUserPageTargets.emailInput, user.email);
    await actor.browse().click(AddUserPageTargets.statusButton(user.status));

    const saveResponse = actor.page.waitForResponse(
      r => EditUserPageTargets.pathRegex.test(r.url()) && r.status() === 200
    );
    await actor.browse().click(AddUserPageTargets.saveRecordButton);
    await saveResponse;
    await actor.page.waitForURL(EditUserPageTargets.pathRegex);
  },

  createViaSecurityTile: (user: User): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().hover(AdminTileTargets.securityTileLink);
    await actor.browse().check(AdminTileTargets.securityTileCreateButton).isVisible();
    await actor.browse().click(AdminTileTargets.securityTileCreateButton);

    await actor.browse().check(AdminTileTargets.securityCreateMenu).isVisible();
    await actor.browse().click(AdminTileTargets.securityMenuOption('User'));

    await actor.browse().type(AddUserPageTargets.firstNameInput, user.firstName);
    await actor.browse().type(AddUserPageTargets.lastNameInput, user.lastName);
    await actor.browse().type(AddUserPageTargets.usernameInput, user.username);
    await actor.browse().type(AddUserPageTargets.emailInput, user.email);
    await actor.browse().click(AddUserPageTargets.statusButton(user.status));

    const saveResponse = actor.page.waitForResponse(
      r => EditUserPageTargets.pathRegex.test(r.url()) && r.status() === 200
    );
    await actor.browse().click(AddUserPageTargets.saveRecordButton);
    await saveResponse;
    await actor.page.waitForURL(EditUserPageTargets.pathRegex);
  },

  createFromGrid: (user: User): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.attemptsTo(UserTasks.goto());
    await actor.browse().click(UsersPageTargets.createUserButton);

    await actor.browse().type(AddUserPageTargets.firstNameInput, user.firstName);
    await actor.browse().type(AddUserPageTargets.lastNameInput, user.lastName);
    await actor.browse().type(AddUserPageTargets.usernameInput, user.username);
    await actor.browse().type(AddUserPageTargets.emailInput, user.email);
    await actor.browse().click(AddUserPageTargets.statusButton(user.status));

    const saveResponse = actor.page.waitForResponse(
      r => EditUserPageTargets.pathRegex.test(r.url()) && r.status() === 200
    );
    await actor.browse().click(AddUserPageTargets.saveRecordButton);
    await saveResponse;
    await actor.page.waitForURL(EditUserPageTargets.pathRegex);
  },

  copy: (sourceUsername: string, copiedUsername: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.attemptsTo(UserTasks.goto());
    const row = UsersPageTargets.rowByName(sourceUsername);
    await actor.browse().hover(row);
    await actor.browse().click(UsersPageTargets.copyButtonInRow(sourceUsername));

    await actor.page.waitForURL(CopyUserPageTargets.pathRegex);
    await actor.browse().type(CopyUserPageTargets.generalTab.usernameInput, copiedUsername);

    const saveResponse = actor.page.waitForResponse(
      r => EditUserPageTargets.pathRegex.test(r.url()) && r.status() === 200
    );
    await actor.browse().click(CopyUserPageTargets.saveRecordButton);
    await saveResponse;
    await actor.page.waitForURL(EditUserPageTargets.pathRegex);
  },

  updateStatus: (status: UserStatus): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(EditUserPageTargets.generalTab.statusButton(status));

    const saveResponse = actor.page.waitForResponse(
      r => EditUserPageTargets.pathRegex.test(r.url()) && r.status() === 200
    );
    await actor.browse().click(EditUserPageTargets.saveRecordButton);
    await saveResponse;
  },

  assignRole: (roleName: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(EditUserPageTargets.securityTabButton);
    await ReferenceFieldGridControl.selectRecord(
      EditUserPageTargets.securityTab.rolesReferenceGrid.control(actor.page),
      roleName,
      'checkbox'
    );

    const saveResponse = actor.page.waitForResponse(
      r => EditUserPageTargets.pathRegex.test(r.url()) && r.status() === 200
    );
    await actor.browse().click(EditUserPageTargets.saveRecordButton);
    await saveResponse;
  },

  assignGroup: (groupName: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(EditUserPageTargets.securityTabButton);
    await ReferenceFieldGridControl.selectRecord(
      EditUserPageTargets.securityTab.groupsReferenceGrid.control(actor.page),
      groupName,
      'checkbox'
    );

    const saveResponse = actor.page.waitForResponse(
      r => EditUserPageTargets.pathRegex.test(r.url()) && r.status() === 200
    );
    await actor.browse().click(EditUserPageTargets.saveRecordButton);
    await saveResponse;
  },

  deleteUsers: (usernames: string[]): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    if (usernames.length === 0) return;

    await actor.attemptsTo(UserTasks.goto());

    for (const username of usernames) {
      const row = UsersPageTargets.rowByName(username);
      const isVisible = await actor.browse().isVisible(row);
      if (isVisible) {
        await actor.browse().hover(row);
        await actor.browse().click(UsersPageTargets.deleteButtonInRow(username));
        const deleteResponse = actor.page.waitForResponse(
          r => UsersPageTargets.deleteUserPathRegex.test(r.url()) && r.status() === 200
        );
        await actor.browse().click(DeleteDialogTargets.deleteButton);
        await deleteResponse;
        await actor.browse().waitForDetached(DeleteDialogTargets.dialog);
      }
    }
  },
};
