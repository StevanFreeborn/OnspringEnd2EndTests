import { Download } from '@playwright/test';
import { Question } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { AppLayoutTabTargets } from './apps.targets.js';

export const AppQuestions = {
  downloadedFieldsAndObjectsExportFromEmailHtml:
    (html: string): Question<WebActor, Download> =>
    async (actor: WebActor): Promise<Download> => {
      await actor.browse().setContent(html);
      return actor.browse().clickAndWaitForDownload(AppLayoutTabTargets.exportEmailDownloadLink);
    },
};
