import { Question } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { AddSendingNumberPageTargets, EditSendingNumberPageTargets } from './sendingNumber.targets.js';

export const SendingNumberQuestions = {
  selectedNumber:
    (): Question<WebActor, string> =>
    async (actor: WebActor): Promise<string> => {
      const number = await actor.browse().textContent(AddSendingNumberPageTargets.smsSendingNumberText);

      if (number === null || number.trim() === '') {
        throw new Error('The sending number was not set.');
      }

      return number.trim();
    },

  currentId:
    (): Question<WebActor, number> =>
    async (actor: WebActor): Promise<number> => {
      const url = actor.browse().url();

      if (url.match(EditSendingNumberPageTargets.pathRegex) === null) {
        throw new Error('The current page is not a sending number edit page.');
      }

      const urlParts = url.split('/');
      const id = urlParts[urlParts.length - 2];
      return parseInt(id, 10);
    },
};
