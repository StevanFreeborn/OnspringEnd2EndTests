import { Response } from '@playwright/test';
import { SavedReportAsReportDataOnly } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import {
  AddReportDialogTargets,
  ReportAppPageTargets,
  ReportDesignerTargets,
  ReportPageTargets,
} from './reports.targets.js';

export const ReportTasks = {
  gotoAppReports:
    (appId: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const getReportsResponse = actor
        .browse()
        .waitForResponse((r: Response) => ReportAppPageTargets.getReportsPathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().goto(ReportAppPageTargets.routeForApp(appId));
      await getReportsResponse;
    },

  createSavedDataReport:
    (appId: number, report: SavedReportAsReportDataOnly): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(ReportTasks.gotoAppReports(appId));
      await actor.browse().click(ReportAppPageTargets.createReportButton);

      await actor.browse().click(AddReportDialogTargets.blankReportRadioButton);
      await actor.browse().click(AddReportDialogTargets.savedReportRadioButton);
      await actor.browse().fill(AddReportDialogTargets.reportNameInput, report.name);
      await actor.browse().click(AddReportDialogTargets.securitySelector);
      await actor.browse().click(AddReportDialogTargets.optionByName(report.security));
      await actor.browse().click(AddReportDialogTargets.saveButton);

      await actor.browse().waitForState(ReportDesignerTargets.modal, 'visible');

      await actor.browse().click(ReportDesignerTargets.generalTabButton);
      await actor.browse().fill(ReportDesignerTargets.generalTab.nameInput, report.name);
      await actor.browse().fill(ReportDesignerTargets.generalTab.descriptionEditor, report.description);

      await actor.browse().click(ReportDesignerTargets.visualTabButton);
      await actor.browse().waitForTimeout(1000);
      await actor.browse().click(ReportDesignerTargets.visualTab.displayTypeSelector);
      await actor.browse().click(ReportDesignerTargets.optionByName(report.displayType));

      if (report.relatedData.length === 0) {
        await actor.browse().setChecked(ReportDesignerTargets.visualTab.bulkEditCheckbox, report.bulkEdit);
        await actor.browse().setChecked(ReportDesignerTargets.visualTab.bulkDeleteCheckbox, report.bulkDelete);
      }

      const navPromise = actor.browse().waitForUrl(ReportPageTargets.pathRegex);
      await actor.browse().click(ReportDesignerTargets.saveAndRunButton);
      await navPromise;
      await actor.browse().waitForState(ReportPageTargets.copyrightPatentInfo, 'hidden');
    },
};
