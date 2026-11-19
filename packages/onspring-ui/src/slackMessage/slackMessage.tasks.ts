import { Response } from '@playwright/test';
import { SlackMessage } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { AppMessagingTabTargets } from '../apps/apps.targets.js';
import { StatusSwitchTasks } from '../common/controls/statusSwitch.js';
import { CreateDialogTargets, DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AdminNavTargets } from '../common/navs/adminNav.targets.js';
import { EditSlackMessagePageTargets, SlackMessageAdminPageTargets } from './slackMessage.targets.js';

export const SlackMessageTasks = {
  goto:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(SlackMessageAdminPageTargets.route);
    },

  createFromAppMessagingTab:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppMessagingTabTargets.addSlackMessageLink);
      await actor.browse().fill(CreateDialogTargets.nameInput, name);
      const navPromise = actor.browse().waitForUrl(EditSlackMessagePageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  createCopyFromAppMessagingTab:
    (toCopyName: string, copyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppMessagingTabTargets.addSlackMessageLink);
      await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(toCopyName));
      await actor.browse().fill(CreateDialogTargets.nameInput, copyName);
      const navPromise = actor.browse().waitForUrl(EditSlackMessagePageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  createViaHeader:
    (appName: string, name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('Slack Message'));
      await actor.browse().click(CreateDialogTargets.appSelect);
      await actor.browse().click(CreateDialogTargets.appOption(appName));
      await actor.browse().fill(CreateDialogTargets.nameInput, name);
      const navPromise = actor.browse().waitForUrl(EditSlackMessagePageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  createCopyViaHeader:
    (appName: string, toCopyName: string, copyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('Slack Message'));
      await actor.browse().click(CreateDialogTargets.appSelect);
      await actor.browse().click(CreateDialogTargets.appOption(appName));
      await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(toCopyName));
      await actor.browse().fill(CreateDialogTargets.nameInput, copyName);
      const navPromise = actor.browse().waitForUrl(EditSlackMessagePageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  createFromAdminPage:
    (appName: string, name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(SlackMessageAdminPageTargets.createSlackMessageButton);
      await actor.browse().click(CreateDialogTargets.appSelect);
      await actor.browse().click(CreateDialogTargets.appOption(appName));
      await actor.browse().fill(CreateDialogTargets.nameInput, name);
      const navPromise = actor.browse().waitForUrl(EditSlackMessagePageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  createCopyFromAdminPage:
    (appName: string, toCopyName: string, copyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(SlackMessageAdminPageTargets.createSlackMessageButton);
      await actor.browse().click(CreateDialogTargets.appSelect);
      await actor.browse().click(CreateDialogTargets.appOption(appName));
      await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(toCopyName));
      await actor.browse().fill(CreateDialogTargets.nameInput, copyName);
      const navPromise = actor.browse().waitForUrl(EditSlackMessagePageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  openForEditFromAppMessagingTab:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const row = AppMessagingTabTargets.slackMessageRowByName(name);
      await actor.browse().hover(row);
      const navPromise = actor.browse().waitForUrl(EditSlackMessagePageTargets.pathRegex);
      await actor.browse().click(AppMessagingTabTargets.editSlackMessageButtonInRow(name));
      await navPromise;
    },

  openForEditFromAdminPage:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const row = SlackMessageAdminPageTargets.rowByName(name);
      await actor.browse().hover(row);
      const navPromise = actor.browse().waitForUrl(EditSlackMessagePageTargets.pathRegex);
      await actor.browse().click(SlackMessageAdminPageTargets.editButtonInRow(name));
      await navPromise;
    },

  update:
    (slackMessage: SlackMessage): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      // General Tab
      await actor.browse().click(EditSlackMessagePageTargets.generalTabButton);
      await actor.browse().fill(EditSlackMessagePageTargets.generalTab.nameInput, slackMessage.name);
      await actor.browse().fill(EditSlackMessagePageTargets.generalTab.descriptionEditor, slackMessage.description);
      await actor.attemptsTo(
        StatusSwitchTasks.setAriaSwitch({
          switchTarget: EditSlackMessagePageTargets.generalTab.statusSwitch,
          toggleTarget: EditSlackMessagePageTargets.generalTab.statusToggle,
          enabled: slackMessage.status,
        })
      );
      await actor.browse().fill(EditSlackMessagePageTargets.generalTab.channelNameInput, slackMessage.channelName);

      // Contents Tab
      await actor.browse().click(EditSlackMessagePageTargets.contentsTabButton);
      await actor.browse().fill(EditSlackMessagePageTargets.contentsTab.messageTitleInput, slackMessage.messageTitle);
      await actor.browse().fill(EditSlackMessagePageTargets.contentsTab.messageEditor, slackMessage.message);
      await actor
        .browse()
        .setChecked(
          EditSlackMessagePageTargets.contentsTab.viewRecordButtonCheckbox,
          slackMessage.appendViewRecordButton
        );

      if (slackMessage.sidebarColor) {
        await actor.browse().fill(EditSlackMessagePageTargets.contentsTab.sidebarColorInput, slackMessage.sidebarColor);
      }

      // Frequency Tab
      await actor.browse().click(EditSlackMessagePageTargets.frequencyTabButton);
      await actor.browse().click(EditSlackMessagePageTargets.frequencyTab.sendOnSaveSelect);
      await actor.browse().click(EditSlackMessagePageTargets.optionByName(slackMessage.sendOnSave));
    },

  save:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const saveResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) =>
            EditSlackMessagePageTargets.pathRegex.test(r.url()) && r.request().method() === 'POST' && r.status() === 200
        );
      await actor.browse().click(EditSlackMessagePageTargets.saveChangesButton);
      await saveResponse;
    },

  deleteFromAppMessagingTab:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const row = AppMessagingTabTargets.slackMessageRowByName(name);
      await actor.browse().hover(row);
      await actor.browse().click(AppMessagingTabTargets.deleteSlackMessageButtonInRow(name));
      await actor.browse().check(DeleteDialogTargets.deleteButton).isVisible();
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await actor.browse().waitForDetached(DeleteDialogTargets.dialog, DeleteDialogTargets.overlay);
      await actor.browse().check(row).isNotAttached();
    },

  deleteFromAdminPage:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const row = SlackMessageAdminPageTargets.rowByName(name);
      await actor.browse().hover(row);
      await actor.browse().click(SlackMessageAdminPageTargets.deleteButtonInRow(name));
      await actor.browse().check(DeleteDialogTargets.deleteButton).isVisible();
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await actor.browse().waitForDetached(DeleteDialogTargets.dialog, DeleteDialogTargets.overlay);
      await actor.browse().check(row).isNotAttached();
    },
};
