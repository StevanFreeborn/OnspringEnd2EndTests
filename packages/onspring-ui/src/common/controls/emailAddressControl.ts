import { Page } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { resolveTarget, Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { FrameOwner, resolveFrameOwner } from './frameOwner.js';

const emailAddressTargets = {
  localPartInput:
    (containerTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, containerTarget).locator('#local-part'),
  domainSelect:
    (containerTarget: Target): Target =>
    (page: Page) =>
      resolveTarget(page, containerTarget).getByRole('listbox', { includeHidden: true }),
  domainOption:
    (domain: string, frameOwner?: FrameOwner): Target =>
    (page: Page) =>
      resolveFrameOwner(page, frameOwner).getByRole('option', { name: domain }),
};

export const EmailAddressControlTasks = {
  enterAddress:
    (containerTarget: Target, address: string, frameOwner?: FrameOwner): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const [username, domain] = address.split('@');

      if (username === undefined || domain === undefined) {
        throw new Error('Address must be in the format "username@domain"');
      }

      await actor.browse().fill(emailAddressTargets.localPartInput(containerTarget), username);

      const domainSelect = emailAddressTargets.domainSelect(containerTarget);
      const isDomainEditable = await actor.browse().isVisible(domainSelect);
      const selectedDomain = await actor.browse().getText(domainSelect);

      if (selectedDomain.includes(domain)) {
        return;
      }

      if (!isDomainEditable) {
        throw new Error('Domain is not editable');
      }

      await actor.browse().click(domainSelect);
      await actor.browse().click(emailAddressTargets.domainOption(domain, frameOwner));
    },
};
