import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AdminNavTargets, AdminTileTargets } from '../common/navs/adminNav.targets.js';
import {
  AddGroupPageTargets,
  CopyGroupPageTargets,
  EditGroupPageTargets,
  GroupsPageTargets,
} from './groups.targets.js';

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

  createViaHeader: (groupName: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().hover(AdminNavTargets.adminCreateButton);
    await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
    await actor.browse().click(AdminNavTargets.menuOption('Group'));

    await actor.browse().type(AddGroupPageTargets.nameInput, groupName);

    const saveResponse = actor.page.waitForResponse(
      r => EditGroupPageTargets.pathRegex.test(r.url()) && r.status() === 200
    );
    await actor.browse().click(AddGroupPageTargets.saveRecordButton);
    await saveResponse;
    await actor.page.waitForURL(EditGroupPageTargets.pathRegex);
  },

  createViaSecurityTile: (groupName: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().hover(AdminTileTargets.securityTileLink);
    await actor.browse().check(AdminTileTargets.securityTileCreateButton).isVisible();
    await actor.browse().click(AdminTileTargets.securityTileCreateButton);

    await actor.browse().check(AdminTileTargets.securityCreateMenu).isVisible();
    await actor.browse().click(AdminTileTargets.securityMenuOption('Group'));

    await actor.browse().type(AddGroupPageTargets.nameInput, groupName);

    const saveResponse = actor.page.waitForResponse(
      r => EditGroupPageTargets.pathRegex.test(r.url()) && r.status() === 200
    );
    await actor.browse().click(AddGroupPageTargets.saveRecordButton);
    await saveResponse;
    await actor.page.waitForURL(EditGroupPageTargets.pathRegex);
  },

  createFromGrid: (groupName: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.attemptsTo(GroupTasks.goto());
    await actor.browse().click(GroupsPageTargets.createGroupButton);

    await actor.browse().type(AddGroupPageTargets.nameInput, groupName);

    const saveResponse = actor.page.waitForResponse(
      r => EditGroupPageTargets.pathRegex.test(r.url()) && r.status() === 200
    );
    await actor.browse().click(AddGroupPageTargets.saveRecordButton);
    await saveResponse;
    await actor.page.waitForURL(EditGroupPageTargets.pathRegex);
  },

  copy: (sourceGroupName: string, copiedGroupName: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.attemptsTo(GroupTasks.goto());
    const row = GroupsPageTargets.rowByName(sourceGroupName);
    await actor.browse().hover(row);
    await actor.browse().click(GroupsPageTargets.copyButtonInRow(sourceGroupName));

    await actor.page.waitForURL(CopyGroupPageTargets.pathRegex);
    await actor.browse().type(CopyGroupPageTargets.nameInput, copiedGroupName);

    const saveResponse = actor.page.waitForResponse(
      r => EditGroupPageTargets.pathRegex.test(r.url()) && r.status() === 200
    );
    await actor.browse().click(CopyGroupPageTargets.saveRecordButton);
    await saveResponse;
    await actor.page.waitForURL(EditGroupPageTargets.pathRegex);
  },

  updateDescription: (description: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().type(EditGroupPageTargets.descriptionEditor, description);

    const saveResponse = actor.page.waitForResponse(
      r => EditGroupPageTargets.pathRegex.test(r.url()) && r.status() === 200
    );
    await actor.browse().click(EditGroupPageTargets.saveRecordButton);
    await saveResponse;
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
