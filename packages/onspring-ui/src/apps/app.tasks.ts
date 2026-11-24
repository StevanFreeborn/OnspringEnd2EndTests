import { Response } from '@playwright/test';
import {
  DateField,
  LayoutItem,
  ListField,
  NumberField,
  ReferenceField,
  TextField,
  TimeSpanField,
} from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { AdminNavTargets, AdminTileTargets } from '../common/navs/adminNav.targets.js';
import { TabbedColorPickerTasks } from '../common/controls/tabbedColorPicker.js';
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
  ExportFieldsAndObjectsReportOptions,
  OptionTargets,
} from './apps.targets.js';
import { DualPaneSelector } from '../common/controls/dualPaneSelector.js';
import { KendoGridTasks } from '../common/controls/kendoGrid.js';
import { StatusSwitchTasks } from '../common/controls/statusSwitch.js';

async function resolveClampedLayoutDropzone(
  actor: WebActor,
  sectionTarget: Target,
  desiredColumn: number,
  desiredRow: number
): Promise<Target> {
  await actor.browse().waitForState(sectionTarget, 'visible');

  const itemsTarget = AppLayoutTabTargets.designer.renderedItemsInSection(sectionTarget);
  const columnAttrs = await actor.browse().getAttributes(itemsTarget, 'data-column');
  const rowAttrs = await actor.browse().getAttributes(itemsTarget, 'data-row');

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

  return AppLayoutTabTargets.designer.dropzoneInSectionAt(sectionTarget, column, row);
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

  openLayoutDesigner:
    (layoutName: string = 'Default Layout'): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(AppDetailTargets.layoutTabButton);
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
      if (
        !(
          item instanceof TextField ||
          item instanceof ListField ||
          item instanceof DateField ||
          item instanceof ReferenceField ||
          item instanceof NumberField ||
          item instanceof TimeSpanField
        )
      ) {
        throw new Error(`Unsupported layout item type "${item.type}" in addLayoutItemInLayoutDesigner.`);
      }

      const designer = AppLayoutTabTargets.designer;
      const frameNumber = 1;

      if (await actor.browse().isVisible(designer.addObjectButton)) {
        await actor.browse().click(designer.fieldsTabButton);
      }

      await actor.browse().waitForState(designer.addFieldButton, 'visible');
      await actor.browse().click(designer.addFieldButton);
      await actor.browse().click(designer.addFieldMenuOption(item.type));

      const addItemResponse = actor
        .browse()
        .waitForResponse((r: Response) => AppLayoutTabTargets.addItemPathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().click(AppLayoutTabTargets.addLayoutItemDialogContinueButton);
      await addItemResponse;

      const modal = AppLayoutTabTargets.fieldModal;
      await actor.browse().waitForState(modal.nameInput(frameNumber), 'visible');
      await actor.browse().fill(modal.nameInput(frameNumber), item.name);

      if (item instanceof ListField) {
        for (const listValue of item.values) {
          await actor.browse().click(modal.listValuesGrid.addValueButton(frameNumber));
          await actor.browse().fill(modal.listValuesGrid.lastRowValueInput(frameNumber), listValue.value);
          await actor
            .browse()
            .fill(modal.listValuesGrid.lastRowNumericValueInput(frameNumber), listValue.numericValue.toString());

          if (listValue.color) {
            await actor.attemptsTo(
              TabbedColorPickerTasks.selectColor(
                modal.listValuesGrid.lastRowColorPicker(frameNumber),
                listValue.color,
                modal.frame(frameNumber)
              )
            );
          }
        }
      } else if (item instanceof DateField) {
        await actor.browse().click(modal.dateDisplaySelect(frameNumber));
        await actor.browse().click(modal.dateDisplayOption(item.display, frameNumber));
      } else if (item instanceof ReferenceField) {
        const initialDisplayFieldResponse = actor
          .browse()
          .waitForResponse((r: Response) => modal.referenceDisplayFieldsPathRegex.test(r.url()) && r.status() === 200);
        await actor.browse().click(modal.referenceSelect(frameNumber));
        await initialDisplayFieldResponse;

        const referenceSelectText = await actor.browse().getText(modal.referenceSelect(frameNumber));
        if (referenceSelectText.includes(item.reference)) {
          await actor.browse().click(modal.referenceOption(item.reference, frameNumber));
        } else {
          const displayFieldResponse = actor
            .browse()
            .waitForResponse(
              (r: Response) => modal.referenceDisplayFieldsPathRegex.test(r.url()) && r.status() === 200
            );
          await actor.browse().click(modal.referenceOption(item.reference, frameNumber));
          await displayFieldResponse;
        }

        await actor.browse().waitForState(modal.selectedGridFields(frameNumber), 'visible');
      }

      if (item.permissions.length > 0) {
        throw new Error('Role-based field permissions in addLayoutItemInLayoutDesigner are not implemented.');
      }

      await actor.browse().click(modal.securityTabButton(frameNumber));
      await actor.browse().click(modal.securityViewSelect(frameNumber));
      await actor.browse().click(modal.securityOption('Public', frameNumber));

      const saveFieldResponse = actor
        .browse()
        .waitForResponse((r: Response) => AppLayoutTabTargets.addOrEditPathRegex.test(r.url()) && r.status() === 200);
      await actor.browse().click(modal.saveButton);
      await saveFieldResponse;
      await actor.browse().waitForState(designer.fieldFromBank(item.name), 'visible');
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
      const designer = AppLayoutTabTargets.designer;

      if (await actor.browse().isVisible(designer.addObjectButton)) {
        await actor.browse().click(designer.fieldsTabButton);
      }

      let sectionTarget: Target;

      if (tabName === undefined) {
        sectionTarget = designer.standaloneSectionByName(sectionName);
      } else if (!(await actor.browse().isVisible(designer.canvasTabStrip))) {
        sectionTarget = designer.canvasSectionByName(sectionName);
      } else {
        await actor.browse().click(designer.canvasTabText(tabName));
        const tabId = await actor.browse().getAttribute(designer.canvasTabButton(tabName), 'data-canvas-tab');
        if (tabId === null) {
          throw new Error(`Layout designer tab "${tabName}" did not expose a data-canvas-tab attribute.`);
        }
        sectionTarget = designer.canvasSectionInTab(tabId, sectionName);
      }

      const dropzone = await resolveClampedLayoutDropzone(actor, sectionTarget, column, row);
      await actor.browse().dragWithMouse(designer.fieldFromBank(fieldName), dropzone, designer.dropLocation);
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
