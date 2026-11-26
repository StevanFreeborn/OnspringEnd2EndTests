import { Response } from '@playwright/test';
import { TEST_DATA_IMPORT_NAME } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { KendoGridTasks } from '../common/controls/kendoGrid.js';
import { CreateDialogTargets, DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AdminNavTargets, AdminTileTargets } from '../common/navs/adminNav.targets.js';
import { DataImportsPageTargets, EditDataImportPageTargets } from './dataImports.targets.js';

async function fillCreateDialogAndSave(actor: WebActor, name: string): Promise<void> {
  await actor.browse().waitForState(CreateDialogTargets.nameInput, 'visible');
  await actor.browse().fill(CreateDialogTargets.nameInput, name);
  const navPromise = actor.browse().waitForUrl(EditDataImportPageTargets.pathRegex);
  await actor.browse().click(CreateDialogTargets.saveButton);
  await navPromise;
}

async function fillCopyDialogAndSave(actor: WebActor, toCopyName: string, copyName: string): Promise<void> {
  await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
  await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
  await actor.browse().click(CreateDialogTargets.copyFromDropdown);
  await actor.browse().click(CreateDialogTargets.optionToCopy(toCopyName));
  await actor.browse().fill(CreateDialogTargets.nameInput, copyName);
  const navPromise = actor.browse().waitForUrl(EditDataImportPageTargets.pathRegex);
  await actor.browse().click(CreateDialogTargets.saveButton);
  await navPromise;
}

async function postAndSaveImport(actor: WebActor, linkTarget: Target): Promise<void> {
  const saveResponse = actor
    .browse()
    .waitForResponse(
      (r: Response) =>
        EditDataImportPageTargets.pathRegex.test(r.url()) && r.request().method() === 'POST' && r.status() === 200
    );
  await actor.browse().click(linkTarget);
  await saveResponse;
}

export const DataImportTasks = {
  goto:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const getImportsResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => r.url().includes(DataImportsPageTargets.getImportsPath) && r.status() === 200
        );
      await actor.browse().goto(DataImportsPageTargets.route);
      await getImportsResponse;
    },

  gotoEdit:
    (id: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(EditDataImportPageTargets.route(id));
    },

  scrollAllIntoView: (): Task<WebActor> =>
    KendoGridTasks.scrollAllIntoView({
      grid: DataImportsPageTargets.grid,
      getListPagePath: DataImportsPageTargets.getImportsPath,
    }),

  create:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(DataImportsPageTargets.createImportButton);
      await fillCreateDialogAndSave(actor, name);
    },

  createCopy:
    (toCopyName: string, copyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(DataImportsPageTargets.createImportButton);
      await fillCopyDialogAndSave(actor, toCopyName, copyName);
    },

  createViaHeader:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('Import Configuration'));
      await fillCreateDialogAndSave(actor, name);
    },

  createCopyViaHeader:
    (toCopyName: string, copyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('Import Configuration'));
      await fillCopyDialogAndSave(actor, toCopyName, copyName);
    },

  createViaTile:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminTileTargets.integrationTileLink);
      await actor.browse().check(AdminTileTargets.integrationTileCreateButton).isVisible();
      await actor.browse().click(AdminTileTargets.integrationTileCreateButton);
      await actor.browse().check(AdminTileTargets.integrationCreateMenu).isVisible();
      await actor.browse().click(AdminTileTargets.integrationMenuOption('Import Configuration'));
      await fillCreateDialogAndSave(actor, name);
    },

  createCopyViaTile:
    (toCopyName: string, copyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminTileTargets.integrationTileLink);
      await actor.browse().check(AdminTileTargets.integrationTileCreateButton).isVisible();
      await actor.browse().click(AdminTileTargets.integrationTileCreateButton);
      await actor.browse().check(AdminTileTargets.integrationCreateMenu).isVisible();
      await actor.browse().click(AdminTileTargets.integrationMenuOption('Import Configuration'));
      await fillCopyDialogAndSave(actor, toCopyName, copyName);
    },

  updateName:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().fill(EditDataImportPageTargets.dataFileTab.nameInput, name);
    },

  selectTargetApp:
    (appName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(EditDataImportPageTargets.dataFileTab.targetAppSelect);
      await actor.browse().click(EditDataImportPageTargets.optionByName(appName));
    },

  uploadImportFile:
    (filePath: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().uploadViaFileChooser(EditDataImportPageTargets.dataFileTab.addNewFileLink, filePath, {
        waitForResponseUrl: (r: Response) =>
          r.url().includes(EditDataImportPageTargets.saveImportFilePath) && r.status() === 200,
      });
    },

  openDataMappingTab:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(EditDataImportPageTargets.dataMappingTabButton);
    },

  save:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await postAndSaveImport(actor, EditDataImportPageTargets.saveChangesLink);
    },

  saveAndRun:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await postAndSaveImport(actor, EditDataImportPageTargets.saveChangesAndRunLink);
      await actor.browse().waitForState(EditDataImportPageTargets.runImportConfirmButton, 'visible');
      await actor.browse().click(EditDataImportPageTargets.runImportConfirmButton);
    },

  delete:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(DataImportTasks.scrollAllIntoView());

      const row = DataImportsPageTargets.rowByName(name);
      const isVisible = await actor.browse().isVisible(row);

      if (!isVisible) {
        return;
      }

      await actor.browse().hover(row);
      await actor.browse().click(DataImportsPageTargets.deleteButtonInRow(name));
      await actor.browse().check(DeleteDialogTargets.deleteButton).isVisible();

      const deleteResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => DataImportsPageTargets.deleteImportPathRegex.test(r.url()) && r.status() === 200
        );
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await deleteResponse;

      await actor.browse().waitForDetached(DeleteDialogTargets.dialog, DeleteDialogTargets.overlay);
      await actor.browse().check(row).isHidden();
    },

  deleteDataImports:
    (names: string[]): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const uniqueNames = [...new Set(names)];

      if (uniqueNames.length === 0) {
        return;
      }

      await actor.attemptsTo(DataImportTasks.goto());

      for (const name of uniqueNames) {
        await actor.attemptsTo(DataImportTasks.delete(name));
      }
    },

  deleteAllTestImports:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(
        DataImportTasks.goto(),
        KendoGridTasks.deleteAllMatchingRows({
          grid: DataImportsPageTargets.grid,
          rowName: new RegExp(TEST_DATA_IMPORT_NAME, 'i'),
          deleteButtonTitle: 'Delete Import Configuration',
          deleteResponseMatcher: (url: string) => DataImportsPageTargets.deleteImportPathRegex.test(url),
          getListPagePath: DataImportsPageTargets.getImportsPath,
          pick: 'last',
        })
      );
    },
};
