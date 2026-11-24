import { Download } from '@playwright/test';
import { Question } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ReportPageTargets } from './reports.targets.js';

export type PrintedReportPdf = {
  fileName: string;
  body: Uint8Array;
};

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

  columnCellTexts:
    (fieldName: string): Question<WebActor, string[]> =>
    async (actor: WebActor): Promise<string[]> => {
      const headers = await actor.browse().getAllTexts(ReportPageTargets.gridHeaders);
      let fieldIndex = -1;

      for (const [index, headerText] of headers.entries()) {
        if (headerText === fieldName) {
          fieldIndex = index;
        }
      }

      if (fieldIndex === -1) {
        throw new Error(`The field "${fieldName}" was not found in the report.`);
      }

      return actor.browse().getAllTexts(ReportPageTargets.columnCellsAt(fieldIndex));
    },

  printedPdf:
    (reportId: number): Question<WebActor, PrintedReportPdf> =>
    async (actor: WebActor): Promise<PrintedReportPdf> => {
      const { headers, body } = await actor.browse().postForm(ReportPageTargets.printEndpoint(reportId));

      const contentDisposition = headers['content-disposition'];
      const nameMatch = contentDisposition?.match(/filename="(.+?)"/);

      if (!nameMatch) {
        throw new Error(`Could not extract PDF filename from content-disposition header: ${contentDisposition}`);
      }

      return { fileName: nameMatch[1], body };
    },

  downloadedExportFromEmailHtml:
    (html: string): Question<WebActor, Download> =>
    async (actor: WebActor): Promise<Download> => {
      await actor.browse().setContent(html);
      return actor.browse().clickAndWaitForDownload(ReportPageTargets.exportEmailDownloadLink);
    },
};
