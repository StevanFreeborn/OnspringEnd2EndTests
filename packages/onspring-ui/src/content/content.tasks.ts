import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ContentRecordTargets } from './content.targets.js';

export const ContentTasks = {
  gotoAdd:
    (appId: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(ContentRecordTargets.addRoute(appId));
    },

  fillText:
    (fieldName: string, value: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().fill(ContentRecordTargets.textField(fieldName), value);
    },

  saveRecord:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const navPromise = actor.browse().waitForUrl(ContentRecordTargets.editPathRegex);
      await actor.browse().click(ContentRecordTargets.saveRecordButton);
      await navPromise;
    },
};
