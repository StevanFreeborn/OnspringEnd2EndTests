import { Response } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { CreateDialogTargets, DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AdminNavTargets, AdminTileTargets } from '../common/navs/adminNav.targets.js';
import { EditEmailSendingDomainPageTargets, EmailSendingDomainPageTargets } from './emailSendingDomain.targets.js';

export const EmailSendingDomainTasks = {
  goto:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const getListResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => r.url().includes(EmailSendingDomainPageTargets.getListPagePath) && r.status() === 200
        );
      await actor.browse().goto(EmailSendingDomainPageTargets.route);
      await getListResponse;
    },

  create:
    (domain: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(EmailSendingDomainTasks.goto());
      await actor.browse().click(EmailSendingDomainPageTargets.createButton);

      await actor.browse().check(EmailSendingDomainPageTargets.domainInput).isVisible();
      await actor.browse().fill(EmailSendingDomainPageTargets.domainInput, domain);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await actor.browse().waitForUrl(EditEmailSendingDomainPageTargets.pathRegex);
    },

  createViaHeader:
    (domain: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('Email Sending Domain'));

      await actor.browse().check(EmailSendingDomainPageTargets.domainInput).isVisible();
      await actor.browse().fill(EmailSendingDomainPageTargets.domainInput, domain);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await actor.browse().waitForUrl(EditEmailSendingDomainPageTargets.pathRegex);
    },

  createViaTile:
    (domain: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminTileTargets.instanceTileLink);
      await actor.browse().check(AdminTileTargets.instanceTileCreateButton).isVisible();
      await actor.browse().click(AdminTileTargets.instanceTileCreateButton);
      await actor.browse().check(AdminTileTargets.instanceCreateMenu).isVisible();
      await actor.browse().click(AdminTileTargets.instanceMenuOption('Email Sending Domain'));

      await actor.browse().check(EmailSendingDomainPageTargets.domainInput).isVisible();
      await actor.browse().fill(EmailSendingDomainPageTargets.domainInput, domain);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await actor.browse().waitForUrl(EditEmailSendingDomainPageTargets.pathRegex);
    },

  scrollAllIntoView:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const pagerInfoText = await actor.browse().locator(EmailSendingDomainPageTargets.gridPagerInfo).innerText();
      const totalNumOfItems = parseInt(pagerInfoText.trim().split(' ')[0], 10);

      if (Number.isNaN(totalNumOfItems)) {
        return;
      }

      const gridRows = actor.browse().locator(EmailSendingDomainPageTargets.grid).getByRole('row');
      let itemRowsCount = await gridRows.count();
      const scrollableElement = actor.browse().locator(EmailSendingDomainPageTargets.gridScrollableContent);

      while (itemRowsCount < totalNumOfItems) {
        const scrollResponse = actor
          .browse()
          .waitForResponse(
            (r: Response) => r.url().includes(EmailSendingDomainPageTargets.getListPagePath) && r.status() === 200
          );
        await scrollableElement.evaluate((el: HTMLElement) => (el.scrollTop = el.scrollHeight));
        await scrollResponse;
        itemRowsCount = await gridRows.count();
      }
    },

  deleteEmailSendingDomain:
    (domain: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(EmailSendingDomainTasks.scrollAllIntoView());

      const row = EmailSendingDomainPageTargets.rowByName(domain);
      const isVisible = await actor.browse().isVisible(row);
      if (!isVisible) {
        return;
      }

      await actor.browse().hover(row);
      await actor.browse().click(EmailSendingDomainPageTargets.deleteButtonInRow(domain));
      await actor.browse().check(DeleteDialogTargets.deleteButton).isVisible();
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await actor.browse().check(DeleteDialogTargets.dialog).isHidden();
      await actor.browse().check(row).isHidden();
    },

  deleteEmailSendingDomains:
    (domains: string[]): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      for (const domain of domains) {
        await actor.attemptsTo(EmailSendingDomainTasks.deleteEmailSendingDomain(domain));
      }
    },

  verifyRecord:
    (recordType: 'ownership' | 'dkim' | 'returnPath'): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const isVerified = await actor
        .browse()
        .isVisible(EditEmailSendingDomainPageTargets.recordStatusSuccess(recordType));

      if (isVerified) {
        return;
      }

      let pathRegex: RegExp;
      switch (recordType) {
        case 'ownership':
          pathRegex = EditEmailSendingDomainPageTargets.verifyOwnershipPathRegex;
          break;
        case 'dkim':
          pathRegex = EditEmailSendingDomainPageTargets.verifyDkimPathRegex;
          break;
        case 'returnPath':
          pathRegex = EditEmailSendingDomainPageTargets.verifyReturnPathPathRegex;
          break;
      }

      const verificationPromise = actor
        .browse()
        .waitForResponse((response: Response) => response.url().match(pathRegex) != null && response.status() === 200);

      await actor.browse().click(EditEmailSendingDomainPageTargets.recordVerifyLink(recordType));

      const response = await verificationPromise;
      const responseData = await response.json();

      if (!responseData.success) {
        await actor.browse().click(EditEmailSendingDomainPageTargets.verificationFailureDialogCloseButton);
        throw new Error(`Verification of ${recordType} record failed`);
      }

      await actor.browse().check(EditEmailSendingDomainPageTargets.recordStatusSuccess(recordType)).isVisible();
    },
};
