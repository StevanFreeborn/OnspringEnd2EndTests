import { Question } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ApiKeyDetailTargets } from './apiKeys.targets.js';

export const ApiKeyQuestions = {
  apiKey:
    (): Question<WebActor, string> =>
    async (actor: WebActor): Promise<string> => {
      await actor.browse().click(ApiKeyDetailTargets.devInfoTabButton);
      const key = (await actor.browse().getText(ApiKeyDetailTargets.devInfoTab.apiKey)).trim();

      if (!key) {
        throw new Error('Unable to get the API key.');
      }

      return key;
    },
};
