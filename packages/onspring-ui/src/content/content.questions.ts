import { Question } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export const ContentQuestions = {
  currentRecordId:
    (): Question<WebActor, number> =>
    async (actor: WebActor): Promise<number> => {
      const url = actor.browse().url();
      const match = url.match(/\/Content\/\d+\/(\d+)\/Edit/);

      if (match === null) {
        throw new Error('The current page is not a content edit page.');
      }

      return parseInt(match[1], 10);
    },

  currentAddAppId:
    (): Question<WebActor, number> =>
    async (actor: WebActor): Promise<number> => {
      const url = actor.browse().url();
      const match = url.match(/\/Content\/(\d+)\/Add/);

      if (match === null) {
        throw new Error('The current page is not an add content page.');
      }

      return parseInt(match[1], 10);
    },
};
