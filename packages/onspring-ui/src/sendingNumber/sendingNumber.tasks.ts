import { Response } from '@playwright/test';
import { SendingNumber, TEST_SENDING_NUMBER_NAME } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { KendoGridTasks } from '../common/controls/kendoGrid.js';
import { AdminNavTargets } from '../common/navs/adminNav.targets.js';
import {
  AddSendingNumberPageTargets,
  DeleteSendingNumberDialogTargets,
  EditSendingNumberPageTargets,
  RequestNumberDialogTargets,
  SendingNumberAdminPageTargets,
} from './sendingNumber.targets.js';

export const SendingNumberTasks = {
  gotoAdminPage:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const getListResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => r.url().includes(SendingNumberAdminPageTargets.getListPagePath) && r.status() === 200
        );
      await actor.browse().goto(SendingNumberAdminPageTargets.route);
      await getListResponse;
    },

  gotoAddPage:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(AddSendingNumberPageTargets.route);
    },

  fillAddForm:
    (sendingNumber: SendingNumber): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().fill(AddSendingNumberPageTargets.nameInput, sendingNumber.name);
      await actor.browse().fill(AddSendingNumberPageTargets.descriptionEditor, sendingNumber.description);

      const isDisabled = await actor.browse().isDisabled(AddSendingNumberPageTargets.defaultCheckbox);

      if (!isDisabled) {
        await actor.browse().setChecked(AddSendingNumberPageTargets.defaultCheckbox, sendingNumber.isDefault);
      }

      await actor.browse().click(AddSendingNumberPageTargets.requestPhoneNumberLink);
      await actor.browse().click(RequestNumberDialogTargets.countrySelector);
      await actor.browse().click(RequestNumberDialogTargets.optionByName(sendingNumber.country));

      await actor.browse().click(RequestNumberDialogTargets.digitPatternSelector);
      await actor.browse().click(RequestNumberDialogTargets.optionByName(sendingNumber.digitPattern));

      await actor.browse().fill(RequestNumberDialogTargets.digitPatternInput, sendingNumber.digits);

      const findNumberResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => r.url().includes(RequestNumberDialogTargets.requestNumberPath) && r.status() === 200
        );
      await actor.browse().click(RequestNumberDialogTargets.findNumberLink);
      await findNumberResponse;

      await actor.browse().click(RequestNumberDialogTargets.acceptButton);
    },

  saveNew:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const navPromise = actor.browse().waitForUrl(EditSendingNumberPageTargets.pathRegex);
      await actor.browse().click(AddSendingNumberPageTargets.saveButton);
      await navPromise;
    },

  createViaHeader:
    (sendingNumber: SendingNumber): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      const addNavPromise = actor.browse().waitForUrl(AddSendingNumberPageTargets.route);
      await actor.browse().click(AdminNavTargets.menuOption('Sending Number'));
      await addNavPromise;

      await actor.attemptsTo(SendingNumberTasks.fillAddForm(sendingNumber), SendingNumberTasks.saveNew());
    },

  scrollAllIntoView: (): Task<WebActor> =>
    KendoGridTasks.scrollAllIntoView({
      grid: SendingNumberAdminPageTargets.grid,
      getListPagePath: SendingNumberAdminPageTargets.getListPagePath,
    }),

  deleteFromAdminPage:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(SendingNumberTasks.scrollAllIntoView());

      const row = SendingNumberAdminPageTargets.rowByName(name);
      const isVisible = await actor.browse().isVisible(row);

      if (!isVisible) {
        return;
      }

      await actor.browse().hover(row);
      await actor.browse().click(SendingNumberAdminPageTargets.deleteButtonInRow(name));
      await actor.browse().check(DeleteSendingNumberDialogTargets.dialog).isVisible();

      const isReassignVisible = await actor
        .browse()
        .isVisibleWithin(DeleteSendingNumberDialogTargets.numberSelector, 2000);

      if (isReassignVisible) {
        await actor.browse().click(DeleteSendingNumberDialogTargets.numberSelector);
        await actor.browse().click(DeleteSendingNumberDialogTargets.firstNumberOption);
      }

      await actor.browse().type(DeleteSendingNumberDialogTargets.okInput, 'OK');

      const deleteResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => r.url().includes(SendingNumberAdminPageTargets.deletePath) && r.status() === 200
        );
      await actor.browse().click(DeleteSendingNumberDialogTargets.deleteButton);
      await deleteResponse;
      await actor
        .browse()
        .waitForDetached(DeleteSendingNumberDialogTargets.dialog, DeleteSendingNumberDialogTargets.overlay);
      await actor.browse().check(row).isNotAttached();
    },

  deleteSendingNumbers:
    (names: string[]): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      if (names.length === 0) {
        return;
      }

      await actor.attemptsTo(SendingNumberTasks.gotoAdminPage());

      for (const name of names) {
        await actor.attemptsTo(SendingNumberTasks.deleteFromAdminPage(name));
      }
    },

  deleteAllTestNumbers:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(SendingNumberTasks.gotoAdminPage(), SendingNumberTasks.scrollAllIntoView());

      const testNumberPattern = new RegExp(TEST_SENDING_NUMBER_NAME, 'i');
      const row = SendingNumberAdminPageTargets.lastRowByName(testNumberPattern);

      while (await actor.browse().isVisible(row)) {
        await actor.browse().hover(row);
        await actor.browse().click(SendingNumberAdminPageTargets.deleteButtonInLastRow(testNumberPattern));
        await actor.browse().check(DeleteSendingNumberDialogTargets.dialog).isVisible();

        const isReassignVisible = await actor
          .browse()
          .isVisibleWithin(DeleteSendingNumberDialogTargets.numberSelector, 2000);

        if (isReassignVisible) {
          await actor.browse().click(DeleteSendingNumberDialogTargets.numberSelector);
          await actor.browse().click(DeleteSendingNumberDialogTargets.firstNumberOption);
        }

        await actor.browse().type(DeleteSendingNumberDialogTargets.okInput, 'OK', { delay: 150 });

        const deleteResponse = actor
          .browse()
          .waitForResponse(
            (r: Response) => r.url().includes(SendingNumberAdminPageTargets.deletePath) && r.status() === 200
          );
        await actor.browse().click(DeleteSendingNumberDialogTargets.deleteButton);
        await deleteResponse;
        await actor
          .browse()
          .waitForDetached(DeleteSendingNumberDialogTargets.dialog, DeleteSendingNumberDialogTargets.overlay);
      }
    },
};
