import { Download } from '@playwright/test';
import { Question } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DashboardDesignerTargets, DashboardPageTargets } from './dashboards.targets.js';
import { DashboardTasks } from './dashboards.tasks.js';

export type PrintedDashboardPdf = {
  fileName: string;
  body: Uint8Array;
};

export const DashboardQuestions = {
  designerDashboardId:
    (): Question<WebActor, number> =>
    async (actor: WebActor): Promise<number> => {
      await actor.attemptsTo(
        DashboardTasks.openDesignerModal(
          DashboardDesignerTargets.propertiesLink,
          DashboardDesignerTargets.propertiesModal.modal
        )
      );

      const link = await actor.browse().getText(DashboardDesignerTargets.propertiesModal.dashboardLink);
      await actor.browse().click(DashboardDesignerTargets.propertiesModal.cancelButton);

      const id = link.split('/').pop();

      if (id === undefined) {
        throw new Error('Dashboard ID not found');
      }

      return parseInt(id, 10);
    },

  dashboardLink:
    (): Question<WebActor, string> =>
    async (actor: WebActor): Promise<string> => {
      await actor.browse().click(DashboardPageTargets.actionMenuButton);
      await actor.browse().click(DashboardPageTargets.getDashboardUrlLink);
      await actor.browse().waitForState(DashboardPageTargets.dashboardLinkModal.modal, 'visible');

      const textWithLink = await actor.browse().textContent(DashboardPageTargets.dashboardLinkModal.linkText);
      const match = textWithLink?.match(/https:\/\/.*\/Dashboard\/\d+/);

      if (match === null || match === undefined) {
        throw new Error('Link not found');
      }

      return match[0];
    },

  printedPdf:
    (dashboardId: number, orientation: number = 1): Question<WebActor, PrintedDashboardPdf> =>
    async (actor: WebActor): Promise<PrintedDashboardPdf> => {
      const { headers, body } = await actor
        .browse()
        .postForm(DashboardPageTargets.printEndpoint(dashboardId), { Orientation: orientation });

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
      return actor.browse().clickAndWaitForDownload(DashboardPageTargets.exportEmailDownloadLink);
    },
};
