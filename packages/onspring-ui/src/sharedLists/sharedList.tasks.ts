import { Response } from '@playwright/test';
import { SharedList, TEST_LIST_NAME } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { KendoGridTasks } from '../common/controls/kendoGrid.js';
import { StatusSwitchTasks } from '../common/controls/statusSwitch.js';
import { CreateDialogTargets, DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AdminNavTargets, AdminTileTargets } from '../common/navs/adminNav.targets.js';
import { EditSharedListPageTargets, SharedListsPageTargets } from './sharedLists.targets.js';

export const SharedListTasks = {
  goto:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const getSharedListsResponse = actor
        .browse()
        .waitForResponse((r: Response) => r.url().includes(SharedListsPageTargets.getListPath) && r.status() === 200);
      await actor.browse().goto(SharedListsPageTargets.route);
      await getSharedListsResponse;
    },

  create:
    (listName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(SharedListTasks.goto());
      await actor.browse().click(SharedListsPageTargets.createListButton);

      await actor.browse().type(CreateDialogTargets.nameInput, listName);

      const saveResponse = actor
        .browse()
        .waitForResponse((r: Response) => EditSharedListPageTargets.pathRegex.test(r.url()));
      await actor.browse().click(CreateDialogTargets.saveButton);
      await saveResponse;
      await actor.browse().waitForUrl(EditSharedListPageTargets.pathRegex);
    },

  createViaHeader:
    (listName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('List'));

      await actor.browse().type(CreateDialogTargets.nameInput, listName);

      const saveResponse = actor
        .browse()
        .waitForResponse((r: Response) => EditSharedListPageTargets.pathRegex.test(r.url()));
      await actor.browse().click(CreateDialogTargets.saveButton);
      await saveResponse;
      await actor.browse().waitForUrl(EditSharedListPageTargets.pathRegex);
    },

  createViaTile:
    (listName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminTileTargets.listTileLink);
      await actor.browse().check(AdminTileTargets.listTileCreateButton).isVisible();
      await actor.browse().click(AdminTileTargets.listTileCreateButton);

      await actor.browse().type(CreateDialogTargets.nameInput, listName);

      const saveResponse = actor
        .browse()
        .waitForResponse((r: Response) => EditSharedListPageTargets.pathRegex.test(r.url()));
      await actor.browse().click(CreateDialogTargets.saveButton);
      await saveResponse;
      await actor.browse().waitForUrl(EditSharedListPageTargets.pathRegex);
    },

  copyViaHeader:
    (sourceListName: string, copiedListName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('List'));

      await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(sourceListName));
      await actor.browse().type(CreateDialogTargets.nameInput, copiedListName);

      const saveResponse = actor
        .browse()
        .waitForResponse((r: Response) => EditSharedListPageTargets.pathRegex.test(r.url()));
      await actor.browse().click(CreateDialogTargets.saveButton);
      await saveResponse;
      await actor.browse().waitForUrl(EditSharedListPageTargets.pathRegex);
    },

  copyViaTile:
    (sourceListName: string, copiedListName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminTileTargets.listTileLink);
      await actor.browse().check(AdminTileTargets.listTileCreateButton).isVisible();
      await actor.browse().click(AdminTileTargets.listTileCreateButton);

      await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(sourceListName));
      await actor.browse().type(CreateDialogTargets.nameInput, copiedListName);

      const saveResponse = actor
        .browse()
        .waitForResponse((r: Response) => EditSharedListPageTargets.pathRegex.test(r.url()));
      await actor.browse().click(CreateDialogTargets.saveButton);
      await saveResponse;
      await actor.browse().waitForUrl(EditSharedListPageTargets.pathRegex);
    },

  copyFromGrid:
    (sourceListName: string, copiedListName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(SharedListTasks.goto());
      await actor.browse().click(SharedListsPageTargets.createListButton);

      await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(sourceListName));
      await actor.browse().type(CreateDialogTargets.nameInput, copiedListName);

      const saveResponse = actor
        .browse()
        .waitForResponse((r: Response) => EditSharedListPageTargets.pathRegex.test(r.url()));
      await actor.browse().click(CreateDialogTargets.saveButton);
      await saveResponse;
      await actor.browse().waitForUrl(EditSharedListPageTargets.pathRegex);
    },

  update:
    (list: SharedList): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(EditSharedListPageTargets.generalTabButton);
      await actor.browse().type(EditSharedListPageTargets.generalTab.nameInput, list.name);
      await actor.browse().type(EditSharedListPageTargets.generalTab.descriptionEditor, list.description);

      await actor.attemptsTo(
        StatusSwitchTasks.setAriaSwitch({
          switchTarget: EditSharedListPageTargets.generalTab.statusSwitch,
          toggleTarget: EditSharedListPageTargets.generalTab.statusToggle,
          enabled: list.status,
        })
      );

      const saveResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => EditSharedListPageTargets.pathRegex.test(r.url()) && r.request().method() === 'POST'
        );
      await actor.browse().click(EditSharedListPageTargets.saveChangesButton);
      await saveResponse;
    },

  deleteLists:
    (listNames: string[]): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      if (listNames.length === 0) return;

      await actor.attemptsTo(SharedListTasks.goto());

      for (const listName of listNames) {
        const listRow = SharedListsPageTargets.rowByName(listName);
        const isVisible = await actor.browse().isVisible(listRow);
        if (isVisible) {
          await actor.browse().hover(listRow);
          await actor.browse().click(SharedListsPageTargets.deleteButtonInRow(listName));

          const deleteResponse = actor
            .browse()
            .waitForResponse(
              (r: Response) => SharedListsPageTargets.deleteListPathRegex.test(r.url()) && r.status() === 200
            );
          await actor.browse().click(DeleteDialogTargets.deleteButton);
          await deleteResponse;
          await actor.browse().waitForDetached(DeleteDialogTargets.dialog);
        }
      }
    },

  deleteAllTestLists:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(
        SharedListTasks.goto(),
        KendoGridTasks.deleteAllMatchingRows({
          grid: SharedListsPageTargets.listsGrid,
          rowName: new RegExp(TEST_LIST_NAME, 'i'),
          deleteButtonTitle: 'Delete List',
          deleteResponseMatcher: (url: string) => SharedListsPageTargets.deleteListPathRegex.test(url),
          getListPagePath: SharedListsPageTargets.getListPath,
          pick: 'last',
        })
      );
    },
};
