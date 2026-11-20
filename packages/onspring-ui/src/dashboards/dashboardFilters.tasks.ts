import { Response } from '@playwright/test';
import {
  DashboardFilter,
  DashboardFilterCriteria,
  ReferenceDashboardFilter,
  TextDashboardFilterCriteria,
} from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DualPaneSelector } from '../common/controls/dualPaneSelector.js';
import { DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { DashboardFilterTargets } from './dashboardFilters.targets.js';
import { DashboardPageTargets } from './dashboards.targets.js';

async function fillAndSaveFilterModal(actor: WebActor, filter: DashboardFilter): Promise<void> {
  const modal = DashboardFilterTargets.filterModal;
  await actor.browse().waitForState(modal.dialog, 'visible');
  await actor.browse().fill(modal.filterLabelInput, filter.label);
  await actor.browse().click(modal.dataTypeSelector);
  await actor.browse().click(DashboardFilterTargets.pageOptionByName(filter.type));

  if (filter instanceof ReferenceDashboardFilter) {
    await actor.browse().click(modal.referencedAppSelector);
    await actor.browse().click(DashboardFilterTargets.pageOptionByName(filter.referencedApp));
  }

  for (const mapping of filter.fieldMappings) {
    await actor.attemptsTo(
      DualPaneSelector.selectOptions(modal.fieldMappingSelectorForObject(mapping.dashboardObject), mapping.fields)
    );
  }

  await actor.browse().click(modal.saveButton);
  await actor.browse().waitForState(modal.dialog, 'hidden');
  await actor.browse().waitForTimeout(2_000);
}

export const DashboardFilterTasks = {
  toggleDashboardFilters:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(DashboardPageTargets.actionMenuButton);
      await actor.browse().click(DashboardFilterTargets.toggleDashboardFilteringLink);
      await actor.browse().waitForTimeout(2_000);
    },

  toggleEndUserDefaults:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(DashboardPageTargets.actionMenuButton);
      await actor.browse().click(DashboardFilterTargets.toggleEndUserDefaultsLink);
      await actor.browse().waitForTimeout(2_000);
    },

  addFilter:
    (filter: DashboardFilter): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(DashboardFilterTargets.addFilterButton);
      await fillAndSaveFilterModal(actor, filter);
    },

  editFilter:
    (existingLabel: string, updatedFilter: DashboardFilter): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(DashboardFilterTargets.filterMenuButton(existingLabel));
      await actor.browse().click(DashboardFilterTargets.filterMenuOption(existingLabel, 'Edit'));
      await fillAndSaveFilterModal(actor, updatedFilter);
    },

  moveFilterRight:
    (filterLabel: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(DashboardFilterTargets.filterMenuButton(filterLabel));

      const moveResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => DashboardFilterTargets.moveFilterPathRegex.test(r.url()) && r.status() === 200
        );
      await actor.browse().click(DashboardFilterTargets.filterMenuOption(filterLabel, 'Move Right'));
      await moveResponse;
      await actor.browse().waitForTimeout(2_000);
    },

  applyFilterCriteria:
    (filterCriteria: DashboardFilterCriteria): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(DashboardFilterTargets.filterSelection(filterCriteria.filterLabel));

      if (filterCriteria instanceof TextDashboardFilterCriteria) {
        await actor.browse().click(DashboardFilterTargets.ruleOperatorSelector);
        await actor.browse().click(DashboardFilterTargets.pageOptionByName(filterCriteria.operator));
        await actor.browse().click(DashboardFilterTargets.applyCriteriaButton);
      }
    },

  saveFilterCriteriaAsDefault:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const response = actor
        .browse()
        .waitForResponse(
          (r: Response) => DashboardFilterTargets.saveFilterDefaultsPathRegex.test(r.url()) && r.status() === 200
        );
      await actor.browse().click(DashboardFilterTargets.saveAsDefaultButton);
      await response;
    },

  saveFilterCriteriaAsDashboardDefault:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(DashboardFilterTargets.adminSaveMenuButton);
      const response = actor
        .browse()
        .waitForResponse(
          (r: Response) => DashboardFilterTargets.saveFilterDefaultsPathRegex.test(r.url()) && r.status() === 200
        );
      await actor.browse().click(DashboardFilterTargets.saveAsDashboardDefaultOption);
      await response;
    },

  saveFilterCriteriaAsEndUserDefault:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(DashboardFilterTargets.adminSaveMenuButton);
      const response = actor
        .browse()
        .waitForResponse(
          (r: Response) => DashboardFilterTargets.saveEndUserFilterDefaultsPathRegex.test(r.url()) && r.status() === 200
        );
      await actor.browse().click(DashboardFilterTargets.saveAsMyDefaultOption);
      await response;
    },

  resetFilterCriteria:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const response = actor
        .browse()
        .waitForResponse(
          (r: Response) =>
            DashboardFilterTargets.resetDashboardFiltersToDefaultPathRegex.test(r.url()) && r.status() === 200
        );
      await actor.browse().click(DashboardFilterTargets.restoreDefaultButton);
      await response;
      await actor.browse().waitForTimeout(2_000);
    },

  deleteFilter:
    (label: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(DashboardFilterTargets.filterMenuButton(label));
      await actor.browse().click(DashboardFilterTargets.filterMenuOption(label, 'Delete'));
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await actor.browse().waitForDetached(DeleteDialogTargets.dialog, DeleteDialogTargets.overlay);
      await actor.browse().waitForTimeout(2_000);
    },
};
