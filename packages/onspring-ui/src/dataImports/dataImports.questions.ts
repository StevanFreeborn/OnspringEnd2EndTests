import { Question } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export const DataImportQuestions = {
  currentId:
    (): Question<WebActor, number> =>
    async (actor: WebActor): Promise<number> => {
      const url = actor.browse().url();
      const match = url.match(/\/Admin\/Integration\/Import\/(\d+)\/Edit/);

      if (match === null) {
        throw new Error('The current page is not an edit data import page.');
      }

      return parseInt(match[1], 10);
    },
};
