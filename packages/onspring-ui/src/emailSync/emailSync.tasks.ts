import { Response } from '@playwright/test';
import { EmailSync } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { CreateDialogTargets, DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AdminNavTargets, AdminTileTargets } from '../common/navs/adminNav.targets.js';
import { EditEmailSyncPageTargets, EmailSyncPageTargets } from './emailSync.targets.js';

export const EmailSyncTasks = {
  goto:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const getListResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => r.url().includes(EmailSyncPageTargets.getEmailSyncsPath) && r.status() === 200
        );
      await actor.browse().goto(EmailSyncPageTargets.route);
      await getListResponse;
    },

  create:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(EmailSyncPageTargets.createEmailSyncButton);
      await actor.browse().fill(CreateDialogTargets.nameInput, name);
      const navPromise = actor.browse().waitForUrl(EditEmailSyncPageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  createCopy:
    (toCopyName: string, copyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(EmailSyncPageTargets.createEmailSyncButton);
      await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(toCopyName));
      await actor.browse().fill(CreateDialogTargets.nameInput, copyName);
      const navPromise = actor.browse().waitForUrl(EditEmailSyncPageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  createViaHeader:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('Email Integration (Sync)'));
      await actor.browse().fill(CreateDialogTargets.nameInput, name);
      const navPromise = actor.browse().waitForUrl(EditEmailSyncPageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  createCopyViaHeader:
    (toCopyName: string, copyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('Email Integration (Sync)'));
      await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(toCopyName));
      await actor.browse().fill(CreateDialogTargets.nameInput, copyName);
      const navPromise = actor.browse().waitForUrl(EditEmailSyncPageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  createViaTile:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminTileTargets.integrationTileLink);
      await actor.browse().check(AdminTileTargets.integrationTileCreateButton).isVisible();
      await actor.browse().click(AdminTileTargets.integrationTileCreateButton);
      await actor.browse().check(AdminTileTargets.integrationCreateMenu).isVisible();
      await actor.browse().click(AdminTileTargets.integrationMenuOption('Email Integration (Sync)'));
      await actor.browse().fill(CreateDialogTargets.nameInput, name);
      const navPromise = actor.browse().waitForUrl(EditEmailSyncPageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  createCopyViaTile:
    (toCopyName: string, copyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminTileTargets.integrationTileLink);
      await actor.browse().check(AdminTileTargets.integrationTileCreateButton).isVisible();
      await actor.browse().click(AdminTileTargets.integrationTileCreateButton);
      await actor.browse().check(AdminTileTargets.integrationCreateMenu).isVisible();
      await actor.browse().click(AdminTileTargets.integrationMenuOption('Email Integration (Sync)'));
      await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(toCopyName));
      await actor.browse().fill(CreateDialogTargets.nameInput, copyName);
      const navPromise = actor.browse().waitForUrl(EditEmailSyncPageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  update:
    (emailSync: EmailSync): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      // Data Sync Tab
      await actor.browse().click(EditEmailSyncPageTargets.dataSyncTabButton);
      await actor.browse().fill(EditEmailSyncPageTargets.dataSyncTab.nameInput, emailSync.name);

      await actor.browse().click(EditEmailSyncPageTargets.dataSyncTab.appOrSurveySelector);
      await actor.browse().click(page => page.getByRole('option', { name: emailSync.appOrSurvey }));

      await actor.browse().type(EditEmailSyncPageTargets.dataSyncTab.emailKeyInput, emailSync.emailKey);

      const statusSwitchContainer = EditEmailSyncPageTargets.dataSyncTab.statusSwitch;
      const switchLocator = actor.browse().locator(statusSwitchContainer).locator('.k-switch');
      const switchClass = (await switchLocator.getAttribute('class')) || '';
      const isCurrentlyOn = switchClass.includes('k-switch-on');

      if (emailSync.status !== isCurrentlyOn) {
        await switchLocator.click();
      }

      // Data Mapping Tab
      await actor.browse().click(EditEmailSyncPageTargets.dataMappingTabButton);

      for (const [key, value] of Object.entries(emailSync.dataMapping)) {
        if (!value) continue;

        const mappedItemTarget: Target = EditEmailSyncPageTargets.dataMappingTab.mappedItem(value);
        const mappedItem = actor.browse().locator(mappedItemTarget);
        const mappedText = await mappedItem.textContent();

        if (mappedText === key) continue;

        const sourceTarget: Target = EditEmailSyncPageTargets.dataMappingTab.sourceField(key);
        const dropZoneTarget: Target = EditEmailSyncPageTargets.dataMappingTab.targetDropZone(value);

        await actor.browse().locator(dropZoneTarget).scrollIntoViewIfNeeded();
        await actor.browse().locator(sourceTarget).dragTo(actor.browse().locator(dropZoneTarget));
      }

      // Data Sync Settings Tab
      await actor.browse().click(EditEmailSyncPageTargets.dataSyncSettingsTabButton);
      await actor.browse().click(EditEmailSyncPageTargets.dataSyncSettingsTab.syncTypeSelector);
      await actor.browse().click(page => page.getByRole('option', { name: emailSync.syncType }));

      await actor.browse().click(EditEmailSyncPageTargets.dataSyncSettingsTab.messagingSelector);
      await actor.browse().click(page => page.getByRole('option', { name: emailSync.messaging }));
    },

  save:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const saveResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) =>
            r.request().method() === 'POST' && EditEmailSyncPageTargets.pathRegex.test(r.url()) && r.status() === 200
        );
      await actor.browse().click(EditEmailSyncPageTargets.saveChangesLink);
      await saveResponse;
    },

  scrollAllIntoView:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const pager = actor.browse().locator(EmailSyncPageTargets.pagerInfo);
      const pagerText = await pager.first().innerText();
      const totalNum = parseInt(pagerText.trim().split(' ')[0], 10);

      if (Number.isNaN(totalNum)) {
        return;
      }

      const rows = actor.browse().locator(EmailSyncPageTargets.grid).getByRole('row');
      const count = await rows.count();

      if (count < totalNum) {
        const scrollable = actor.browse().locator(EmailSyncPageTargets.scrollingContent).first();
        await scrollable.evaluate((el: HTMLElement) => {
          el.scrollTop = el.scrollHeight;
        });
      }
    },

  deleteEmailSync:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(EmailSyncTasks.scrollAllIntoView());

      const row = EmailSyncPageTargets.rowByName(name);
      const isVisible = await actor.browse().isVisible(row);

      if (!isVisible) {
        return;
      }

      await actor.browse().hover(row);
      await actor.browse().click(EmailSyncPageTargets.deleteButtonInRow(name));
      await actor.browse().check(DeleteDialogTargets.deleteButton).isVisible();
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await actor.browse().check(DeleteDialogTargets.dialog).isHidden();
      await actor.browse().check(row).isHidden();
    },

  deleteEmailSyncs:
    (names: string[]): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      for (const name of names) {
        await actor.attemptsTo(EmailSyncTasks.deleteEmailSync(name));
      }
    },
};
