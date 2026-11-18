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
} from './apps.targets.js';
import { DualPaneSelector } from '../common/controls/dualPaneSelector.js';

export const AppTasks = {
  goto: (): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    const getAppsListResponse = actor.page.waitForResponse(
      r => r.url().includes(AppsPageTargets.getAppsListPath) && r.status() === 200
    );
    await actor.browse().goto(AppsPageTargets.route);
    await getAppsListResponse;
  },

  create: (appName: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.attemptsTo(AppTasks.goto());
    await actor.browse().click(AppsPageTargets.createAppButton);

    await actor.browse().click(CreateAppDialogTargets.continueButton);
    await actor.browse().type(CreateAppModalTargets.nameInput, appName);

    const navPromise = actor.page.waitForURL(AppDetailTargets.pathRegex);
    await actor.browse().click(CreateAppModalTargets.saveButton);
    await navPromise;
  },

  createViaHeader: (appName: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().hover(AdminNavTargets.adminCreateButton);
    await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
    await actor.browse().click(AdminNavTargets.menuOption('App'));

    await actor.browse().click(CreateAppDialogTargets.continueButton);
    await actor.browse().type(CreateAppModalTargets.nameInput, appName);

    const navPromise = actor.page.waitForURL(AppDetailTargets.pathRegex);
    await actor.browse().click(CreateAppModalTargets.saveButton);
    await navPromise;
  },

  createViaTile: (appName: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().hover(AdminTileTargets.appTileLink);
    await actor.browse().check(AdminTileTargets.appTileCreateButton).isVisible();
    await actor.browse().click(AdminTileTargets.appTileCreateButton);

    await actor.browse().click(CreateAppDialogTargets.continueButton);
    await actor.browse().type(CreateAppModalTargets.nameInput, appName);

    const navPromise = actor.page.waitForURL(AppDetailTargets.pathRegex);
    await actor.browse().click(CreateAppModalTargets.saveButton);
    await navPromise;
  },

  copyViaHeader: (sourceAppName: string, copyAppName: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().hover(AdminNavTargets.adminCreateButton);
    await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
    await actor.browse().click(AdminNavTargets.menuOption('App'));

    await actor.browse().check(CreateAppDialogTargets.copyFromRadioButton).isVisible();
    await actor.browse().click(CreateAppDialogTargets.copyFromRadioButton);
    await actor.browse().click(CreateAppDialogTargets.copyFromDropdown);
    await actor.browse().click(CreateAppDialogTargets.getAppToCopy(sourceAppName));
    await actor.browse().click(CreateAppDialogTargets.continueButton);

    await actor.browse().check(CreateAppModalTargets.nameInput).hasValue(copyAppName);
    const navPromise = actor.page.waitForURL(AppDetailTargets.pathRegex);
    await actor.browse().click(CreateAppModalTargets.saveButton);
    await navPromise;
  },

  copyViaTile: (sourceAppName: string, copyAppName: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().hover(AdminTileTargets.appTileLink);
    await actor.browse().check(AdminTileTargets.appTileCreateButton).isVisible();
    await actor.browse().click(AdminTileTargets.appTileCreateButton);

    await actor.browse().check(CreateAppDialogTargets.copyFromRadioButton).isVisible();
    await actor.browse().click(CreateAppDialogTargets.copyFromRadioButton);
    await actor.browse().click(CreateAppDialogTargets.copyFromDropdown);
    await actor.browse().click(CreateAppDialogTargets.getAppToCopy(sourceAppName));
    await actor.browse().click(CreateAppDialogTargets.continueButton);

    await actor.browse().check(CreateAppModalTargets.nameInput).hasValue(copyAppName);
    const navPromise = actor.page.waitForURL(AppDetailTargets.pathRegex);
    await actor.browse().click(CreateAppModalTargets.saveButton);
    await navPromise;
  },

  copyFromGrid: (sourceAppName: string, copyAppName: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.attemptsTo(AppTasks.goto());
    await actor.browse().click(AppsPageTargets.createAppButton);

    await actor.browse().check(CreateAppDialogTargets.copyFromRadioButton).isVisible();
    await actor.browse().click(CreateAppDialogTargets.copyFromRadioButton);
    await actor.browse().click(CreateAppDialogTargets.copyFromDropdown);
    await actor.browse().click(CreateAppDialogTargets.getAppToCopy(sourceAppName));
    await actor.browse().click(CreateAppDialogTargets.continueButton);

    await actor.browse().check(CreateAppModalTargets.nameInput).hasValue(copyAppName);
    const navPromise = actor.page.waitForURL(AppDetailTargets.pathRegex);
    await actor.browse().click(CreateAppModalTargets.saveButton);
    await navPromise;
  },

  updateName: (newName: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(AppDetailTargets.generalTab.editGeneralSettingsLink);
    await actor.browse().type(EditGeneralSettingsModalTargets.nameInput, newName);
    await actor.browse().click(EditGeneralSettingsModalTargets.saveButton);
  },

  disable: (): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(AppDetailTargets.generalTab.editGeneralSettingsLink);
    await actor.browse().check(EditGeneralSettingsModalTargets.statusSwitch).hasAttribute('aria-checked', 'true');
    await actor.browse().click(EditGeneralSettingsModalTargets.statusToggle);
    await actor.browse().check(EditGeneralSettingsModalTargets.statusSwitch).hasAttribute('aria-checked', 'false');
    await actor.browse().click(EditGeneralSettingsModalTargets.saveButton);
  },

  enable: (): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(AppDetailTargets.generalTab.editGeneralSettingsLink);
    await actor.browse().check(EditGeneralSettingsModalTargets.statusSwitch).hasAttribute('aria-checked', 'false');
    await actor.browse().click(EditGeneralSettingsModalTargets.statusToggle);
    await actor.browse().check(EditGeneralSettingsModalTargets.statusSwitch).hasAttribute('aria-checked', 'true');
    await actor.browse().click(EditGeneralSettingsModalTargets.saveButton);
  },

  updateDescription: (description: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(AppDetailTargets.generalTab.editGeneralSettingsLink);
    await actor.browse().type(EditGeneralSettingsModalTargets.descriptionEditor, description);
    await actor.browse().click(EditGeneralSettingsModalTargets.saveButton);
  },

  toggleContentVersioning: (targetState: 'enabled' | 'disabled'): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(AppDetailTargets.generalTab.editGeneralSettingsLink);
    const expectedInitialAria = targetState === 'enabled' ? 'false' : 'true';
    const expectedFinalAria = targetState === 'enabled' ? 'true' : 'false';

    await actor.browse().check(EditGeneralSettingsModalTargets.contentVersionStatusSwitch).hasAttribute('aria-checked', expectedInitialAria);
    await actor.browse().click(EditGeneralSettingsModalTargets.contentVersionStatusToggle);
    await actor.browse().check(EditGeneralSettingsModalTargets.contentVersionStatusSwitch).hasAttribute('aria-checked', expectedFinalAria);
    await actor.browse().click(EditGeneralSettingsModalTargets.saveButton);
  },

  updateConcurrentEditAlert: (enable: boolean): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(AppDetailTargets.generalTab.editGeneralSettingsLink);
    const switchTarget = EditGeneralSettingsModalTargets.concurrentEditAlertStatusSwitch(actor.page);
    const currentChecked = (await switchTarget.getAttribute('aria-checked')) === 'true';
    if (currentChecked !== enable) {
      await switchTarget.locator('span').nth(3).click();
    }
    await actor.browse().click(EditGeneralSettingsModalTargets.saveButton);
  },

  updateDisplayLinkField: (fieldName: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(AppDetailTargets.generalTab.editDisplaySettingsLink);
    await actor.browse().click(EditDisplaySettingsModalTargets.displayLinkSelect);
    await actor.page.getByRole('option', { name: fieldName }).click();
    await actor.browse().click(EditDisplaySettingsModalTargets.saveButton);
  },

  updateIntegrationLinkField: (fieldName: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(AppDetailTargets.generalTab.editDisplaySettingsLink);
    await actor.browse().click(EditDisplaySettingsModalTargets.integrationLinkSelect);
    await actor.page.getByRole('option', { name: fieldName }).click();
    await actor.browse().click(EditDisplaySettingsModalTargets.saveButton);
  },

  addDisplayField: (fieldName: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(AppDetailTargets.generalTab.editDisplaySettingsLink);
    await actor.browse().click(EditDisplaySettingsModalTargets.displayFieldsSelect);
    await actor.browse().click(EditDisplaySettingsModalTargets.unselectedDisplayOption(fieldName));
    await actor.browse().click(EditDisplaySettingsModalTargets.selectorCloseButton);
    await actor.browse().click(EditDisplaySettingsModalTargets.saveButton);
  },

  updatePrimarySortField: (fieldName: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(AppDetailTargets.generalTab.editDisplaySettingsLink);
    await actor.browse().click(EditDisplaySettingsModalTargets.primarySortSelect);
    await actor.page.getByRole('option', { name: fieldName }).click();
    await actor.browse().click(EditDisplaySettingsModalTargets.saveButton);
  },

  updateSecondarySortField: (fieldName: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(AppDetailTargets.generalTab.editDisplaySettingsLink);
    await actor.browse().click(EditDisplaySettingsModalTargets.secondarySortSelect);
    await actor.page.getByRole('option', { name: fieldName }).click();
    await actor.browse().click(EditDisplaySettingsModalTargets.saveButton);
  },

  setAdminPermissions: (permissionType: 'Public' | 'Private', options?: { user?: string; role?: string; group?: string }): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(AppDetailTargets.generalTab.editAdminSettingsLink);
    await actor.browse().click(EditAdminSettingsModalTargets.adminPermissionsSelect);
    await actor.page.getByRole('option', { name: permissionType }).click();

    if (options?.user) {
      await actor.attemptsTo(DualPaneSelector.selectOption(EditAdminSettingsModalTargets.usersSelector, options.user));
    }
    if (options?.role) {
      await actor.attemptsTo(DualPaneSelector.selectOption(EditAdminSettingsModalTargets.rolesSelector, options.role));
    }
    if (options?.group) {
      await actor.attemptsTo(DualPaneSelector.selectOption(EditAdminSettingsModalTargets.groupsSelector, options.group));
    }

    await actor.browse().click(EditAdminSettingsModalTargets.saveButton);
    await EditAdminSettingsModalTargets.modal(actor.page).waitFor({ state: 'hidden' });
  },

  updateNotes: (notes: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(AppDetailTargets.generalTab.editNotesSettingLink);
    await actor.browse().type(EditNotesSettingsModalTargets.notesEditor, notes);
    await actor.browse().click(EditNotesSettingsModalTargets.saveButton);
  },

  disableGeocoding: (): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(AppDetailTargets.generalTab.editGeocodingSettingsLink);
    await actor.browse().click(EditGeocodingSettingsModalTargets.statusToggle);
    await actor.browse().click(EditGeocodingSettingsModalTargets.saveButton);
  },

  addTextField: (fieldName: string): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    await actor.browse().click(AppDetailTargets.layoutTabButton);
    await actor.browse().click(AppLayoutTabTargets.addFieldButton);
    await actor.browse().click(AppLayoutTabTargets.addLayoutItemMenu('Text'));

    const addItemResponse = actor.page.waitForResponse(
      r => AppLayoutTabTargets.addItemPathRegex.test(r.url()) && r.status() === 200
    );
    await actor.browse().click(AppLayoutTabTargets.addLayoutItemDialogContinueButton);
    await addItemResponse;

    const modal = AppLayoutTabTargets.fieldModal;
    await modal.nameInput(actor.page).fill(fieldName);

    await modal.securityTabButton(actor.page).click();
    await modal.securityViewSelect(actor.page).click();
    await modal.frame(actor.page).getByRole('option', { name: 'Public' }).click();

    const saveFieldResponse = actor.page.waitForResponse(
      r => AppLayoutTabTargets.addOrEditPathRegex.test(r.url()) && r.status() === 200
    );
    await modal.saveButton(actor.page).click();
    await saveFieldResponse;
  },

  enableGeocoding: (mapping: {
    address: string;
    city: string;
    state: string;
    zip: string;
  }): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    for (const field of [mapping.address, mapping.city, mapping.state, mapping.zip]) {
      await actor.attemptsTo(AppTasks.addTextField(field));
    }

    await actor.browse().click(AppDetailTargets.generalTabButton);
    await actor.browse().click(AppDetailTargets.generalTab.editGeocodingSettingsLink);
    await actor.browse().click(EditGeocodingSettingsModalTargets.statusToggle);

    await actor.browse().check(EditGeocodingSettingsModalTargets.geocodingDataGrid).isVisible();

    await actor.browse().click(EditGeocodingSettingsModalTargets.addressSelect);
    await actor.page.getByRole('option', { name: mapping.address }).click();

    await actor.browse().click(EditGeocodingSettingsModalTargets.citySelect);
    await actor.page.getByRole('option', { name: mapping.city }).click();

    await actor.browse().click(EditGeocodingSettingsModalTargets.stateSelect);
    await actor.page.getByRole('option', { name: mapping.state }).click();

    await actor.browse().click(EditGeocodingSettingsModalTargets.zipSelect);
    await actor.page.getByRole('option', { name: mapping.zip }).click();

    await actor.browse().click(EditGeocodingSettingsModalTargets.saveButton);
  },

  deleteApps: (appsToDelete: string[]): Task<WebActor> => async (actor: WebActor): Promise<void> => {
    if (appsToDelete.length === 0) return;

    await actor.attemptsTo(AppTasks.goto());

    for (const appName of appsToDelete) {
      const row = AppsPageTargets.rowByName(appName);
      const isVisible = await actor.browse().isVisible(row);
      if (isVisible) {
        await actor.browse().hover(row);
        await actor.browse().click(AppsPageTargets.deleteButtonInRow(appName));
        await actor.browse().type(DeleteAppDialogTargets.confirmationInput, 'OK');
        const deleteResponse = actor.page.waitForResponse(
          r => r.url().includes('/Delete') && r.status() === 200
        );
        await actor.browse().click(DeleteAppDialogTargets.deleteButton);
        await deleteResponse;
        await actor.browse().waitForDetached(DeleteAppDialogTargets.dialog);
      }
    }
  },
};
