import { Download, Response } from '@playwright/test';
import { Question } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DateFieldControlTasks } from '../common/controls/dateFieldControl.js';
import { BillingReportTargets, BillingUsageHistoryFilter, SystemReportCommonTargets } from './systemReports.targets.js';

async function performChartFilter(actor: WebActor, action: () => Promise<void>): Promise<Response> {
  const responsePromise = actor.browse().waitForResponse(BillingReportTargets.chartDataPath);
  await action();
  return responsePromise;
}

async function selectChartOption(actor: WebActor, selectorTarget: Target, optionName: string): Promise<Response> {
  return performChartFilter(actor, async () => {
    await actor.browse().click(selectorTarget);
    await actor.browse().click(SystemReportCommonTargets.optionByName(optionName));
  });
}

async function enterChartDate(actor: WebActor, controlTarget: Target, date: Date): Promise<Response> {
  await performChartFilter(actor, () => actor.attemptsTo(DateFieldControlTasks.clearDate(controlTarget)));
  return performChartFilter(actor, () => actor.attemptsTo(DateFieldControlTasks.enterDate(controlTarget, date)));
}

export const SystemReportQuestions = {
  downloadedExportFromEmailHtml:
    (html: string): Question<WebActor, Download> =>
    async (actor: WebActor): Promise<Download> => {
      await actor.browse().setContent(html);
      return actor.browse().clickAndWaitForDownload(SystemReportCommonTargets.exportEmailDownloadLink);
    },

  applyBillingUsageHistoryFilter:
    (filter: BillingUsageHistoryFilter): Question<WebActor, { ok: boolean; hasSeriesData: boolean }> =>
    async (actor: WebActor): Promise<{ ok: boolean; hasSeriesData: boolean }> => {
      let lastResponse = await selectChartOption(actor, BillingReportTargets.usageHistory.dateSelector, filter.type);
      lastResponse = await selectChartOption(
        actor,
        BillingReportTargets.usageHistory.incrementSelector,
        filter.increment
      );

      if (filter.type === 'Custom Dates') {
        lastResponse = await enterChartDate(actor, BillingReportTargets.usageHistory.fromDateControl, filter.startDate);
        lastResponse = await enterChartDate(actor, BillingReportTargets.usageHistory.toDateControl, filter.endDate);
      }

      const responseBody = (await lastResponse.json()) as { dataset: { data?: unknown[] }[] };
      const hasSeriesData = responseBody.dataset.some(series => series.data && series.data.length > 0);
      return { ok: lastResponse.ok(), hasSeriesData };
    },
};
