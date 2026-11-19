import { EmailBody, TextRuleWithValue } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { AppMessagingTabTargets } from '../apps/apps.targets.js';
import { DualPaneSelector } from '../common/controls/dualPaneSelector.js';
import { CreateDialogTargets, DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AdminNavTargets } from '../common/navs/adminNav.targets.js';
import { EditEmailBodyPageTargets, EmailBodyAdminPageTargets } from './emailBody.targets.js';

export const EmailBodyTasks = {
  goto:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(EmailBodyAdminPageTargets.route);
    },

  createFromAppMessagingTab:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppMessagingTabTargets.addEmailBodyLink);
      await actor.browse().fill(CreateDialogTargets.nameInput, name);
      const navPromise = actor.browse().waitForUrl(EditEmailBodyPageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  createCopyFromAppMessagingTab:
    (toCopyName: string, copyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppMessagingTabTargets.addEmailBodyLink);
      await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(toCopyName));
      await actor.browse().fill(CreateDialogTargets.nameInput, copyName);
      const navPromise = actor.browse().waitForUrl(EditEmailBodyPageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  createViaHeader:
    (appName: string, name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('Email Body'));
      await actor.browse().click(CreateDialogTargets.appSelect);
      await actor.browse().click(CreateDialogTargets.appOption(appName));
      await actor.browse().fill(CreateDialogTargets.nameInput, name);
      const navPromise = actor.browse().waitForUrl(EditEmailBodyPageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  createCopyViaHeader:
    (appName: string, toCopyName: string, copyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('Email Body'));
      await actor.browse().click(CreateDialogTargets.appSelect);
      await actor.browse().click(CreateDialogTargets.appOption(appName));
      await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(toCopyName));
      await actor.browse().fill(CreateDialogTargets.nameInput, copyName);
      const navPromise = actor.browse().waitForUrl(EditEmailBodyPageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  createFromAdminPage:
    (appName: string, name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(EmailBodyAdminPageTargets.createEmailBodyButton);
      await actor.browse().click(CreateDialogTargets.appSelect);
      await actor.browse().click(CreateDialogTargets.appOption(appName));
      await actor.browse().fill(CreateDialogTargets.nameInput, name);
      const navPromise = actor.browse().waitForUrl(EditEmailBodyPageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  createCopyFromAdminPage:
    (appName: string, toCopyName: string, copyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(EmailBodyAdminPageTargets.createEmailBodyButton);
      await actor.browse().click(CreateDialogTargets.appSelect);
      await actor.browse().click(CreateDialogTargets.appOption(appName));
      await actor.browse().check(CreateDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(toCopyName));
      await actor.browse().fill(CreateDialogTargets.nameInput, copyName);
      const navPromise = actor.browse().waitForUrl(EditEmailBodyPageTargets.pathRegex);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await navPromise;
    },

  openForEditFromAppMessagingTab:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const row = AppMessagingTabTargets.rowByName(name);
      await actor.browse().hover(row);
      const navPromise = actor.browse().waitForUrl(EditEmailBodyPageTargets.pathRegex);
      await actor.browse().click(AppMessagingTabTargets.editButtonInRow(name));
      await navPromise;
    },

  openForEditFromAdminPage:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const row = EmailBodyAdminPageTargets.rowByName(name);
      await actor.browse().hover(row);
      const navPromise = actor.browse().waitForUrl(EditEmailBodyPageTargets.pathRegex);
      await actor.browse().click(EmailBodyAdminPageTargets.editButtonInRow(name));
      await navPromise;
    },

  update:
    (emailBody: EmailBody): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      // General Tab
      await actor.browse().click(EditEmailBodyPageTargets.generalTabButton);
      await actor.browse().fill(EditEmailBodyPageTargets.generalTab.nameInput, emailBody.name);

      if (emailBody.status) {
        const switchLocator = actor.browse().locator(EditEmailBodyPageTargets.generalTab.statusSwitch);
        const checked = await switchLocator.getAttribute('aria-checked');

        if (checked === 'false') {
          await actor.browse().click(EditEmailBodyPageTargets.generalTab.statusToggle);
        }
      }

      // Contents Tab
      await actor.browse().click(EditEmailBodyPageTargets.contentsTabButton);
      await actor.browse().fill(EditEmailBodyPageTargets.contentsTab.subjectInput, emailBody.subject);
      await actor.browse().fill(EditEmailBodyPageTargets.contentsTab.bodyEditor, emailBody.body);

      // Recipients Tab
      await actor.browse().click(EditEmailBodyPageTargets.recipientsTabButton);

      if (emailBody.recipientsBasedOnFields.length > 0) {
        for (const field of emailBody.recipientsBasedOnFields) {
          await actor.attemptsTo(
            DualPaneSelector.selectOption(EditEmailBodyPageTargets.recipientsTab.basedOnFieldValuesSelector, field)
          );
        }
      }

      // Sender Tab
      await actor.browse().click(EditEmailBodyPageTargets.senderTabButton);
      await actor.browse().fill(EditEmailBodyPageTargets.senderTab.fromNameInput, emailBody.fromName);
      const [username, domain] = emailBody.fromAddress.split('@');
      await actor.browse().fill(EditEmailBodyPageTargets.senderTab.fromAddressLocalPartInput, username);
      const domainSelect = actor.browse().locator(EditEmailBodyPageTargets.senderTab.fromAddressDomainSelect);
      const isDomainSelectVisible = await domainSelect.isVisible();

      if (isDomainSelectVisible) {
        const text = await domainSelect.innerText();

        if (!text.includes(domain)) {
          await domainSelect.click();
          await actor.browse().click(EditEmailBodyPageTargets.senderTab.fromAddressDomainOption(domain));
        }
      }

      // Rules Tab
      if (emailBody.sendLogic && emailBody.sendLogic.rules.length > 0) {
        await actor.browse().click(EditEmailBodyPageTargets.rulesTabButton);

        for (const rule of emailBody.sendLogic.rules) {
          if (rule instanceof TextRuleWithValue) {
            // Select field
            await actor.browse().click(EditEmailBodyPageTargets.rulesTab.fieldSelector);
            await actor
              .browse()
              .click(page => page.getByRole('treeitem', { name: rule.fieldName }).getByText(rule.fieldName));
            // Select operator
            await actor.browse().click(EditEmailBodyPageTargets.rulesTab.ruleOperatorSelect);
            await actor.browse().click(EditEmailBodyPageTargets.rulesTab.ruleOperatorOption(rule.operator));
            // Fill value
            await actor.browse().fill(EditEmailBodyPageTargets.rulesTab.valueInput, rule.value);
            // Click Add
            await actor.browse().click(EditEmailBodyPageTargets.rulesTab.addRuleButton);
          }
        }
      }
    },

  save:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const saveResponse = actor
        .browse()
        .waitForResponse(
          r => EditEmailBodyPageTargets.pathRegex.test(r.url()) && r.request().method() === 'POST' && r.status() === 200
        );
      await actor.browse().click(EditEmailBodyPageTargets.saveChangesButton);
      await saveResponse;
    },

  deleteFromAppMessagingTab:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const row = AppMessagingTabTargets.rowByName(name);
      await actor.browse().hover(row);
      await actor.browse().click(AppMessagingTabTargets.deleteButtonInRow(name));
      await actor.browse().check(DeleteDialogTargets.deleteButton).isVisible();
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await actor.browse().check(row).isNotAttached();
    },

  deleteFromAdminPage:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const row = EmailBodyAdminPageTargets.rowByName(name);
      await actor.browse().hover(row);
      await actor.browse().click(EmailBodyAdminPageTargets.deleteButtonInRow(name));
      await actor.browse().check(DeleteDialogTargets.deleteButton).isVisible();
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await actor.browse().check(row).isNotAttached();
    },
};
