import { Page } from '@playwright/test';
import { App, Trigger } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { resolveTarget, Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DateFieldControlTasks } from '../common/controls/dateFieldControl.js';
import { DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { EditEmailBodyPageTargets } from '../emailBody/emailBody.targets.js';
import { EditUserPageTargets } from '../users/users.targets.js';
import { EditRolePageTargets } from '../roles/roles.targets.js';
import { TriggerTasks } from '../triggers/triggers.tasks.js';
import {
  AdminAuditHistoryReportTargets,
  AuditHistoryFilter,
  AutomatedEmailMessageSourcesReportTargets,
  AutomatedEmailSourceFilter,
  AutomatedEmailSourceSortColumn,
  BillingDataUsageSortColumn,
  BillingFileStorageSortColumn,
  BillingReportTargets,
  EmailConfigFilter,
  EmailConfigSortColumn,
  EmailHistorySortColumn,
  EmailHistoryType,
  EmailMessageConfigReportTargets,
  EmailMessageHistoryReportTargets,
  InvalidFormulasReportTargets,
  InvalidFormulasSortColumn,
  InvalidTriggersReportTargets,
  InvalidTriggersSortColumn,
  LoginHistoryFilter,
  LoginHistoryReportTargets,
  PageHistoryFilter,
  PageHistoryReportTargets,
  RoleConfigurationsReportTargets,
  SlackMessageHistoryFilter,
  SlackMessageHistoryReportTargets,
  SlackMessageHistorySortColumn,
  SystemAdministratorListingFilter,
  SystemAdministratorListingReportTargets,
  SystemAdministratorListingSortColumn,
  SystemReportCommonTargets,
  SystemReportSortDirection,
  UserUsageFilter,
  UserUsageReportTargets,
  UserUsageSortColumn,
} from './systemReports.targets.js';

type MatchMode = 'exact' | 'exactCaseInsensitive' | 'includesCaseInsensitive';

function matchesFilterValue(currentValue: string, targetValue: string, mode: MatchMode): boolean {
  const normalizedCurrent = currentValue.trim();
  const normalizedTarget = targetValue.trim();

  if (mode === 'exact') {
    return normalizedCurrent === normalizedTarget;
  }

  if (mode === 'exactCaseInsensitive') {
    return normalizedCurrent.toLowerCase() === normalizedTarget.toLowerCase();
  }

  return normalizedCurrent.toLowerCase().includes(normalizedTarget.toLowerCase());
}

async function waitForReportAction(actor: WebActor, responsePath: string, action: () => Promise<void>): Promise<void> {
  const responsePromise = actor.browse().waitForResponse(responsePath);
  await action();
  await responsePromise;
}

async function gotoReport(actor: WebActor, route: string, dataPath: string): Promise<void> {
  await waitForReportAction(actor, dataPath, () => actor.browse().goto(route));
}

async function selectListboxOptionIfChanged(
  actor: WebActor,
  selectorTarget: Target,
  optionName: string,
  responsePath: string,
  options?: { matchMode?: MatchMode; optionExact?: boolean }
): Promise<void> {
  const matchMode = options?.matchMode ?? 'exact';
  const currentText = await actor.browse().getText(selectorTarget);

  if (matchesFilterValue(currentText, optionName, matchMode)) {
    return;
  }

  await waitForReportAction(actor, responsePath, async () => {
    await actor.browse().click(selectorTarget);
    await actor.browse().click(SystemReportCommonTargets.optionByName(optionName, options?.optionExact));
  });
}

async function sortKendoGrid(
  actor: WebActor,
  headerTarget: Target,
  columnName: string,
  direction: SystemReportSortDirection,
  responsePath: string
): Promise<void> {
  const columnHeader: Target = (page: Page) =>
    resolveTarget(page, headerTarget).getByRole('columnheader', {
      name: columnName,
    });
  let currentDirection = await actor.browse().getAttribute(columnHeader, 'aria-sort');

  while (currentDirection !== direction) {
    await waitForReportAction(actor, responsePath, () => actor.browse().click(columnHeader));
    currentDirection = await actor.browse().getAttribute(columnHeader, 'aria-sort');
  }
}

async function clearKendoGridSortByLink(actor: WebActor, headerTarget: Target, responsePath: string): Promise<void> {
  const sortableHeaders: Target = (page: Page) =>
    resolveTarget(page, headerTarget).locator('[data-role="columnsorter"]');
  const headerCount = await actor.browse().count(sortableHeaders);

  for (let i = 0; i < headerCount; i++) {
    const currentHeader: Target = (page: Page) =>
      resolveTarget(page, headerTarget).locator('[data-role="columnsorter"]').nth(i);
    const sortLink: Target = (page: Page) => resolveTarget(page, currentHeader).getByRole('link');
    let isSorted = await actor.browse().getAttribute(currentHeader, 'aria-sort');

    while (isSorted) {
      await waitForReportAction(actor, responsePath, () => actor.browse().click(sortLink));
      isSorted = await actor.browse().getAttribute(currentHeader, 'aria-sort');
    }
  }
}

async function clearKendoGridSortByHeader(actor: WebActor, headerTarget: Target, responsePath: string): Promise<void> {
  const firstSortedColumn: Target = (page: Page) => resolveTarget(page, headerTarget).locator('th[aria-sort]').first();

  while (await actor.browse().isVisible(firstSortedColumn)) {
    await waitForReportAction(actor, responsePath, () => actor.browse().click(firstSortedColumn));
  }
}

async function exportViaDialog(
  actor: WebActor,
  exportLinkTarget: Target,
  options?: { closeAfterExport?: boolean }
): Promise<void> {
  await actor.browse().click(exportLinkTarget);
  await actor.browse().waitForState(SystemReportCommonTargets.exportReportDialog.dialog, 'visible');
  await actor.browse().click(SystemReportCommonTargets.exportReportDialog.exportButton);

  if (options?.closeAfterExport) {
    await actor.browse().click(SystemReportCommonTargets.exportReportDialog.closeButton);
  }
}

export const AdminAuditHistoryReportTasks = {
  goto: (): Task<WebActor> => async actor =>
    gotoReport(actor, AdminAuditHistoryReportTargets.route, AdminAuditHistoryReportTargets.dataPath),

  applyFilter:
    ({
      user = 'All Users',
      saveType = 'All Save Types',
      itemType = 'All Item Types',
      appOrSurvey = 'All (or Not Applicable)',
    }: AuditHistoryFilter): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const { userSelector, saveTypeSelector, itemTypeSelector, appOrSurveySelector, dataPath } =
        AdminAuditHistoryReportTargets;
      await selectListboxOptionIfChanged(actor, userSelector, user, dataPath);
      await selectListboxOptionIfChanged(actor, saveTypeSelector, saveType, dataPath);
      await selectListboxOptionIfChanged(actor, itemTypeSelector, itemType, dataPath);
      await selectListboxOptionIfChanged(actor, appOrSurveySelector, appOrSurvey, dataPath);
    },

  exportReport: (): Task<WebActor> => async actor =>
    exportViaDialog(actor, AdminAuditHistoryReportTargets.exportReportLink, { closeAfterExport: true }),
};

export const AutomatedEmailMessageSourcesReportTasks = {
  goto: (): Task<WebActor> => async actor =>
    gotoReport(
      actor,
      AutomatedEmailMessageSourcesReportTargets.route,
      AutomatedEmailMessageSourcesReportTargets.dataPath
    ),

  applyFilter:
    ({
      emailType = 'Email Body',
      appOrSurvey = 'All Apps & Surveys',
      group = 'All Groups',
      user = 'All Users',
    }: AutomatedEmailSourceFilter): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().waitForTimeout(1000);
      const { emailTypeSelector, appOrSurveySelector, groupSelector, userSelector, dataPath } =
        AutomatedEmailMessageSourcesReportTargets;
      await selectListboxOptionIfChanged(actor, emailTypeSelector, emailType, dataPath);
      await selectListboxOptionIfChanged(actor, appOrSurveySelector, appOrSurvey, dataPath);
      await selectListboxOptionIfChanged(actor, groupSelector, group, dataPath);
      await selectListboxOptionIfChanged(actor, userSelector, user, dataPath);
    },

  sortGridBy:
    (column: AutomatedEmailSourceSortColumn, direction: SystemReportSortDirection = 'ascending'): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await sortKendoGrid(
        actor,
        AutomatedEmailMessageSourcesReportTargets.gridHeader,
        column,
        direction,
        AutomatedEmailMessageSourcesReportTargets.dataPath
      );
    },

  openItemAt:
    (index: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const navPromise = actor.browse().waitForUrl(EditEmailBodyPageTargets.pathRegex);
      await actor.browse().click(AutomatedEmailMessageSourcesReportTargets.rowAt(index));
      await navPromise;
    },
};

export const BillingReportTasks = {
  goto:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const responses = Promise.all([
        actor.browse().waitForResponse(BillingReportTargets.dataUsagePath),
        actor.browse().waitForResponse(BillingReportTargets.fileStoragePath),
        actor.browse().waitForResponse(BillingReportTargets.chartDataPath),
      ]);
      await actor.browse().goto(BillingReportTargets.route);
      await responses;
    },

  exportDataUsageReport: (): Task<WebActor> => async actor =>
    exportViaDialog(actor, BillingReportTargets.dataUsage.exportReportLink),

  clearDataUsageSort: (): Task<WebActor> => async actor =>
    clearKendoGridSortByLink(actor, BillingReportTargets.dataUsage.gridHeader, BillingReportTargets.dataUsagePath),

  sortDataUsageBy:
    (column: BillingDataUsageSortColumn, direction: SystemReportSortDirection = 'ascending'): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await sortKendoGrid(
        actor,
        BillingReportTargets.dataUsage.gridHeader,
        column,
        direction,
        BillingReportTargets.dataUsagePath
      );
    },

  exportFileStorageReport: (): Task<WebActor> => async actor =>
    exportViaDialog(actor, BillingReportTargets.fileStorage.exportReportLink),

  clearFileStorageSort: (): Task<WebActor> => async actor =>
    clearKendoGridSortByLink(actor, BillingReportTargets.fileStorage.gridHeader, BillingReportTargets.fileStoragePath),

  sortFileStorageBy:
    (column: BillingFileStorageSortColumn, direction: SystemReportSortDirection = 'ascending'): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await sortKendoGrid(
        actor,
        BillingReportTargets.fileStorage.gridHeader,
        column,
        direction,
        BillingReportTargets.fileStoragePath
      );
    },
};

export const EmailMessageConfigReportTasks = {
  goto: (): Task<WebActor> => async actor =>
    gotoReport(actor, EmailMessageConfigReportTargets.route, EmailMessageConfigReportTargets.dataPath),

  filterReport:
    ({ type, status, appOrSurvey }: EmailConfigFilter): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const { emailTypeSelector, fromAddressStatusSelector, appOrSurveySelector, dataPath } =
        EmailMessageConfigReportTargets;
      await selectListboxOptionIfChanged(actor, emailTypeSelector, type, dataPath, {
        matchMode: 'exactCaseInsensitive',
      });
      await selectListboxOptionIfChanged(actor, fromAddressStatusSelector, status, dataPath, {
        matchMode: 'exactCaseInsensitive',
      });
      await selectListboxOptionIfChanged(actor, appOrSurveySelector, appOrSurvey, dataPath, {
        matchMode: 'exactCaseInsensitive',
      });
    },

  sortGridBy:
    (column: EmailConfigSortColumn, direction: SystemReportSortDirection = 'ascending'): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await sortKendoGrid(
        actor,
        EmailMessageConfigReportTargets.gridHeader,
        column,
        direction,
        EmailMessageConfigReportTargets.dataPath
      );
    },

  selectAllRecords: (): Task<WebActor> => async actor =>
    actor.browse().checkControl(EmailMessageConfigReportTargets.selectAllCheckbox),

  bulkEditSelectedRecords:
    (localPart?: string, domain?: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const { bulkActionButton, bulkActionMenu, editSelectedMenuOption, bulkEditModal, route, dataPath } =
        EmailMessageConfigReportTargets;

      await actor.browse().click(bulkActionButton);
      await actor.browse().waitForState(bulkActionMenu, 'visible');
      await actor.browse().click(editSelectedMenuOption);

      if (localPart) {
        await actor.browse().fill(bulkEditModal.localPartInput, localPart);
      }

      if (domain) {
        await actor.browse().click(bulkEditModal.domainSelector);
        await actor.browse().click(SystemReportCommonTargets.optionByName(domain));
      }

      const reloadNavPromise = actor.browse().waitForUrl(route);
      const getConfigsResponsePromise = actor.browse().waitForResponse(dataPath);
      await actor.browse().click(bulkEditModal.saveButton);
      await actor.browse().waitForState(bulkEditModal.progressDialog, 'visible');
      await actor.browse().waitForState(bulkEditModal.progressDialog, 'hidden');
      await Promise.all([reloadNavPromise, getConfigsResponsePromise]);
    },
};

type EmailHistoryGridParams = {
  appId?: number;
  emailType?: string;
};

async function getEmailHistoryGridParams(actor: WebActor): Promise<EmailHistoryGridParams | null> {
  const storedGridState = await actor
    .browse()
    .getSessionStorageItem(EmailMessageHistoryReportTargets.sessionStorageKey);

  if (storedGridState === null) {
    return null;
  }

  const gridState = JSON.parse(storedGridState) as { paramMap?: EmailHistoryGridParams };
  return gridState?.paramMap ?? null;
}

export const EmailMessageHistoryReportTasks = {
  goto: (): Task<WebActor> => async actor =>
    gotoReport(actor, EmailMessageHistoryReportTargets.route, EmailMessageHistoryReportTargets.dataPath),

  filterReport:
    ({ emailType, app }: { emailType?: EmailHistoryType; app?: Pick<App, 'id' | 'name'> }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const { emailTypeSelector, appSelector, dataPath } = EmailMessageHistoryReportTargets;

      if (emailType) {
        const gridParams = await getEmailHistoryGridParams(actor);
        const emailTypeWithoutSpaces = emailType.replace(/\s+/g, '');

        if (!gridParams?.emailType?.includes(emailTypeWithoutSpaces)) {
          await actor.browse().click(emailTypeSelector);
          await waitForReportAction(actor, dataPath, () =>
            actor.browse().click(SystemReportCommonTargets.optionByName(emailType))
          );
        }
      }

      if (app) {
        const gridParams = await getEmailHistoryGridParams(actor);

        if (gridParams?.appId !== app.id) {
          await actor.browse().click(appSelector);
          await waitForReportAction(actor, dataPath, () =>
            actor.browse().click(SystemReportCommonTargets.optionByName(app.name))
          );
        }
      }
    },

  clearGridSorting: (): Task<WebActor> => async actor =>
    clearKendoGridSortByLink(
      actor,
      EmailMessageHistoryReportTargets.gridHeader,
      EmailMessageHistoryReportTargets.dataPath
    ),

  sortGridBy:
    (column: EmailHistorySortColumn, direction: SystemReportSortDirection = 'ascending'): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await sortKendoGrid(
        actor,
        EmailMessageHistoryReportTargets.gridHeader,
        column,
        direction,
        EmailMessageHistoryReportTargets.dataPath
      );
    },

  exportReport: (): Task<WebActor> => async actor =>
    exportViaDialog(actor, EmailMessageHistoryReportTargets.exportReportLink),

  openMessageDetails:
    (subject: string | RegExp): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(EmailMessageHistoryReportTargets.rowBySubject(subject));
      await actor.browse().waitForState(EmailMessageHistoryReportTargets.messageDetailModal.modal, 'visible');
    },

  resendEmail:
    (subject: string | RegExp): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(EmailMessageHistoryReportTargets.resendLinkInRow(subject));
      await actor.browse().click(EmailMessageHistoryReportTargets.resendEmailDialog.okButton);
    },

  clickToNameLink:
    (subject: string | RegExp): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const navPromise = actor.browse().waitForUrl(EditUserPageTargets.pathRegex);
      await actor.browse().click(EmailMessageHistoryReportTargets.toNameLinkInRow(subject));
      await navPromise;
    },
};

export const SlackMessageHistoryReportTasks = {
  goto: (): Task<WebActor> => async actor =>
    gotoReport(actor, SlackMessageHistoryReportTargets.route, SlackMessageHistoryReportTargets.dataPath),

  reload: (): Task<WebActor> => async actor =>
    waitForReportAction(actor, SlackMessageHistoryReportTargets.dataPath, () => actor.browse().reload()),

  filterReport:
    ({
      appOrSurvey = 'All Apps & Surveys',
      dateFilter = { type: 'All Dates' },
      channel = 'All Channels',
      status = 'All Statuses',
      messageContains = '',
    }: SlackMessageHistoryFilter): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const {
        appOrSurveySelector,
        channelSelector,
        dateFilterSelector,
        statusSelector,
        messageContainsInput,
        fromDateControl,
        toDateControl,
        dataPath,
      } = SlackMessageHistoryReportTargets;

      await selectListboxOptionIfChanged(actor, appOrSurveySelector, appOrSurvey, dataPath, {
        matchMode: 'exactCaseInsensitive',
        optionExact: true,
      });
      await selectListboxOptionIfChanged(actor, dateFilterSelector, dateFilter.type, dataPath, {
        matchMode: 'includesCaseInsensitive',
      });

      if (dateFilter.type === 'Custom Dates') {
        await waitForReportAction(actor, dataPath, () =>
          actor.attemptsTo(DateFieldControlTasks.enterDate(fromDateControl, dateFilter.from))
        );
        await waitForReportAction(actor, dataPath, () =>
          actor.attemptsTo(DateFieldControlTasks.enterDate(toDateControl, dateFilter.to))
        );
      }

      await selectListboxOptionIfChanged(actor, channelSelector, channel, dataPath, {
        matchMode: 'exactCaseInsensitive',
        optionExact: true,
      });
      await selectListboxOptionIfChanged(actor, statusSelector, status, dataPath, {
        matchMode: 'exactCaseInsensitive',
        optionExact: true,
      });

      const currentMessageContains = await actor.browse().inputValue(messageContainsInput);
      if (!matchesFilterValue(currentMessageContains, messageContains, 'exact')) {
        await waitForReportAction(actor, dataPath, () => actor.browse().fill(messageContainsInput, messageContains));
      }
    },

  clearGridSorting: (): Task<WebActor> => async actor =>
    clearKendoGridSortByLink(
      actor,
      SlackMessageHistoryReportTargets.gridHeader,
      SlackMessageHistoryReportTargets.dataPath
    ),

  sortGridBy:
    (column: SlackMessageHistorySortColumn, direction: SystemReportSortDirection = 'ascending'): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await sortKendoGrid(
        actor,
        SlackMessageHistoryReportTargets.gridHeader,
        column,
        direction,
        SlackMessageHistoryReportTargets.dataPath
      );
    },

  exportReport: (): Task<WebActor> => async actor =>
    waitForReportAction(actor, SlackMessageHistoryReportTargets.exportPath, () =>
      exportViaDialog(actor, SlackMessageHistoryReportTargets.exportReportLink)
    ),

  openMessageDetails:
    (itemName: string | RegExp): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(SlackMessageHistoryReportTargets.rowByName(itemName));
      await actor.browse().waitForState(SlackMessageHistoryReportTargets.messageDetailModal.modal, 'visible');
    },
};

export const InvalidFormulasReportTasks = {
  goto: (): Task<WebActor> => async actor =>
    gotoReport(actor, InvalidFormulasReportTargets.route, InvalidFormulasReportTargets.dataPath),

  reload: (): Task<WebActor> => async actor =>
    waitForReportAction(actor, InvalidFormulasReportTargets.dataPath, () => actor.browse().reload()),

  filterReport:
    ({ appFilter = 'All Apps & Surveys' }: { appFilter?: string }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await selectListboxOptionIfChanged(
        actor,
        InvalidFormulasReportTargets.appOrSurveySelector,
        appFilter,
        InvalidFormulasReportTargets.dataPath
      );
    },

  clearSort: (): Task<WebActor> => async actor =>
    clearKendoGridSortByHeader(actor, InvalidFormulasReportTargets.gridHeader, InvalidFormulasReportTargets.dataPath),

  sortGridBy:
    (column: InvalidFormulasSortColumn, direction: SystemReportSortDirection = 'ascending'): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await sortKendoGrid(
        actor,
        InvalidFormulasReportTargets.gridHeader,
        column,
        direction,
        InvalidFormulasReportTargets.dataPath
      );
    },

  openEditModal:
    (fieldName: string | RegExp): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(InvalidFormulasReportTargets.rowByText(fieldName));
      await actor.browse().click(InvalidFormulasReportTargets.editButtonInRow(fieldName));
    },

  deleteField:
    (fieldName: string | RegExp): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(InvalidFormulasReportTargets.rowByText(fieldName));
      await actor.browse().click(InvalidFormulasReportTargets.deleteButtonInRow(fieldName));
      await actor.browse().waitForState(DeleteDialogTargets.dialog, 'visible');
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await actor.browse().waitForDetached(DeleteDialogTargets.dialog, DeleteDialogTargets.overlay);
    },
};

export const InvalidTriggersReportTasks = {
  goto: (): Task<WebActor> => async actor =>
    gotoReport(actor, InvalidTriggersReportTargets.route, InvalidTriggersReportTargets.dataPath),

  reload: (): Task<WebActor> => async actor =>
    waitForReportAction(actor, InvalidTriggersReportTargets.dataPath, () => actor.browse().reload()),

  filterReport:
    ({ appFilter = 'All Apps & Surveys' }: { appFilter?: string }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await selectListboxOptionIfChanged(
        actor,
        InvalidTriggersReportTargets.appOrSurveySelector,
        appFilter,
        InvalidTriggersReportTargets.dataPath
      );
    },

  clearSort: (): Task<WebActor> => async actor =>
    clearKendoGridSortByHeader(actor, InvalidTriggersReportTargets.gridHeader, InvalidTriggersReportTargets.dataPath),

  sortGridBy:
    (column: InvalidTriggersSortColumn, direction: SystemReportSortDirection = 'ascending'): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await sortKendoGrid(
        actor,
        InvalidTriggersReportTargets.gridHeader,
        column,
        direction,
        InvalidTriggersReportTargets.dataPath
      );
    },

  updateTrigger:
    (trigger: Trigger): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(InvalidTriggersReportTargets.rowByText(trigger.name));
      await actor.attemptsTo(TriggerTasks.updateOpenTrigger(trigger));
    },

  deleteTrigger:
    (triggerName: string | RegExp): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(InvalidTriggersReportTargets.rowByText(triggerName));
      await actor.browse().click(InvalidTriggersReportTargets.deleteButtonInRow(triggerName));
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await actor.browse().waitForDetached(DeleteDialogTargets.dialog, DeleteDialogTargets.overlay);
    },
};

export const LoginHistoryReportTasks = {
  goto: (): Task<WebActor> => async actor =>
    gotoReport(actor, LoginHistoryReportTargets.route, LoginHistoryReportTargets.dataPath),

  filterReport:
    ({
      user = 'All Users',
      displayLoggedInUsersOnly = false,
      dateFilter = { type: 'All Dates' },
    }: LoginHistoryFilter): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const {
        displayLoggedInUsersOnlyCheckbox,
        userSelector,
        dateFilterSelector,
        fromDateControl,
        toDateControl,
        dataPath,
      } = LoginHistoryReportTargets;

      const isCurrentlyChecked = await actor.browse().isChecked(displayLoggedInUsersOnlyCheckbox);
      if (isCurrentlyChecked !== displayLoggedInUsersOnly) {
        await waitForReportAction(actor, dataPath, () =>
          actor.browse().setChecked(displayLoggedInUsersOnlyCheckbox, displayLoggedInUsersOnly)
        );
      }

      if (displayLoggedInUsersOnly) {
        return;
      }

      await selectListboxOptionIfChanged(actor, userSelector, user, dataPath, {
        matchMode: 'includesCaseInsensitive',
      });
      await selectListboxOptionIfChanged(actor, dateFilterSelector, dateFilter.type, dataPath, {
        matchMode: 'includesCaseInsensitive',
      });

      if (dateFilter.type === 'Custom Dates') {
        await waitForReportAction(actor, dataPath, () =>
          actor.attemptsTo(DateFieldControlTasks.enterDate(fromDateControl, dateFilter.from))
        );
        await waitForReportAction(actor, dataPath, () =>
          actor.attemptsTo(DateFieldControlTasks.enterDate(toDateControl, dateFilter.to))
        );
      }
    },

  exportReport: (): Task<WebActor> => async actor =>
    exportViaDialog(actor, LoginHistoryReportTargets.exportReportLink, { closeAfterExport: true }),
};

export const PageHistoryReportTasks = {
  goto: (): Task<WebActor> => async actor =>
    gotoReport(actor, PageHistoryReportTargets.route, PageHistoryReportTargets.dataPath),

  filterReport:
    ({
      user = 'All Users',
      httpMethod = 'All HTTP Methods',
      dateFilter = { type: 'All Dates' },
    }: PageHistoryFilter): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const { userSelector, httpMethodSelector, dateFilterSelector, fromDateControl, toDateControl, dataPath } =
        PageHistoryReportTargets;

      await selectListboxOptionIfChanged(actor, userSelector, user, dataPath, {
        matchMode: 'includesCaseInsensitive',
      });
      await selectListboxOptionIfChanged(actor, httpMethodSelector, httpMethod, dataPath, {
        matchMode: 'includesCaseInsensitive',
      });
      await selectListboxOptionIfChanged(actor, dateFilterSelector, dateFilter.type, dataPath, {
        matchMode: 'includesCaseInsensitive',
      });

      if (dateFilter.type === 'Custom Dates') {
        await waitForReportAction(actor, dataPath, () =>
          actor.attemptsTo(DateFieldControlTasks.enterDate(fromDateControl, dateFilter.from))
        );
        await waitForReportAction(actor, dataPath, () =>
          actor.attemptsTo(DateFieldControlTasks.enterDate(toDateControl, dateFilter.to))
        );
      }
    },

  sortGridBy:
    (columnName: string, direction: SystemReportSortDirection = 'ascending'): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await sortKendoGrid(
        actor,
        PageHistoryReportTargets.gridHeader,
        columnName,
        direction,
        PageHistoryReportTargets.dataPath
      );
    },

  exportReport: (): Task<WebActor> => async actor =>
    exportViaDialog(actor, PageHistoryReportTargets.exportReportLink, { closeAfterExport: true }),
};

export const RoleConfigurationsReportTasks = {
  goto: (): Task<WebActor> => async actor =>
    gotoReport(actor, RoleConfigurationsReportTargets.route, RoleConfigurationsReportTargets.dataPath),

  filterByName:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await waitForReportAction(actor, RoleConfigurationsReportTargets.dataPath, () =>
        actor.browse().fill(RoleConfigurationsReportTargets.nameFilterInput, name)
      );
    },

  clickEditRole:
    (roleName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(RoleConfigurationsReportTasks.filterByName(roleName));
      const navPromise = actor.browse().waitForUrl(EditRolePageTargets.pathRegex);
      await actor.browse().click(RoleConfigurationsReportTargets.editRoleLink);
      await navPromise;
    },

  exportReport: (): Task<WebActor> => async actor =>
    exportViaDialog(actor, RoleConfigurationsReportTargets.exportReportLink),
};

export const SystemAdministratorListingReportTasks = {
  goto: (): Task<WebActor> => async actor =>
    gotoReport(actor, SystemAdministratorListingReportTargets.route, SystemAdministratorListingReportTargets.dataPath),

  filterReport:
    ({ dateFilter = { type: 'All Dates' } }: SystemAdministratorListingFilter): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const { dateFilterSelector, fromDateControl, toDateControl, dataPath } = SystemAdministratorListingReportTargets;

      await selectListboxOptionIfChanged(actor, dateFilterSelector, dateFilter.type, dataPath, {
        matchMode: 'includesCaseInsensitive',
      });

      if (dateFilter.type === 'Custom Dates') {
        await waitForReportAction(actor, dataPath, () =>
          actor.attemptsTo(DateFieldControlTasks.enterDate(fromDateControl, dateFilter.from))
        );
        await waitForReportAction(actor, dataPath, () =>
          actor.attemptsTo(DateFieldControlTasks.enterDate(toDateControl, dateFilter.to))
        );
      }
    },

  sortGridBy:
    (
      column: SystemAdministratorListingSortColumn,
      direction: SystemReportSortDirection = 'ascending'
    ): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await sortKendoGrid(
        actor,
        SystemAdministratorListingReportTargets.gridHeader,
        column,
        direction,
        SystemAdministratorListingReportTargets.dataPath
      );
    },

  exportReport: (): Task<WebActor> => async actor =>
    exportViaDialog(actor, SystemAdministratorListingReportTargets.exportReportLink),
};

export const UserUsageReportTasks = {
  goto: (): Task<WebActor> => async actor =>
    gotoReport(actor, UserUsageReportTargets.route, UserUsageReportTargets.dataPath),

  filterReport:
    ({ name = '', status = 'Inactive', tier = 'Full User' }: UserUsageFilter): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const { nameInput, statusSelector, tierSelector, dataPath } = UserUsageReportTargets;
      const currentName = await actor.browse().inputValue(nameInput);

      if (!matchesFilterValue(currentName, name, 'exactCaseInsensitive')) {
        await waitForReportAction(actor, dataPath, () => actor.browse().fill(nameInput, name));
      }

      await selectListboxOptionIfChanged(actor, statusSelector, status, dataPath, {
        matchMode: 'exactCaseInsensitive',
        optionExact: true,
      });
      await selectListboxOptionIfChanged(actor, tierSelector, tier, dataPath, {
        matchMode: 'exactCaseInsensitive',
      });
    },

  clearSort: (): Task<WebActor> => async actor =>
    clearKendoGridSortByHeader(actor, UserUsageReportTargets.gridHeader, UserUsageReportTargets.dataPath),

  sortGridBy:
    (column: UserUsageSortColumn, direction: SystemReportSortDirection = 'ascending'): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await sortKendoGrid(actor, UserUsageReportTargets.gridHeader, column, direction, UserUsageReportTargets.dataPath);
    },

  openUsageDialogForUser:
    (userFullName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(UserUsageReportTargets.usageLinkInRow(new RegExp(userFullName)));
      await actor.browse().waitForState(UserUsageReportTargets.usageDialog.dialog, 'visible');
    },

  exportFromUsageDialog: (): Task<WebActor> => async actor =>
    exportViaDialog(actor, UserUsageReportTargets.usageDialog.exportLink),
};
