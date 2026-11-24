import { Response } from '@playwright/test';
import { DynamicDocument } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { AppDocumentsTabTargets } from '../apps/apps.targets.js';
import { DualPaneSelector } from '../common/controls/dualPaneSelector.js';
import { KendoGridTasks } from '../common/controls/kendoGrid.js';
import { StatusSwitchTasks } from '../common/controls/statusSwitch.js';
import { CreateDialogTargets, DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AdminNavTargets, AdminTileTargets } from '../common/navs/adminNav.targets.js';
import { DynamicDocumentAdminPageTargets, EditDynamicDocumentPageTargets } from './dynamicDocuments.targets.js';

async function selectCreateDialogApp(actor: WebActor, appName: string): Promise<void> {
  await actor.browse().click(CreateDialogTargets.appSelect);
  await actor.browse().click(CreateDialogTargets.appOption(appName));
}

async function fillCreateDialogAndSave(actor: WebActor, documentName: string, documentToCopy?: string): Promise<void> {
  if (documentToCopy !== undefined) {
    await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
    await actor.browse().click(CreateDialogTargets.copyFromDropdown);
    await actor.browse().click(CreateDialogTargets.optionToCopy(documentToCopy));
  }

  await actor.browse().fill(CreateDialogTargets.nameInput, documentName);
  const navPromise = actor.browse().waitForUrl(EditDynamicDocumentPageTargets.pathRegex);
  await actor.browse().click(CreateDialogTargets.saveButton);
  await navPromise;
}

async function openHeaderCreateDialog(actor: WebActor): Promise<void> {
  await actor.browse().hover(AdminNavTargets.adminCreateButton);
  await actor.browse().waitForState(AdminNavTargets.adminCreateMenu, 'visible');
  await actor.browse().click(AdminNavTargets.menuOption('Document'));
}

async function openDocumentsTileCreateDialog(actor: WebActor): Promise<void> {
  await actor.browse().hover(AdminTileTargets.documentTileLink);
  await actor.browse().waitForState(AdminTileTargets.documentTileCreateButton, 'visible');
  await actor.browse().click(AdminTileTargets.documentTileCreateButton);
}

async function openRowForEdit(actor: WebActor, row: Target, editButton: Target): Promise<void> {
  await actor.browse().hover(row);
  const navPromise = actor.browse().waitForUrl(EditDynamicDocumentPageTargets.pathRegex);
  await actor.browse().click(editButton);
  await navPromise;
}

async function deleteRowFromGrid(actor: WebActor, row: Target, deleteButton: Target): Promise<void> {
  await actor.browse().hover(row);
  await actor.browse().click(deleteButton);
  await actor.browse().click(DeleteDialogTargets.deleteButton);
  await actor.browse().waitForDetached(DeleteDialogTargets.dialog, DeleteDialogTargets.overlay);
}

export const DynamicDocumentTasks = {
  gotoAdminHome:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(AdminNavTargets.homeRoute);
    },

  goto:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const getDocumentsResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => r.url().includes(DynamicDocumentAdminPageTargets.getListPagePath) && r.status() === 200
        );
      await actor.browse().goto(DynamicDocumentAdminPageTargets.route);
      await getDocumentsResponse;
      await actor.attemptsTo(
        KendoGridTasks.scrollAllIntoView({
          grid: DynamicDocumentAdminPageTargets.documentsGrid,
          getListPagePath: DynamicDocumentAdminPageTargets.getListPagePath,
        })
      );
    },

  createViaHeader:
    (appName: string, documentName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await openHeaderCreateDialog(actor);
      await selectCreateDialogApp(actor, appName);
      await fillCreateDialogAndSave(actor, documentName);
    },

  createCopyViaHeader:
    (appName: string, documentToCopy: string, documentName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await openHeaderCreateDialog(actor);
      await selectCreateDialogApp(actor, appName);
      await fillCreateDialogAndSave(actor, documentName, documentToCopy);
    },

  createViaDocumentsTile:
    (appName: string, documentName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await openDocumentsTileCreateDialog(actor);
      await selectCreateDialogApp(actor, appName);
      await fillCreateDialogAndSave(actor, documentName);
    },

  createCopyViaDocumentsTile:
    (appName: string, documentToCopy: string, documentName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await openDocumentsTileCreateDialog(actor);
      await selectCreateDialogApp(actor, appName);
      await fillCreateDialogAndSave(actor, documentName, documentToCopy);
    },

  createFromAdminPage:
    (appName: string, documentName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(DynamicDocumentAdminPageTargets.createDocumentButton);
      await selectCreateDialogApp(actor, appName);
      await fillCreateDialogAndSave(actor, documentName);
    },

  createCopyFromAdminPage:
    (appName: string, documentToCopy: string, documentName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(DynamicDocumentAdminPageTargets.createDocumentButton);
      await selectCreateDialogApp(actor, appName);
      await fillCreateDialogAndSave(actor, documentName, documentToCopy);
    },

  createFromAppDocumentsTab:
    (documentName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppDocumentsTabTargets.addDocumentLink);
      await fillCreateDialogAndSave(actor, documentName);
    },

  createCopyFromAppDocumentsTab:
    (documentToCopy: string, documentName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppDocumentsTabTargets.addDocumentLink);
      await fillCreateDialogAndSave(actor, documentName, documentToCopy);
    },

  openForEditFromAppDocumentsTab:
    (documentName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await openRowForEdit(
        actor,
        AppDocumentsTabTargets.rowByName(documentName),
        AppDocumentsTabTargets.editButtonInRow(documentName)
      );
    },

  openForEditFromAdminPage:
    (documentName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await openRowForEdit(
        actor,
        DynamicDocumentAdminPageTargets.rowByName(documentName),
        DynamicDocumentAdminPageTargets.editButtonInRow(documentName)
      );
    },

  deleteFromAppDocumentsTab:
    (documentName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await deleteRowFromGrid(
        actor,
        AppDocumentsTabTargets.rowByName(documentName),
        AppDocumentsTabTargets.deleteButtonInRow(documentName)
      );
    },

  deleteFromAdminPage:
    (documentName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await deleteRowFromGrid(
        actor,
        DynamicDocumentAdminPageTargets.rowByName(documentName),
        DynamicDocumentAdminPageTargets.deleteButtonInRow(documentName)
      );
    },

  updateStatus:
    (enabled: boolean): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(
        StatusSwitchTasks.setAriaSwitch({
          switchTarget: EditDynamicDocumentPageTargets.informationTab.statusSwitch,
          toggleTarget: EditDynamicDocumentPageTargets.informationTab.statusToggle,
          enabled,
        })
      );
    },

  fillForm:
    (document: DynamicDocument): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const info = EditDynamicDocumentPageTargets.informationTab;
      await actor.browse().click(EditDynamicDocumentPageTargets.informationTabButton);
      await actor.browse().fill(info.documentNameInput, document.name);
      await actor.attemptsTo(DynamicDocumentTasks.updateStatus(document.status));

      await actor.browse().click(info.fileOptionsButton);
      await actor.browse().uploadViaFileChooser(info.uploadNewFileOption, document.templatePath, {
        waitForResponseUrl: (r: Response) =>
          EditDynamicDocumentPageTargets.saveFilePathRegex.test(r.url()) && r.status() === 200,
      });

      await actor.browse().click(EditDynamicDocumentPageTargets.displayRulesTabButton);

      const sec = EditDynamicDocumentPageTargets.securityTab;
      await actor.browse().click(EditDynamicDocumentPageTargets.securityTabButton);

      if (document.fieldsToOverride.length > 0) {
        await actor.attemptsTo(
          DualPaneSelector.selectOptions(sec.fieldSecurityOverridesSelector, document.fieldsToOverride)
        );
      }

      await actor.browse().setChecked(sec.contentSecurityOverrideCheckbox, document.overrideContentSecurity);

      await actor.browse().click(sec.roleAccessSelect);
      await actor.browse().click(EditDynamicDocumentPageTargets.optionByName(document.roleAccess));

      if (document.roleAccess === 'Restrict access to specific roles') {
        await actor.attemptsTo(DualPaneSelector.selectOptions(sec.rolesSelector, document.roles));
      }

      const out = EditDynamicDocumentPageTargets.outputTab;
      await actor.browse().click(EditDynamicDocumentPageTargets.outputTabButton);

      await actor.browse().click(out.emailSelect);
      await actor.browse().click(EditDynamicDocumentPageTargets.optionByName(document.emailAccess));

      await actor.browse().click(out.fileTypeSelect);
      await actor.browse().click(EditDynamicDocumentPageTargets.optionByName(document.fileType));

      await actor.browse().click(out.saveToFieldSelect);
      await actor.browse().click(EditDynamicDocumentPageTargets.optionByName(document.saveToFieldAccess, true));

      if (document.saveToFieldAccess === 'Allowed') {
        await actor.browse().click(out.attachmentFieldSelect);
        await actor.browse().click(EditDynamicDocumentPageTargets.optionByName(document.attachmentField));
      }
    },

  save:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const saveResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) =>
            EditDynamicDocumentPageTargets.pathRegex.test(r.url()) &&
            r.request().method() === 'POST' &&
            r.status() === 200
        );
      await actor.browse().click(EditDynamicDocumentPageTargets.saveChangesButton);
      await saveResponse;
    },
};
