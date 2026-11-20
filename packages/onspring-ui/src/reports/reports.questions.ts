import { Question } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ReportPageTargets } from './reports.targets.js';

export const ReportQuestions = {
  currentId:
    (): Question<WebActor, number> =>
    async (actor: WebActor): Promise<number> => {
      const url = actor.browse().url();

      if (url.match(ReportPageTargets.pathRegex) === null) {
        throw new Error('The current page is not a report display page.');
      }

      const urlParts = url.split('/');
      const id = urlParts[urlParts.length - 2];
      return parseInt(id, 10);
    },
};
