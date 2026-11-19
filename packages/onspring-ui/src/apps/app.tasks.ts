import { Response } from '@playwright/test';
import { Task } from '@stevanfreeborn/screenplay';
import { WebActor } from '@stevanfreeborn/screenplay-playwright';
import { AdminNavTargets, AdminTileTargets } from '../common/navs/adminNav.targets.js';
import {
  AppDetailTargets,
  AppLayoutTabTargets,
  AppsPageTargets,
  CreateAppDialogTargets,
  CreateAppModalTargets,
  DeleteAppDialogTargets,
  EditAdminSettingsModalTargets,
  EditDisplaySettingsModalTargets,
  EditGeneralSettingsModalTargets,
  EditGeocodingSettingsModalTargets,
  EditNotesSettingsModalTargets,
  OptionTargets,
} from './apps.targets.js';
import { DualPaneSelector } from '../common/controls/dualPaneSelector.js';

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
      const switchTarget = EditGeneralSettingsModalTargets.concurrentEditAlertStatusSwitch;
      const currentChecked = (await actor.browse().locator(switchTarget).getAttribute('aria-checked')) === 'true';
      if (currentChecked !== enable) {
        await actor.browse().click(EditGeneralSettingsModalTargets.concurrentEditAlertStatusToggle);
      }
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
      await actor.browse().click(AppDetailTargets.layoutTabButton);
      await actor.browse().click(AppLayoutTabTargets.addFieldButton);
      await actor.browse().click(AppLayoutTabTargets.addLayoutItemMenu('Text'));

      const addItemResponse = actor
        .browse()
        .waitForResponse((r: Response) => AppLayoutTabTargets.addItemPathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().click(AppLayoutTabTargets.addLayoutItemDialogContinueButton);
      await addItemResponse;

      const modal = AppLayoutTabTargets.fieldModal;
      await actor.browse().fill(modal.nameInput(), fieldName);

      await actor.browse().click(modal.securityTabButton());
      await actor.browse().click(modal.securityViewSelect());
      await actor.browse().click(modal.securityOption('Public'));

      const saveFieldResponse = actor
        .browse()
        .waitForResponse((r: Response) => AppLayoutTabTargets.addOrEditPathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().click(modal.saveButton);
      await saveFieldResponse;
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

  deleteApps:
    (appsToDelete: string[]): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      if (appsToDelete.length === 0) return;

      await actor.attemptsTo(AppTasks.goto());

      for (const appName of appsToDelete) {
        const row = AppsPageTargets.rowByName(appName);
        const isVisible = await actor.browse().isVisible(row);
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
