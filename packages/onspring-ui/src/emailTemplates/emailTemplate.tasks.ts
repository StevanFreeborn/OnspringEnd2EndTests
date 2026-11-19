import { Response } from '@playwright/test';
import { EmailTemplate } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { CreateDialogTargets, DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AdminNavTargets, AdminTileTargets } from '../common/navs/adminNav.targets.js';
import { EditEmailTemplatePageTargets, EmailTemplatesPageTargets } from './emailTemplates.targets.js';

export const EmailTemplateTasks = {
  goto:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const getTemplatesResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => r.url().includes(EmailTemplatesPageTargets.getListPagePath) && r.status() === 200
        );
      await actor.browse().goto(EmailTemplatesPageTargets.route);
      await getTemplatesResponse;
    },

  create:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(EmailTemplateTasks.goto());
      await actor.browse().click(EmailTemplatesPageTargets.createEmailTemplateButton);

      await actor.browse().check(CreateDialogTargets.nameInput).isVisible();
      await actor.browse().type(CreateDialogTargets.nameInput, name);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await actor.browse().waitForUrl(EditEmailTemplatePageTargets.pathRegex);
    },

  createViaHeader:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('Email Template'));

      await actor.browse().check(CreateDialogTargets.nameInput).isVisible();
      await actor.browse().type(CreateDialogTargets.nameInput, name);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await actor.browse().waitForUrl(EditEmailTemplatePageTargets.pathRegex);
    },

  createViaTile:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminTileTargets.messagingTileLink);
      await actor.browse().check(AdminTileTargets.messagingTileCreateButton).isVisible();
      await actor.browse().click(AdminTileTargets.messagingTileCreateButton);
      await actor.browse().check(AdminTileTargets.messagingCreateMenu).isVisible();
      await actor.browse().click(AdminTileTargets.messagingMenuOption('Email Template'));

      await actor.browse().check(CreateDialogTargets.nameInput).isVisible();
      await actor.browse().type(CreateDialogTargets.nameInput, name);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await actor.browse().waitForUrl(EditEmailTemplatePageTargets.pathRegex);
    },

  copy:
    (templateToCopy: string, newTemplateName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(EmailTemplateTasks.goto());
      await actor.browse().click(EmailTemplatesPageTargets.createEmailTemplateButton);

      await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(templateToCopy));
      await actor.browse().type(CreateDialogTargets.nameInput, newTemplateName);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await actor.browse().waitForUrl(EditEmailTemplatePageTargets.pathRegex);
    },

  copyViaHeader:
    (templateToCopy: string, newTemplateName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('Email Template'));

      await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(templateToCopy));
      await actor.browse().type(CreateDialogTargets.nameInput, newTemplateName);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await actor.browse().waitForUrl(EditEmailTemplatePageTargets.pathRegex);
    },

  copyViaTile:
    (templateToCopy: string, newTemplateName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminTileTargets.messagingTileLink);
      await actor.browse().check(AdminTileTargets.messagingTileCreateButton).isVisible();
      await actor.browse().click(AdminTileTargets.messagingTileCreateButton);
      await actor.browse().check(AdminTileTargets.messagingCreateMenu).isVisible();
      await actor.browse().click(AdminTileTargets.messagingMenuOption('Email Template'));

      await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(templateToCopy));
      await actor.browse().type(CreateDialogTargets.nameInput, newTemplateName);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await actor.browse().waitForUrl(EditEmailTemplatePageTargets.pathRegex);
    },

  update:
    (template: EmailTemplate): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().fill(EditEmailTemplatePageTargets.nameInput, template.name);
      await actor.browse().fill(EditEmailTemplatePageTargets.descriptionEditor, template.description);

      const statusChecked = await actor
        .browse()
        .locator(EditEmailTemplatePageTargets.statusSwitch)
        .getAttribute('aria-checked');

      if (template.status && statusChecked === 'false') {
        await actor.browse().click(EditEmailTemplatePageTargets.statusToggle);
      } else if (!template.status && statusChecked === 'true') {
        await actor.browse().click(EditEmailTemplatePageTargets.statusToggle);
      }

      const saveResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) =>
            EditEmailTemplatePageTargets.pathRegex.test(r.url()) &&
            r.request().method() === 'POST' &&
            r.status() === 200
        );
      await actor.browse().click(EditEmailTemplatePageTargets.saveChangesButton);
      await saveResponse;
    },

  deleteTemplates:
    (names: string[]): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      if (names.length === 0) return;

      await actor.attemptsTo(EmailTemplateTasks.goto());

      for (const name of names) {
        const row = EmailTemplatesPageTargets.rowByName(name);
        const isVisible = await actor.browse().isVisible(row);

        if (isVisible) {
          await actor.browse().hover(row);
          await actor.browse().click(EmailTemplatesPageTargets.deleteButtonInRow(name));

          const deleteResponse = actor
            .browse()
            .waitForResponse(
              (r: Response) => EmailTemplatesPageTargets.deleteTemplatePathRegex.test(r.url()) && r.status() === 200
            );
          await actor.browse().click(DeleteDialogTargets.deleteButton);
          await deleteResponse;
          await actor.browse().waitForDetached(DeleteDialogTargets.dialog);
        }
      }
    },
};
