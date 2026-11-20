import { Question } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';

export const UserQuestions = {
  currentId:
    (): Question<WebActor, number> =>
    async (actor: WebActor): Promise<number> => {
      const url = actor.browse().url();
      const match = url.match(/\/Admin\/Security\/User\/(\d+)\/Edit/);

      if (match === null) {
        throw new Error('The current page is not an edit user admin page.');
      }

      return parseInt(match[1], 10);
    },
};
