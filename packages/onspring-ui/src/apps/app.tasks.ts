import { Response } from '@playwright/test';
import { LayoutItem, TextField } from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DualPaneSelector } from '../common/controls/dualPaneSelector.js';
import { KendoGridTasks } from '../common/controls/kendoGrid.js';
import { StatusSwitchTasks } from '../common/controls/statusSwitch.js';
import { CreateDialogTargets, DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AdminNavTargets, AdminTileTargets } from '../common/navs/adminNav.targets.js';
import { FieldTasks } from '../fields/fields.tasks.js';
import { AppRecordRetentionTabTargets } from '../recordRetentionRules/recordRetentionRules.targets.js';
import { AppTriggersTabTargets } from '../triggers/triggers.targets.js';
import { AppQuestions } from './app.questions.js';
import {
  AppDetailTargets,
  AppDocumentsTabTargets,
  AppLayoutTabTargets,
  AppMessagingTabTargets,
  AppsPageTargets,
  CreateAppDialogTargets,
  CreateAppModalTargets,
  DeleteAppDialogTargets,
  EditAdminSettingsModalTargets,
  EditDisplaySettingsModalTargets,
  EditGeneralSettingsModalTargets,
  EditGeocodingSettingsModalTargets,
  EditNotesSettingsModalTargets,
  ExportFieldsAndObjectsReportOptions,
  LayoutDropzoneLocation,
  OptionTargets,
} from './apps.targets.js';

export type UpdateLayoutPropertiesOptions = {
  name?: string;
  enabled?: boolean;
  roleNames?: string[];
};

async function ensureDesignerItemsTab(actor: WebActor, tab: 'fields' | 'objects'): Promise<void> {
  const designer = AppLayoutTabTargets.designer;
  if (tab === 'fields' && (await actor.browse().isVisible(designer.addObjectButton))) {
    await actor.browse().click(designer.fieldsTabButton);
    return;
  }

  if (tab === 'objects' && (await actor.browse().isVisible(designer.addFieldButton))) {
    await actor.browse().click(designer.objectsTabButton);
  }
}

async function resolveClampedIndex(actor: WebActor, dropzones: Target, desiredIndex?: number): Promise<number> {
  const count = await actor.browse().count(dropzones);
  if (count === 0) {
    throw new Error('No layout dropzones were found.');
  }
  return desiredIndex === undefined ? count - 1 : Math.min(Math.max(desiredIndex, 0), count - 1);
}

async function resolveHorizontalTabDropzone(actor: WebActor, index?: number): Promise<Target> {
  const designer = AppLayoutTabTargets.designer;
  const clampedIndex = await resolveClampedIndex(actor, designer.canvasTabDropzones, index);
  return designer.canvasTabDropzoneAt(clampedIndex);
}

async function resolveLayoutSectionDropzone(
  actor: WebActor,
  tabName?: string,
  placementIndex?: number
): Promise<{ dropzone: Target; hoveredDropzone: Target }> {
  const designer = AppLayoutTabTargets.designer;
  if (tabName === undefined) {
    const clampedIndex = await resolveClampedIndex(actor, designer.standaloneSectionDropzones, placementIndex);
    return {
      dropzone: designer.standaloneSectionDropzoneAt(clampedIndex),
      hoveredDropzone: designer.hoveredStandaloneSectionDropzone,
    };
  }

  const tabId = await actor.asks(AppQuestions.layoutDesignerTabId(tabName));
  const clampedIndex = await resolveClampedIndex(actor, designer.sectionDropzonesInTab(tabId), placementIndex);
  return {
    dropzone: designer.sectionDropzoneInTabAt(tabId, clampedIndex),
    hoveredDropzone: designer.hoveredSectionDropzone,
  };
}

async function ensureHorizontalOrientation(actor: WebActor): Promise<void> {
  const orientation = await actor.asks(AppQuestions.layoutDesignerTabOrientation());
  if (orientation !== 'horizontal') {
    throw new Error('Support for vertical tabs is not implemented yet');
  }
}

export const AppTasks = {
  goto:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const getAppsListResponse = actor
        .browse()
        .waitForResponse((r: Response) => r.url().includes(AppsPageTargets.getAppsListPath) && r.status() === 200);
      await actor.browse().goto(AppsPageTargets.route);
      await getAppsListResponse;
    },

  gotoApp:
    (appId: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(`/Admin/App/${appId}`);
    },

  gotoAppLayoutTab:
    (appId: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(`/Admin/App/${appId}`);
      await actor.browse().click(AppDetailTargets.layoutTabButton);
      await actor.browse().waitForState(AppLayoutTabTargets.layoutsGrid, 'visible');
    },

  gotoAppDocumentsTab:
    (appId: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(`/Admin/App/${appId}`);
      await actor.browse().click(AppDetailTargets.documentsTabButton);
      await actor.browse().waitForState(AppDocumentsTabTargets.documentsGrid, 'visible');
    },

  gotoAppMessagingTab:
    (appId: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(`/Admin/App/${appId}`);
      await actor.browse().click(AppDetailTargets.messagingTabButton);
      await actor.browse().waitForState(AppMessagingTabTargets.emailBodyGrid, 'visible');
    },

  gotoAppTriggersTab:
    (appId: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(`/Admin/App/${appId}`);
      await actor.browse().click(AppDetailTargets.triggersTabButton);
      await actor.browse().waitForState(AppTriggersTabTargets.triggersGrid, 'visible');
    },

  gotoAppRecordRetentionTab:
    (appId: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(`/Admin/App/${appId}`);
      await actor.browse().click(AppDetailTargets.recordRetentionTabButton);
      await actor.browse().waitForState(AppRecordRetentionTabTargets.rulesGrid, 'visible');
    },

  filterBy:
    (searchTerm: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const filterResponse = actor
        .browse()
        .waitForResponse((r: Response) => r.url().includes(AppsPageTargets.getAppsListPath) && r.status() === 200);
      await actor.browse().fill(AppsPageTargets.filterByInput, searchTerm);
      await filterResponse;
    },

  scrollAllIntoView: (): Task<WebActor> =>
    KendoGridTasks.scrollAllIntoView({
      grid: AppsPageTargets.appGrid,
      getListPagePath: AppsPageTargets.getAppsListPath,
    }),

  create:
    (appName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(AppTasks.goto());
      await actor.browse().click(AppsPageTargets.createAppButton);

      await actor.browse().click(CreateAppDialogTargets.continueButton);
      await actor.browse().type(CreateAppModalTargets.nameInput, appName);

      const navPromise = actor.browse().waitForUrl(AppDetailTargets.pathRegex);
      await actor.browse().click(CreateAppModalTargets.saveButton);
      await navPromise;
    },

  createViaHeader:
    (appName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('App'));

      await actor.browse().click(CreateAppDialogTargets.continueButton);
      await actor.browse().type(CreateAppModalTargets.nameInput, appName);

      const navPromise = actor.browse().waitForUrl(AppDetailTargets.pathRegex);
      await actor.browse().click(CreateAppModalTargets.saveButton);
      await navPromise;
    },

  createViaTile:
    (appName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminTileTargets.appTileLink);
      await actor.browse().check(AdminTileTargets.appTileCreateButton).isVisible();
      await actor.browse().click(AdminTileTargets.appTileCreateButton);

      await actor.browse().click(CreateAppDialogTargets.continueButton);
      await actor.browse().type(CreateAppModalTargets.nameInput, appName);

      const navPromise = actor.browse().waitForUrl(AppDetailTargets.pathRegex);
      await actor.browse().click(CreateAppModalTargets.saveButton);
      await navPromise;
    },

  copyViaHeader:
    (sourceAppName: string, copyAppName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('App'));

      await actor.browse().check(CreateAppDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateAppDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateAppDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateAppDialogTargets.getAppToCopy(sourceAppName));
      await actor.browse().click(CreateAppDialogTargets.continueButton);

      await actor.browse().check(CreateAppModalTargets.nameInput).hasValue(copyAppName);
      const navPromise = actor.browse().waitForUrl(AppDetailTargets.pathRegex);
      await actor.browse().click(CreateAppModalTargets.saveButton);
      await navPromise;
    },

  copyViaTile:
    (sourceAppName: string, copyAppName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminTileTargets.appTileLink);
      await actor.browse().check(AdminTileTargets.appTileCreateButton).isVisible();
      await actor.browse().click(AdminTileTargets.appTileCreateButton);

      await actor.browse().check(CreateAppDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateAppDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateAppDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateAppDialogTargets.getAppToCopy(sourceAppName));
      await actor.browse().click(CreateAppDialogTargets.continueButton);

      await actor.browse().check(CreateAppModalTargets.nameInput).hasValue(copyAppName);
      const navPromise = actor.browse().waitForUrl(AppDetailTargets.pathRegex);
      await actor.browse().click(CreateAppModalTargets.saveButton);
      await navPromise;
    },

  copyFromGrid:
    (sourceAppName: string, copyAppName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(AppTasks.goto());
      await actor.browse().click(AppsPageTargets.createAppButton);

      await actor.browse().check(CreateAppDialogTargets.copyFromRadioButton).isVisible();
      await actor.browse().click(CreateAppDialogTargets.copyFromRadioButton);
      await actor.browse().click(CreateAppDialogTargets.copyFromDropdown);
      await actor.browse().click(CreateAppDialogTargets.getAppToCopy(sourceAppName));
      await actor.browse().click(CreateAppDialogTargets.continueButton);

      await actor.browse().check(CreateAppModalTargets.nameInput).hasValue(copyAppName);
      const navPromise = actor.browse().waitForUrl(AppDetailTargets.pathRegex);
      await actor.browse().click(CreateAppModalTargets.saveButton);
      await navPromise;
    },

  updateName:
    (newName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppDetailTargets.generalTab.editGeneralSettingsLink);
      await actor.browse().type(EditGeneralSettingsModalTargets.nameInput, newName);
      await actor.browse().click(EditGeneralSettingsModalTargets.saveButton);
    },

  disable:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppDetailTargets.generalTab.editGeneralSettingsLink);
      await actor.browse().check(EditGeneralSettingsModalTargets.statusSwitch).hasAttribute('aria-checked', 'true');
      await actor.browse().click(EditGeneralSettingsModalTargets.statusToggle);
      await actor.browse().check(EditGeneralSettingsModalTargets.statusSwitch).hasAttribute('aria-checked', 'false');
      await actor.browse().click(EditGeneralSettingsModalTargets.saveButton);
    },

  enable:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppDetailTargets.generalTab.editGeneralSettingsLink);
      await actor.browse().check(EditGeneralSettingsModalTargets.statusSwitch).hasAttribute('aria-checked', 'false');
      await actor.browse().click(EditGeneralSettingsModalTargets.statusToggle);
      await actor.browse().check(EditGeneralSettingsModalTargets.statusSwitch).hasAttribute('aria-checked', 'true');
      await actor.browse().click(EditGeneralSettingsModalTargets.saveButton);
    },

  updateDescription:
    (description: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppDetailTargets.generalTab.editGeneralSettingsLink);
      await actor.browse().type(EditGeneralSettingsModalTargets.descriptionEditor, description);
      await actor.browse().click(EditGeneralSettingsModalTargets.saveButton);
    },

  toggleContentVersioning:
    (targetState: 'enabled' | 'disabled'): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppDetailTargets.generalTab.editGeneralSettingsLink);
      const expectedInitialAria = targetState === 'enabled' ? 'false' : 'true';
      const expectedFinalAria = targetState === 'enabled' ? 'true' : 'false';

      await actor
        .browse()
        .check(EditGeneralSettingsModalTargets.contentVersionStatusSwitch)
        .hasAttribute('aria-checked', expectedInitialAria);
      await actor.browse().click(EditGeneralSettingsModalTargets.contentVersionStatusToggle);
      await actor
        .browse()
        .check(EditGeneralSettingsModalTargets.contentVersionStatusSwitch)
        .hasAttribute('aria-checked', expectedFinalAria);
      await actor.browse().click(EditGeneralSettingsModalTargets.saveButton);
    },

  updateConcurrentEditAlert:
    (enable: boolean): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppDetailTargets.generalTab.editGeneralSettingsLink);
      await actor.attemptsTo(
        StatusSwitchTasks.setAriaSwitch({
          switchTarget: EditGeneralSettingsModalTargets.concurrentEditAlertStatusSwitch,
          toggleTarget: EditGeneralSettingsModalTargets.concurrentEditAlertStatusToggle,
          enabled: enable,
        })
      );
      await actor.browse().click(EditGeneralSettingsModalTargets.saveButton);
    },

  updateDisplayLinkField:
    (fieldName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppDetailTargets.generalTab.editDisplaySettingsLink);
      await actor.browse().click(EditDisplaySettingsModalTargets.displayLinkSelect);
      await actor.browse().click(OptionTargets.byName(fieldName));
      await actor.browse().click(EditDisplaySettingsModalTargets.saveButton);
    },

  updateIntegrationLinkField:
    (fieldName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppDetailTargets.generalTab.editDisplaySettingsLink);
      await actor.browse().click(EditDisplaySettingsModalTargets.integrationLinkSelect);
      await actor.browse().click(OptionTargets.byName(fieldName));
      await actor.browse().click(EditDisplaySettingsModalTargets.saveButton);
    },

  addDisplayField:
    (fieldName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppDetailTargets.generalTab.editDisplaySettingsLink);
      await actor.browse().click(EditDisplaySettingsModalTargets.displayFieldsSelect);
      await actor.browse().click(EditDisplaySettingsModalTargets.unselectedDisplayOption(fieldName));
      await actor.browse().click(EditDisplaySettingsModalTargets.selectorCloseButton);
      await actor.browse().click(EditDisplaySettingsModalTargets.saveButton);
    },

  updatePrimarySortField:
    (fieldName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppDetailTargets.generalTab.editDisplaySettingsLink);
      await actor.browse().click(EditDisplaySettingsModalTargets.primarySortSelect);
      await actor.browse().click(OptionTargets.byName(fieldName));
      await actor.browse().click(EditDisplaySettingsModalTargets.saveButton);
    },

  updateSecondarySortField:
    (fieldName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppDetailTargets.generalTab.editDisplaySettingsLink);
      await actor.browse().click(EditDisplaySettingsModalTargets.secondarySortSelect);
      await actor.browse().click(OptionTargets.byName(fieldName));
      await actor.browse().click(EditDisplaySettingsModalTargets.saveButton);
    },

  setAdminPermissions:
    (
      permissionType: 'Public' | 'Private',
      options?: { user?: string; role?: string; group?: string }
    ): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppDetailTargets.generalTab.editAdminSettingsLink);
      await actor.browse().click(EditAdminSettingsModalTargets.adminPermissionsSelect);
      await actor.browse().click(OptionTargets.byName(permissionType));

      if (options?.user) {
        await actor.attemptsTo(
          DualPaneSelector.selectOption(EditAdminSettingsModalTargets.usersSelector, options.user)
        );
      }
      if (options?.role) {
        await actor.attemptsTo(
          DualPaneSelector.selectOption(EditAdminSettingsModalTargets.rolesSelector, options.role)
        );
      }
      if (options?.group) {
        await actor.attemptsTo(
          DualPaneSelector.selectOption(EditAdminSettingsModalTargets.groupsSelector, options.group)
        );
      }

      await actor.browse().click(EditAdminSettingsModalTargets.saveButton);
      await actor.browse().waitForState(EditAdminSettingsModalTargets.modal, 'hidden');
    },

  updateNotes:
    (notes: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppDetailTargets.generalTab.editNotesSettingLink);
      await actor.browse().type(EditNotesSettingsModalTargets.notesEditor, notes);
      await actor.browse().click(EditNotesSettingsModalTargets.saveButton);
    },

  disableGeocoding:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppDetailTargets.generalTab.editGeocodingSettingsLink);
      await actor.browse().click(EditGeocodingSettingsModalTargets.statusToggle);
      await actor.browse().click(EditGeocodingSettingsModalTargets.saveButton);
    },

  addTextField:
    (fieldName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      if (!(await actor.browse().isVisible(AppLayoutTabTargets.addFieldButton))) {
        await actor.browse().click(AppDetailTargets.layoutTabButton);
      }
      await actor.attemptsTo(FieldTasks.addFromGrid(new TextField({ name: fieldName })));
    },

  openLayoutDesigner:
    (layoutName: string = 'Default Layout'): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      if (!(await actor.browse().isVisible(AppLayoutTabTargets.layoutsGrid))) {
        await actor.browse().click(AppDetailTargets.layoutTabButton);
        await actor.browse().waitForState(AppLayoutTabTargets.layoutsGrid, 'visible');
      }

      const getLayoutDesignResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => AppLayoutTabTargets.getLayoutDesignPathRegex.test(r.url()) && r.status() === 200
        );
      await actor.browse().click(AppLayoutTabTargets.layoutRowByName(layoutName));
      await getLayoutDesignResponse;
      await actor.browse().waitForTimeout(1000);
    },

  addTextFieldInLayoutDesigner:
    (fieldName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(AppTasks.addLayoutItemInLayoutDesigner(new TextField({ name: fieldName })));
    },

  addLayoutItemInLayoutDesigner:
    (item: LayoutItem): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(FieldTasks.addFromLayoutDesigner(item));
    },

  dragFieldOntoLayout:
    ({
      tabName,
      sectionName,
      column,
      row,
      fieldName,
    }: {
      tabName?: string;
      sectionName: string;
      column: number;
      row: number;
      fieldName: string;
    }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await ensureDesignerItemsTab(actor, 'fields');
      const dropzone = await actor.asks(AppQuestions.layoutDropzone({ tabName, sectionName, column, row }));
      await actor
        .browse()
        .dragWithMouse(
          AppLayoutTabTargets.designer.fieldFromBank(fieldName),
          dropzone,
          AppLayoutTabTargets.designer.dropLocation
        );
    },

  removeFieldFromLayout:
    (location: LayoutDropzoneLocation): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const dropzone = await actor.asks(AppQuestions.layoutDropzone(location));
      await actor.browse().hover(dropzone);
      await actor.browse().click(AppLayoutTabTargets.designer.removeFieldFromDropzoneButton(dropzone));
    },

  dragObjectOntoLayout:
    ({
      tabName,
      sectionName,
      column,
      row,
      objectName,
    }: {
      tabName?: string;
      sectionName: string;
      column: number;
      row: number;
      objectName: string;
    }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await ensureDesignerItemsTab(actor, 'objects');
      const dropzone = await actor.asks(AppQuestions.layoutDropzone({ tabName, sectionName, column, row }));
      await actor
        .browse()
        .dragWithMouse(
          AppLayoutTabTargets.designer.objectFromBank(objectName),
          dropzone,
          AppLayoutTabTargets.designer.dropLocation
        );
    },

  removeObjectFromLayout:
    (location: LayoutDropzoneLocation): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const dropzone = await actor.asks(AppQuestions.layoutDropzone(location));
      await actor.browse().hover(dropzone);
      await actor.browse().click(AppLayoutTabTargets.designer.removeObjectFromDropzoneButton(dropzone));
    },

  addLayout:
    (layoutName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      if (!(await actor.browse().isVisible(AppLayoutTabTargets.layoutsGrid))) {
        await actor.browse().click(AppDetailTargets.layoutTabButton);
        await actor.browse().waitForState(AppLayoutTabTargets.layoutsGrid, 'visible');
      }

      await actor.browse().click(AppLayoutTabTargets.addLayoutLink);
      await actor.browse().fill(CreateDialogTargets.nameInput, layoutName);
      await actor.browse().click(CreateDialogTargets.saveButton);
      await actor.browse().waitForState(AppLayoutTabTargets.designer.dialog, 'visible');
      await actor.browse().waitForState(AppLayoutTabTargets.designer.editLayoutPropertiesLink, 'visible');
    },

  copyLayout:
    (layoutName: string, copiedLayoutName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const row = AppLayoutTabTargets.layoutRowByName(layoutName);
      await actor.browse().hover(row);
      await actor.browse().click(AppLayoutTabTargets.copyLayoutButtonInRow(layoutName));
      await actor.browse().fill(AppLayoutTabTargets.copyLayoutDialog.layoutNameInput, copiedLayoutName);
      await actor.browse().click(AppLayoutTabTargets.copyLayoutDialog.copyButton);
      await actor.browse().waitForState(AppLayoutTabTargets.designer.dialog, 'visible');
      await actor.browse().waitForState(AppLayoutTabTargets.designer.editLayoutPropertiesLink, 'visible');
    },

  deleteLayout:
    (layoutName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const row = AppLayoutTabTargets.layoutRowByName(layoutName);
      await actor.browse().hover(row);
      await actor.browse().click(AppLayoutTabTargets.deleteLayoutButtonInRow(layoutName));
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await actor.browse().waitForDetached(DeleteDialogTargets.dialog);
      await actor.browse().waitForDetached(DeleteDialogTargets.overlay);
    },

  updateLayoutProperties:
    ({ name, enabled, roleNames }: UpdateLayoutPropertiesOptions): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const designer = AppLayoutTabTargets.designer;
      const modal = designer.editPropertiesModal;

      await actor.browse().click(designer.editLayoutPropertiesLink);
      await actor.browse().waitForState(modal.modal, 'visible');

      if (name !== undefined) {
        await actor.browse().fill(modal.nameInput, name);
      }

      if (enabled !== undefined) {
        await actor.attemptsTo(
          StatusSwitchTasks.setAriaSwitch({
            switchTarget: modal.statusSwitch,
            toggleTarget: modal.statusToggle,
            enabled,
          })
        );
      }

      if (roleNames && roleNames.length > 0) {
        await actor.attemptsTo(DualPaneSelector.selectOptions(modal.rolesSelector, roleNames, designer.frame));
      }

      await actor.browse().click(modal.applyButton);
      await actor.browse().waitForState(modal.modal, 'hidden');
    },

  addLayoutTab:
    ({ name, index }: { name: string; index?: number }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const designer = AppLayoutTabTargets.designer;
      await ensureHorizontalOrientation(actor);
      await ensureDesignerItemsTab(actor, 'objects');

      const dropzone = await resolveHorizontalTabDropzone(actor, index);
      await actor.browse().dragWithMouse(designer.objectFromBank('New Tab'), dropzone, designer.hoveredTabDropzone);
      await actor.browse().fill(designer.nameEditor.input, name);
      await actor.browse().click(designer.nameEditor.applyButton);
    },

  updateLayoutTabName:
    ({ currentName, newName }: { currentName: string; newName: string }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const designer = AppLayoutTabTargets.designer;
      await actor.browse().hover(designer.canvasTabButton(currentName));
      await actor.browse().click(designer.editTabNameButton(currentName));
      await actor.browse().fill(designer.nameEditor.input, newName);
      await actor.browse().click(designer.nameEditor.applyButton);
    },

  deleteLayoutTab:
    (tabName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const designer = AppLayoutTabTargets.designer;
      await actor.browse().click(designer.configureTabSetLink);
      await actor.browse().click(designer.configureTabSetModal.deleteTabButton(tabName));
      await actor.browse().click(designer.configureTabSetModal.applyButton);
    },

  dragLayoutTab:
    ({ tabName, index }: { tabName: string; index: number }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const designer = AppLayoutTabTargets.designer;
      await ensureHorizontalOrientation(actor);

      await actor.browse().hover(designer.canvasTabButton(tabName));
      await actor.browse().mouseDown();
      await actor.browse().moveMouse(0, 0);
      const dropzone = await resolveHorizontalTabDropzone(actor, index);
      await actor.browse().hover(dropzone);
      await actor.browse().waitForState(designer.hoveredTabDropzone, 'visible');
      await actor.browse().mouseUp();
    },

  addLayoutSection:
    ({
      tabName,
      sectionName,
      placementIndex,
    }: {
      tabName?: string;
      sectionName: string;
      placementIndex?: number;
    }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const designer = AppLayoutTabTargets.designer;
      await ensureDesignerItemsTab(actor, 'objects');

      const { dropzone, hoveredDropzone } = await resolveLayoutSectionDropzone(actor, tabName, placementIndex);
      await actor.browse().dragWithMouse(designer.objectFromBank('New Section'), dropzone, hoveredDropzone);

      const initialSectionName = (await actor.browse().inputValue(designer.nameEditor.input)).trim();
      await actor.attemptsTo(
        AppTasks.updateLayoutSectionName({ tabName, sectionName: initialSectionName, newSectionName: sectionName })
      );
    },

  updateLayoutSectionName:
    ({
      tabName,
      sectionName,
      newSectionName,
    }: {
      tabName?: string;
      sectionName: string;
      newSectionName: string;
    }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const designer = AppLayoutTabTargets.designer;
      if (await actor.browse().isVisible(designer.nameEditor.container)) {
        await actor.browse().click(designer.nameEditor.applyButton);
      }

      const section = await actor.asks(AppQuestions.layoutDesignerSection({ tabName, sectionName }));
      await actor.browse().hover(designer.sectionHeading(section));
      await actor.browse().click(designer.editSectionNameButton(section));
      await actor.browse().fill(designer.nameEditor.input, newSectionName);
      await actor.browse().click(designer.nameEditor.applyButton);
    },

  updateLayoutSectionColumnCount:
    ({
      tabName,
      sectionName,
      columnCount,
    }: {
      tabName?: string;
      sectionName: string;
      columnCount: number;
    }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      if (columnCount < 1 || columnCount > 12) {
        throw new Error('Column count must be between 1 and 12');
      }

      const designer = AppLayoutTabTargets.designer;
      const section = await actor.asks(AppQuestions.layoutDesignerSection({ tabName, sectionName }));
      await actor.browse().click(designer.sectionColumnsListbox(section));
      await actor.browse().click(designer.sectionColumnOption(columnCount));
    },

  deleteLayoutSection:
    ({ tabName, sectionName }: { tabName?: string; sectionName: string }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const designer = AppLayoutTabTargets.designer;
      const section = await actor.asks(AppQuestions.layoutDesignerSection({ tabName, sectionName }));
      await actor.browse().click(designer.sectionDeleteLink(section));

      if (await actor.browse().isVisibleWithin(designer.deleteSectionDialog, 2000)) {
        await actor.browse().click(designer.deleteSectionConfirmButton);
        await actor.browse().waitForState(designer.deleteSectionDialog, 'hidden');
      }
    },

  dragLayoutSection:
    ({
      tabName,
      sectionName,
      placementIndex,
    }: {
      tabName?: string;
      sectionName: string;
      placementIndex: number;
    }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const designer = AppLayoutTabTargets.designer;
      const section = await actor.asks(AppQuestions.layoutDesignerSection({ tabName, sectionName }));
      const { dropzone, hoveredDropzone } = await resolveLayoutSectionDropzone(actor, tabName, placementIndex);
      await actor.browse().dragWithMouse(designer.sectionHandle(section), dropzone, hoveredDropzone);
    },

  saveLayout:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const saveResponse = actor
        .browse()
        .waitForResponse((r: Response) => AppLayoutTabTargets.saveLayoutPathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().click(AppLayoutTabTargets.designer.saveButton);
      await saveResponse;
    },

  closeLayout:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppLayoutTabTargets.designer.closeButton);
      await actor.browse().waitForState(AppLayoutTabTargets.designer.dialog, 'hidden');
    },

  saveAndCloseLayout:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const saveResponse = actor
        .browse()
        .waitForResponse((r: Response) => AppLayoutTabTargets.saveLayoutPathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().click(AppLayoutTabTargets.designer.saveAndCloseButton);
      await saveResponse;
      await actor.browse().waitForState(AppLayoutTabTargets.designer.dialog, 'hidden');
    },

  enableGeocoding:
    (mapping: { address: string; city: string; state: string; zip: string }): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      for (const field of [mapping.address, mapping.city, mapping.state, mapping.zip]) {
        await actor.attemptsTo(AppTasks.addTextField(field));
      }

      await actor.browse().click(AppDetailTargets.generalTabButton);
      await actor.browse().click(AppDetailTargets.generalTab.editGeocodingSettingsLink);
      await actor.browse().click(EditGeocodingSettingsModalTargets.statusToggle);

      await actor.browse().check(EditGeocodingSettingsModalTargets.geocodingDataGrid).isVisible();

      await actor.browse().click(EditGeocodingSettingsModalTargets.addressSelect);
      await actor.browse().click(OptionTargets.byName(mapping.address));

      await actor.browse().click(EditGeocodingSettingsModalTargets.citySelect);
      await actor.browse().click(OptionTargets.byName(mapping.city));

      await actor.browse().click(EditGeocodingSettingsModalTargets.stateSelect);
      await actor.browse().click(OptionTargets.byName(mapping.state));

      await actor.browse().click(EditGeocodingSettingsModalTargets.zipSelect);
      await actor.browse().click(OptionTargets.byName(mapping.zip));

      await actor.browse().click(EditGeocodingSettingsModalTargets.saveButton);
    },

  searchFieldsAndObjectsReport:
    (searchTerm: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      if (!(await actor.browse().isVisible(AppLayoutTabTargets.filterFieldsInput))) {
        await actor.browse().click(AppDetailTargets.layoutTabButton);
      }

      const searchResponse = actor.browse().waitForResponse((r: Response) => {
        if (!AppLayoutTabTargets.getLayoutItemPathRegex.test(r.url()) || r.request().method() !== 'POST') {
          return false;
        }
        const requestBody = r.request().postDataJSON() as { searchTerm?: string } | null;
        return requestBody?.searchTerm === searchTerm && r.status() === 200;
      });

      await actor.browse().fill(AppLayoutTabTargets.filterFieldsInput, searchTerm);
      await searchResponse;
    },

  exportFieldsAndObjectsReport:
    ({
      format,
      fields,
      includeUsage = false,
      includeListValueGUIDs = false,
      messageCenterAlertsOnly = false,
    }: ExportFieldsAndObjectsReportOptions): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      if (!(await actor.browse().isVisible(AppLayoutTabTargets.exportFieldsAndObjectsReportButton))) {
        await actor.browse().click(AppDetailTargets.layoutTabButton);
      }

      await actor.browse().click(AppLayoutTabTargets.exportFieldsAndObjectsReportButton);

      const modal = AppLayoutTabTargets.exportFieldsAndObjectsModal;
      await actor.browse().waitForState(modal.modal, 'visible');

      await actor.browse().click(modal.formatSelect);
      await actor.browse().click(OptionTargets.byName(format));

      await actor.attemptsTo(
        DualPaneSelector.removeAllOptions(modal.fieldsSelector),
        DualPaneSelector.selectOptions(modal.fieldsSelector, fields)
      );

      if (format !== 'Excel') {
        await actor.browse().setChecked(modal.includeUsageCheckbox, includeUsage);
      }

      if (fields.includes('List Values')) {
        await actor.browse().setChecked(modal.includeListValueGUIDsCheckbox, includeListValueGUIDs);
      }

      await actor.browse().setChecked(modal.messageCenterAlertsOnlyCheckbox, messageCenterAlertsOnly);
      await actor.browse().click(modal.exportButton);
    },

  deleteApps:
    (appsToDelete: string[]): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const uniqueApps = [...new Set(appsToDelete)];
      if (uniqueApps.length === 0) return;

      await actor.attemptsTo(AppTasks.goto());

      for (const appName of uniqueApps) {
        await actor.attemptsTo(AppTasks.filterBy(appName));
        const row = AppsPageTargets.rowByName(appName);
        const isVisible = await actor.browse().isVisibleWithin(row, 3000);
        if (isVisible) {
          await actor.browse().hover(row);
          await actor.browse().click(AppsPageTargets.deleteButtonInRow(appName));
          await actor.browse().type(DeleteAppDialogTargets.confirmationInput, 'OK');
          const deleteResponse = actor
            .browse()
            .waitForResponse((r: Response) => r.url().includes('/Delete') && r.status() === 200);
          await actor.browse().click(DeleteAppDialogTargets.deleteButton);
          await deleteResponse;
          await actor.browse().waitForDetached(DeleteAppDialogTargets.dialog);
        }
      }
    },
};
