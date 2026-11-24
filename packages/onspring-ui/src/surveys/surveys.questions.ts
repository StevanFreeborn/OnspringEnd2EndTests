import { Question } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { SurveyDetailTargets } from './surveys.targets.js';

export const SurveyQuestions = {
  idFromUrl:
    (): Question<WebActor, number> =>
    async (actor: WebActor): Promise<number> => {
      const url = actor.browse().url();

      if (!url.includes(SurveyDetailTargets.pathPrefix)) {
        throw new Error(`Expected current URL "${url}" to be a survey admin page.`);
      }

      const rawSegment = url.split(SurveyDetailTargets.pathPrefix)[1]?.split(/[?#]/)[0] ?? '';
      const surveyId = parseInt(rawSegment.split('/')[0], 10);

      if (Number.isNaN(surveyId)) {
        throw new Error(`Unable to parse survey ID from URL "${url}".`);
      }

      return surveyId;
    },
};
