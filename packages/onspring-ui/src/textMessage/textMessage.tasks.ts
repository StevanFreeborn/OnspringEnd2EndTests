import { Response } from '@playwright/test';
import { TextMessage } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { AppMessagingTabTargets } from '../apps/apps.targets.js';
import { DualPaneSelector } from '../common/controls/dualPaneSelector.js';
import { StatusSwitchTasks } from '../common/controls/statusSwitch.js';
import { CreateDialogTargets, DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AdminNavTargets } from '../common/navs/adminNav.targets.js';
import { EditTextMessagePageTargets, TextMessageAdminPageTargets } from './textMessage.targets.js';

export const TextMessageTasks = {
  goto:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(TextMessageAdminPageTargets.route);
    },

  createFromAppMessagingTab:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppMessagingTabTargets.addTextMessageLink);
      await actor.browse().fill(CreateDialogTargets.nameInput, name);
      const navPromise = actor.browse().waitForUrl(EditTextMessagePageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  createCopyFromAppMessagingTab:
    (toCopyName: string, copyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppMessagingTabTargets.addTextMessageLink);
      await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(toCopyName));
      await actor.browse().fill(CreateDialogTargets.nameInput, copyName);
      const navPromise = actor.browse().waitForUrl(EditTextMessagePageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  createViaHeader:
    (appName: string, name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('Text Message'));
      await actor.browse().click(CreateDialogTargets.appSelect);
      await actor.browse().click(CreateDialogTargets.appOption(appName));
      await actor.browse().fill(CreateDialogTargets.nameInput, name);
      const navPromise = actor.browse().waitForUrl(EditTextMessagePageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  createCopyViaHeader:
    (appName: string, toCopyName: string, copyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('Text Message'));
      await actor.browse().click(CreateDialogTargets.appSelect);
      await actor.browse().click(CreateDialogTargets.appOption(appName));
      await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(toCopyName));
      await actor.browse().fill(CreateDialogTargets.nameInput, copyName);
      const navPromise = actor.browse().waitForUrl(EditTextMessagePageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  createFromAdminPage:
    (appName: string, name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(TextMessageAdminPageTargets.createTextMessageButton);
      await actor.browse().click(CreateDialogTargets.appSelect);
      await actor.browse().click(CreateDialogTargets.appOption(appName));
      await actor.browse().fill(CreateDialogTargets.nameInput, name);
      const navPromise = actor.browse().waitForUrl(EditTextMessagePageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  createCopyFromAdminPage:
    (appName: string, toCopyName: string, copyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(TextMessageAdminPageTargets.createTextMessageButton);
      await actor.browse().click(CreateDialogTargets.appSelect);
      await actor.browse().click(CreateDialogTargets.appOption(appName));
      await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(toCopyName));
      await actor.browse().fill(CreateDialogTargets.nameInput, copyName);
      const navPromise = actor.browse().waitForUrl(EditTextMessagePageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  openForEditFromAppMessagingTab:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const row = AppMessagingTabTargets.textMessageRowByName(name);
      await actor.browse().hover(row);
      const navPromise = actor.browse().waitForUrl(EditTextMessagePageTargets.pathRegex);
      await actor.browse().click(AppMessagingTabTargets.editTextMessageButtonInRow(name));
      await navPromise;
    },

  openForEditFromAdminPage:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const row = TextMessageAdminPageTargets.rowByName(name);
      await actor.browse().hover(row);
      const navPromise = actor.browse().waitForUrl(EditTextMessagePageTargets.pathRegex);
      await actor.browse().click(TextMessageAdminPageTargets.editButtonInRow(name));
      await navPromise;
    },

  update:
    (textMessage: TextMessage): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      // General Tab
      await actor.browse().click(EditTextMessagePageTargets.generalTabButton);
      await actor.browse().fill(EditTextMessagePageTargets.generalTab.nameInput, textMessage.name);
      await actor.browse().fill(EditTextMessagePageTargets.generalTab.descriptionEditor, textMessage.description);
      await actor.attemptsTo(
        StatusSwitchTasks.setAriaSwitch({
          switchTarget: EditTextMessagePageTargets.generalTab.statusSwitch,
          toggleTarget: EditTextMessagePageTargets.generalTab.statusToggle,
          enabled: textMessage.status,
        })
      );

      // Contents Tab
      await actor.browse().click(EditTextMessagePageTargets.contentsTabButton);
      await actor.browse().click(EditTextMessagePageTargets.contentsTab.fromNumberSelector);
      await actor.browse().click(EditTextMessagePageTargets.optionByName(textMessage.fromNumber));
      await actor.browse().fill(EditTextMessagePageTargets.contentsTab.messageTextArea, textMessage.message);

      // Recipients Tab
      await actor.browse().click(EditTextMessagePageTargets.recipientsTabButton);

      for (const field of textMessage.recipientsBasedOnFields) {
        await actor.attemptsTo(
          DualPaneSelector.selectOption(EditTextMessagePageTargets.recipientsTab.basedOnFieldValuesSelector, field)
        );
      }

      for (const group of textMessage.specificGroups) {
        await actor.attemptsTo(
          DualPaneSelector.selectOption(EditTextMessagePageTargets.recipientsTab.specificGroupsSelector, group)
        );
      }

      for (const user of textMessage.specificUsers) {
        await actor.attemptsTo(
          DualPaneSelector.selectOption(EditTextMessagePageTargets.recipientsTab.specificUsersSelector, user)
        );
      }

      // Frequency Tab
      await actor.browse().click(EditTextMessagePageTargets.frequencyTabButton);
      await actor.browse().click(EditTextMessagePageTargets.frequencyTab.sendOnSaveSelect);
      await actor.browse().click(EditTextMessagePageTargets.optionByName(textMessage.sendOnSave));
    },

  save:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const saveResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) =>
            EditTextMessagePageTargets.pathRegex.test(r.url()) && r.request().method() === 'POST' && r.status() === 200
        );
      await actor.browse().click(EditTextMessagePageTargets.saveChangesButton);
      await saveResponse;
    },

  deleteFromAppMessagingTab:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const row = AppMessagingTabTargets.textMessageRowByName(name);
      await actor.browse().hover(row);
      await actor.browse().click(AppMessagingTabTargets.deleteTextMessageButtonInRow(name));
      await actor.browse().check(DeleteDialogTargets.deleteButton).isVisible();
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await actor.browse().waitForDetached(DeleteDialogTargets.dialog, DeleteDialogTargets.overlay);
      await actor.browse().check(row).isNotAttached();
    },

  deleteFromAdminPage:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const row = TextMessageAdminPageTargets.rowByName(name);
      await actor.browse().hover(row);
      await actor.browse().click(TextMessageAdminPageTargets.deleteButtonInRow(name));
      await actor.browse().check(DeleteDialogTargets.deleteButton).isVisible();
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await actor.browse().waitForDetached(DeleteDialogTargets.dialog, DeleteDialogTargets.overlay);
      await actor.browse().check(row).isNotAttached();
    },
};
