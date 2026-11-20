import { Response } from '@playwright/test';
import {
  Dashboard,
  DashboardItemWithLocation,
  DashboardObjectItem,
  DashboardSchedule,
  KeyMetric,
  SavedReport,
} from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { Retry, Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { ColorPickerControlTasks } from '../common/controls/colorPickerControl.js';
import { DateFieldControlTasks } from '../common/controls/dateFieldControl.js';
import { DualPaneSelector } from '../common/controls/dualPaneSelector.js';
import { EmailAddressControlTasks } from '../common/controls/emailAddressControl.js';
import { KendoGridTasks } from '../common/controls/kendoGrid.js';
import { StatusSwitchTasks } from '../common/controls/statusSwitch.js';
import { CreateDialogTargets, DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AdminNavTargets, AdminTileTargets } from '../common/navs/adminNav.targets.js';
import { DashboardDesignerTargets, DashboardPageTargets, DashboardsAdminPageTargets } from './dashboards.targets.js';

async function ensureResourceTabSelected(
  actor: WebActor,
  tabName: 'Reports' | 'Key Metrics' | 'Layouts' | 'Objects'
): Promise<void> {
  const tabButton = DashboardDesignerTargets.resources.tabButton(tabName);
  await actor.browse().waitForState(tabButton, 'visible');
  const isSelected = (await actor.browse().getAttribute(tabButton, 'aria-selected')) === 'true';

  if (!isSelected) {
    await actor.browse().click(tabButton);
  }
}

async function resolveClampedDropzone(actor: WebActor, desiredColumn: number, desiredRow: number): Promise<Target> {
  await actor.browse().waitForState(DashboardDesignerTargets.canvas.layoutSection, 'visible');

  const columnAttrs = await actor.browse().getAttributes(DashboardDesignerTargets.canvas.renderedItems, 'data-column');
  const rowAttrs = await actor.browse().getAttributes(DashboardDesignerTargets.canvas.renderedItems, 'data-row');

  let maxColumn = -1;
  for (const col of columnAttrs) {
    if (col === null) continue;
    const colNum = parseInt(col, 10);
    if (colNum > maxColumn) maxColumn = colNum;
  }

  if (maxColumn < 0) {
    throw new Error('Invalid column number');
  }

  const column = Math.min(desiredColumn, maxColumn);

  let maxRow = -1;
  for (let i = 0; i < columnAttrs.length; i++) {
    const col = columnAttrs[i];
    const row = rowAttrs[i];
    if (col !== null && parseInt(col, 10) === column && row !== null) {
      maxRow += 1;
    }
  }

  if (maxRow < 0) {
    throw new Error('Invalid row number');
  }

  const row = Math.min(desiredRow, maxRow);

  return DashboardDesignerTargets.canvas.dropzoneAt(column, row);
}

export const DashboardTasks = {
  gotoAdminPage:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const getListResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => r.url().includes(DashboardsAdminPageTargets.getListPagePath) && r.status() === 200
        );
      await actor.browse().goto(DashboardsAdminPageTargets.route);
      await getListResponse;
    },

  scrollAllIntoView: (): Task<WebActor> =>
    KendoGridTasks.scrollAllIntoView({
      grid: DashboardsAdminPageTargets.grid,
      getListPagePath: DashboardsAdminPageTargets.getListPagePath,
    }),

  waitForDesigner:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().waitForState(DashboardDesignerTargets.designerOwner, 'visible');
      await actor.browse().waitForState(DashboardDesignerTargets.title, 'visible');
      await actor.browse().waitForState(DashboardDesignerTargets.canvas.layoutSection, 'visible');
    },

  openDesignerModal:
    (trigger: Target, modal: Target): Task<WebActor> =>
    (actor: WebActor): Promise<void> =>
      Retry.until<WebActor>(
        async a => {
          if (!(await a.browse().isVisible(modal))) {
            await a.browse().click(trigger);
          }

          await a.browse().waitForState(modal, 'visible', { timeout: 2000 });
        },
        { intervals: [500, 1000], timeout: 30_000 }
      )(actor),

  closeDesigner:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(DashboardDesignerTargets.closeButton);
      await actor.browse().waitForState(DashboardDesignerTargets.designerOwner, 'hidden');
    },

  saveDesigner:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const saveResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => DashboardDesignerTargets.savePathRegex.test(r.url()) && r.request().method() === 'POST'
        );
      await actor.browse().click(DashboardDesignerTargets.saveButton);
      await saveResponse;
    },

  saveAndCloseDesigner:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const saveResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => DashboardDesignerTargets.savePathRegex.test(r.url()) && r.request().method() === 'POST'
        );
      await actor.browse().click(DashboardDesignerTargets.saveAndCloseButton);
      await saveResponse;
      await actor.browse().waitForState(DashboardDesignerTargets.designerOwner, 'hidden');
    },

  createViaHeader:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('Dashboard'));
      await actor.browse().waitForState(CreateDialogTargets.nameInput, 'visible');
      await actor.browse().fill(CreateDialogTargets.nameInput, name);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await actor.attemptsTo(DashboardTasks.waitForDesigner());
    },

  createCopyViaHeader:
    (toCopyName: string, copyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('Dashboard'));
      await actor.browse().waitForState(CreateDialogTargets.copyFromRadioButton, 'visible');
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(toCopyName));
      await actor.browse().fill(CreateDialogTargets.nameInput, copyName);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await actor.attemptsTo(DashboardTasks.waitForDesigner());
    },

  createViaTile:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminTileTargets.dashboardTileLink);
      await actor.browse().check(AdminTileTargets.dashboardTileCreateButton).isVisible();
      await actor.browse().click(AdminTileTargets.dashboardTileCreateButton);
      await actor.browse().check(AdminTileTargets.dashboardCreateMenu).isVisible();
      await actor.browse().click(AdminTileTargets.dashboardMenuOption('Dashboard'));
      await actor.browse().waitForState(CreateDialogTargets.nameInput, 'visible');
      await actor.browse().fill(CreateDialogTargets.nameInput, name);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await actor.attemptsTo(DashboardTasks.waitForDesigner());
    },

  createCopyViaTile:
    (toCopyName: string, copyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminTileTargets.dashboardTileLink);
      await actor.browse().check(AdminTileTargets.dashboardTileCreateButton).isVisible();
      await actor.browse().click(AdminTileTargets.dashboardTileCreateButton);
      await actor.browse().check(AdminTileTargets.dashboardCreateMenu).isVisible();
      await actor.browse().click(AdminTileTargets.dashboardMenuOption('Dashboard'));
      await actor.browse().waitForState(CreateDialogTargets.copyFromRadioButton, 'visible');
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(toCopyName));
      await actor.browse().fill(CreateDialogTargets.nameInput, copyName);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await actor.attemptsTo(DashboardTasks.waitForDesigner());
    },

  createFromAdminPage:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(DashboardsAdminPageTargets.createDashboardButton);
      await actor.browse().waitForState(CreateDialogTargets.nameInput, 'visible');
      await actor.browse().fill(CreateDialogTargets.nameInput, name);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await actor.attemptsTo(DashboardTasks.waitForDesigner());
    },

  createCopyFromAdminPage:
    (toCopyName: string, copyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(DashboardsAdminPageTargets.createDashboardButton);
      await actor.browse().waitForState(CreateDialogTargets.copyFromRadioButton, 'visible');
      await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateDialogTargets.optionToCopy(toCopyName));
      await actor.browse().fill(CreateDialogTargets.nameInput, copyName);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await actor.attemptsTo(DashboardTasks.waitForDesigner());
    },

  openDesignerFromAdminPage:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(DashboardTasks.scrollAllIntoView());
      const row = DashboardsAdminPageTargets.rowByName(name);
      await actor.browse().hover(row);
      await actor.browse().click(DashboardsAdminPageTargets.editButtonInRow(name));
      await actor.attemptsTo(DashboardTasks.waitForDesigner());
    },

  updatePropertiesInDesigner:
    (dashboard: Dashboard): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const props = DashboardDesignerTargets.propertiesModal;
      await actor.attemptsTo(DashboardTasks.openDesignerModal(DashboardDesignerTargets.propertiesLink, props.modal));

      await actor.browse().fill(props.nameInput, dashboard.name);
      await actor.attemptsTo(
        StatusSwitchTasks.setAriaSwitch({
          switchTarget: props.displayTitleSwitch,
          toggleTarget: props.displayTitleToggle,
          enabled: dashboard.displayTitle,
        })
      );

      if (dashboard.displayTitle) {
        await actor.browse().fill(props.titleInput, dashboard.title.title);
        await actor.attemptsTo(
          ColorPickerControlTasks.pickColor(
            props.titleTextColorPicker,
            dashboard.title.titleTextColor,
            DashboardDesignerTargets.frameSelector
          )
        );
        await actor.browse().click(props.titleTextFormatRadio(dashboard.title.titleTextFormat));
        await actor.browse().click(props.titleAlignmentRadio(dashboard.title.titleTextAlignment));
        await actor.attemptsTo(
          ColorPickerControlTasks.pickColor(
            props.titleBackgroundColorPicker,
            dashboard.title.titleBackgroundColor,
            DashboardDesignerTargets.frameSelector
          )
        );
      }

      await actor.attemptsTo(
        StatusSwitchTasks.setAriaSwitch({
          switchTarget: props.statusSwitch,
          toggleTarget: props.statusToggle,
          enabled: dashboard.status,
        }),
        DualPaneSelector.selectOptions(
          props.containersSelector,
          dashboard.containers,
          DashboardDesignerTargets.frameSelector
        )
      );

      await actor.browse().click(props.applyButton);
    },

  updatePermissionsInDesigner:
    (dashboard: Dashboard): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const perms = DashboardDesignerTargets.permissionsModal;
      await actor.attemptsTo(DashboardTasks.openDesignerModal(DashboardDesignerTargets.permissionsLink, perms.modal));

      await actor.browse().click(perms.permissionsSelector);
      await actor.browse().click(DashboardDesignerTargets.frameOptionByName(dashboard.permissionStatus));

      if (dashboard.permissionStatus === 'Private') {
        await actor.attemptsTo(
          DualPaneSelector.selectOptions(
            perms.usersSelector,
            dashboard.permissions.users,
            DashboardDesignerTargets.frameSelector
          ),
          DualPaneSelector.selectOptions(
            perms.groupsSelector,
            dashboard.permissions.groups,
            DashboardDesignerTargets.frameSelector
          ),
          DualPaneSelector.selectOptions(
            perms.rolesSelector,
            dashboard.permissions.roles,
            DashboardDesignerTargets.frameSelector
          )
        );
      }

      await actor.browse().click(perms.applyButton);
    },

  updateSchedulingInDesigner:
    (schedule: DashboardSchedule): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const sched = DashboardDesignerTargets.scheduleModal;
      await actor.attemptsTo(DashboardTasks.openDesignerModal(DashboardDesignerTargets.schedulingLink, sched.modal));

      await actor.attemptsTo(
        StatusSwitchTasks.setAriaSwitch({
          switchTarget: sched.scheduleSwitch,
          toggleTarget: sched.scheduleToggle,
          enabled: true,
        })
      );

      await actor.browse().click(sched.frequencySelector);
      await actor.browse().click(DashboardDesignerTargets.pageOptionByName(schedule.sendFrequency));

      await actor.attemptsTo(DateFieldControlTasks.enterDate(sched.startingOnDate, schedule.startingOn));

      if (schedule.endingOn) {
        await actor.attemptsTo(DateFieldControlTasks.enterDate(sched.endingOnDate, schedule.endingOn));
      }

      await actor.browse().setChecked(sched.defaultFilteringCheckbox, schedule.defaultFiltering);

      await actor.browse().click(sched.contentSelector);
      await actor.browse().click(DashboardDesignerTargets.pageOptionByName(schedule.exportDashboardOptions.content));

      await actor.browse().click(sched.paperSizeSelector);
      await actor.browse().click(DashboardDesignerTargets.pageOptionByName(schedule.exportDashboardOptions.paperSize));

      await actor.browse().fill(sched.marginsInput, schedule.exportDashboardOptions.margins.toString());
      await actor.browse().setChecked(sched.includeFooterCheckbox, schedule.exportDashboardOptions.includeFooter);

      await actor.browse().click(sched.orientationSelector);
      await actor
        .browse()
        .click(DashboardDesignerTargets.pageOptionByName(schedule.exportDashboardOptions.orientation));

      await actor.browse().fill(sched.scaleInput, schedule.exportDashboardOptions.scalePercentage.toString());

      await actor.attemptsTo(
        DualPaneSelector.selectOptions(sched.specificUsersSelector, schedule.specificUsers),
        DualPaneSelector.selectOptions(sched.specificGroupsSelector, schedule.specificGroups)
      );

      await actor.browse().fill(sched.fromNameInput, schedule.fromName);
      await actor.attemptsTo(EmailAddressControlTasks.enterAddress(sched.fromAddressContainer, schedule.fromAddress));
      await actor.browse().fill(sched.subjectInput, schedule.subject);
      await actor.browse().fill(sched.bodyEditor, schedule.body);

      await actor.browse().click(sched.saveButton);
    },

  addItemToDashboard:
    (itemWithLocation: DashboardItemWithLocation): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const { item, row, column } = itemWithLocation;
      let itemTarget: Target;

      if (item instanceof SavedReport) {
        await ensureResourceTabSelected(actor, 'Reports');
        itemTarget = DashboardDesignerTargets.resources.itemInBank('report', item.name);
      } else if (item instanceof DashboardObjectItem) {
        await ensureResourceTabSelected(actor, 'Objects');
        itemTarget = DashboardDesignerTargets.resources.itemInBank('object', item.name);
      } else if (item instanceof KeyMetric) {
        await ensureResourceTabSelected(actor, 'Key Metrics');
        itemTarget = DashboardDesignerTargets.resources.itemInBank('keymetric', item.objectName);
      } else {
        throw new Error(`Item type not supported: ${String(item)}`);
      }

      const itemClasses = await actor.browse().getAttribute(itemTarget, 'class');
      if (itemClasses?.includes('ui-draggable-disabled')) {
        return;
      }

      const dropzone = await resolveClampedDropzone(actor, column, row);
      await actor.browse().dragWithMouse(itemTarget, dropzone, DashboardDesignerTargets.canvas.dropLocation);
    },

  updateInDesigner:
    (dashboard: Dashboard): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      if (dashboard.schedule) {
        await actor.attemptsTo(DashboardTasks.updateSchedulingInDesigner(dashboard.schedule));
      }

      await actor.attemptsTo(
        DashboardTasks.updatePropertiesInDesigner(dashboard),
        DashboardTasks.updatePermissionsInDesigner(dashboard)
      );

      for (const item of dashboard.items) {
        await actor.attemptsTo(DashboardTasks.addItemToDashboard(item));
      }
    },

  deleteDashboard:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(DashboardTasks.scrollAllIntoView());
      const row = DashboardsAdminPageTargets.rowByName(name);
      const isVisible = await actor.browse().isVisible(row);

      if (!isVisible) {
        return;
      }

      await actor.browse().hover(row);
      await actor.browse().click(DashboardsAdminPageTargets.deleteButtonInRow(name));
      await actor.browse().check(DeleteDialogTargets.deleteButton).isVisible();

      const deleteResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => DashboardsAdminPageTargets.deletePathRegex.test(r.url()) && r.status() === 200
        );
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await deleteResponse;
      await actor.browse().waitForDetached(DeleteDialogTargets.dialog, DeleteDialogTargets.overlay);
      await actor.browse().waitForTimeout(1000);
    },

  deleteDashboards:
    (names: string[]): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      if (names.length === 0) {
        return;
      }

      await actor.attemptsTo(DashboardTasks.gotoAdminPage());

      for (const name of names) {
        await actor.attemptsTo(DashboardTasks.deleteDashboard(name));
      }
    },

  gotoDashboard:
    (dashboardId?: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const path = dashboardId ? DashboardPageTargets.routeForId(dashboardId) : DashboardPageTargets.route;
      await actor.browse().goto(path);
      await actor.browse().waitForState(DashboardPageTargets.copyrightPatentInfo, 'hidden');
    },

  openDesignerFromDashboard:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(DashboardPageTargets.actionMenuButton);
      await actor.browse().click(DashboardPageTargets.editDashboardLink);
      await actor.attemptsTo(DashboardTasks.waitForDesigner());
    },

  printDashboard:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(DashboardPageTargets.actionMenuButton);
      await actor.browse().click(DashboardPageTargets.printDashboardLink);
      await actor.browse().waitForState(DashboardPageTargets.printModal.dialog, 'visible');
      await actor.browse().click(DashboardPageTargets.printModal.okButton);
    },

  exportDashboard:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(DashboardPageTargets.actionMenuButton);
      await actor.browse().click(DashboardPageTargets.exportDashboardLink);
      await actor.browse().waitForState(DashboardPageTargets.exportModal.dialog, 'visible');
      await actor.browse().click(DashboardPageTargets.exportModal.okButton);
      await actor.browse().waitForState(DashboardPageTargets.exportUnderwayDialog.dialog, 'visible');
      await actor.browse().click(DashboardPageTargets.exportUnderwayDialog.closeButton);
    },
};
