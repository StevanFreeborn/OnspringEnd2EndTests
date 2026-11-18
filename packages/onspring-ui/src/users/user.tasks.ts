import { User, UserStatus } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AddUserPageTargets, EditUserPageTargets, UsersPageTargets } from './users.targets.js';

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

    switch (user.status) {
      case UserStatus.Active:
        await actor.browse().click(AddUserPageTargets.activeStatusButton);
        break;
      case UserStatus.Inactive:
        await actor.browse().click(AddUserPageTargets.inactiveStatusButton);
        break;
      case UserStatus.Locked:
        await actor.browse().click(AddUserPageTargets.lockedStatusButton);
        break;
      default:
        break;
    }

    const saveResponse = actor.page.waitForResponse(
      r => EditUserPageTargets.pathRegex.test(r.url()) && r.status() === 200
    );
    await actor.browse().click(AddUserPageTargets.saveRecordButton);
    await saveResponse;
    await actor.page.waitForURL(EditUserPageTargets.pathRegex);
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
