import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AddGroupPageTargets, EditGroupPageTargets, GroupsPageTargets } from './groups.targets.js';

export const GroupTasks = {
  goto: (): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    const getGroupsResponse = actor.page.waitForResponse(
      r => r.url().includes(GroupsPageTargets.getGroupsPath) && r.status() === 200
    );
    await actor.browse().goto(GroupsPageTargets.route);
    await getGroupsResponse;
  },

  create: (groupName: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().goto(AddGroupPageTargets.route);
    await actor.browse().type(AddGroupPageTargets.nameInput, groupName);

    const saveResponse = actor.page.waitForResponse(
      r => EditGroupPageTargets.pathRegex.test(r.url()) && r.status() === 200
    );
    await actor.browse().click(AddGroupPageTargets.saveRecordButton);
    await saveResponse;
    await actor.page.waitForURL(EditGroupPageTargets.pathRegex);
  },

  deleteGroups: (groupNames: string[]): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    if (groupNames.length === 0) return;

    await actor.attemptsTo(GroupTasks.goto());

    for (const groupName of groupNames) {
      const row = GroupsPageTargets.rowByName(groupName);
      const isVisible = await actor.browse().isVisible(row);
      if (isVisible) {
        await actor.browse().hover(row);
        await actor.browse().click(GroupsPageTargets.deleteButtonInRow(groupName));
        const deleteResponse = actor.page.waitForResponse(
          r => GroupsPageTargets.deleteGroupPathRegex.test(r.url()) && r.status() === 200
        );
        await actor.browse().click(DeleteDialogTargets.deleteButton);
        await deleteResponse;
        await actor.browse().waitForDetached(DeleteDialogTargets.dialog);
      }
    }
  },
};
