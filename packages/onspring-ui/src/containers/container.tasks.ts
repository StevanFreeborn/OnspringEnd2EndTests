import { Response } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AdminNavTargets, AdminTileTargets } from '../common/navs/adminNav.targets.js';
import {
  AddContainerPageTargets,
  ContainersPageTargets,
  CopyContainerPageTargets,
  EditContainerPageTargets,
} from './containers.targets.js';

export const ContainerTasks = {
  goto: (): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    const getListPageResponse = actor.browse().waitForResponse(
      (r: Response) => r.url().includes(ContainersPageTargets.getListPagePath) && r.status() === 200
    );
    await actor.browse().goto(ContainersPageTargets.route);
    await getListPageResponse;
  },

  create:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(ContainerTasks.goto());
      await actor.browse().click(ContainersPageTargets.createContainerButton);
      await actor.browse().waitForUrl(AddContainerPageTargets.pathRegex);

      await actor.browse().type(AddContainerPageTargets.nameInput, name);
      await actor.browse().click(AddContainerPageTargets.saveChangesButton);
      await actor.browse().waitForUrl(EditContainerPageTargets.pathRegex);
    },

  createViaHeader:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('Container'));
      await actor.browse().waitForUrl(AddContainerPageTargets.pathRegex);

      await actor.browse().type(AddContainerPageTargets.nameInput, name);
      await actor.browse().click(AddContainerPageTargets.saveChangesButton);
      await actor.browse().waitForUrl(EditContainerPageTargets.pathRegex);
    },

  createViaTile:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminTileTargets.dashboardTileLink);
      await actor.browse().check(AdminTileTargets.dashboardTileCreateButton).isVisible();
      await actor.browse().click(AdminTileTargets.dashboardTileCreateButton);
      await actor.browse().check(AdminTileTargets.dashboardCreateMenu).isVisible();
      await actor.browse().click(AdminTileTargets.dashboardMenuOption('Container'));
      await actor.browse().waitForUrl(AddContainerPageTargets.pathRegex);

      await actor.browse().type(AddContainerPageTargets.nameInput, name);
      await actor.browse().click(AddContainerPageTargets.saveChangesButton);
      await actor.browse().waitForUrl(EditContainerPageTargets.pathRegex);
    },

  copy:
    (containerToCopy: string, newContainerName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(ContainerTasks.goto());
      const row = ContainersPageTargets.rowByName(containerToCopy);
      await actor.browse().hover(row);
      await actor.browse().click(ContainersPageTargets.copyButtonInRow(containerToCopy));
      await actor.browse().waitForUrl(CopyContainerPageTargets.pathRegex);

      await actor.browse().type(CopyContainerPageTargets.nameInput, newContainerName);
      await actor.browse().click(CopyContainerPageTargets.saveChangesButton);
      await actor.browse().waitForUrl(EditContainerPageTargets.pathRegex);
    },

  updateName:
    (newName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().type(EditContainerPageTargets.nameInput, newName);

      const saveResponse = actor.browse().waitForResponse(
        (r: Response) =>
          EditContainerPageTargets.pathRegex.test(r.url()) && r.request().method() === 'POST' && r.status() === 200
      );
      await actor.browse().click(EditContainerPageTargets.saveChangesButton);
      await saveResponse;
    },

  deleteContainers:
    (names: string[]): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      if (names.length === 0) return;

      await actor.attemptsTo(ContainerTasks.goto());

      for (const name of names) {
        const row = ContainersPageTargets.rowByName(name);
        const isVisible = await actor.browse().isVisible(row);
        if (isVisible) {
          await actor.browse().hover(row);
          await actor.browse().click(ContainersPageTargets.deleteButtonInRow(name));

          const deleteResponse = actor.browse().waitForResponse(
            (r: Response) => ContainersPageTargets.deleteContainerPathRegex.test(r.url()) && r.status() === 200
          );
          await actor.browse().click(DeleteDialogTargets.deleteButton);
          await deleteResponse;
          await actor.browse().waitForDetached(DeleteDialogTargets.dialog);
        }
      }
    },
};
