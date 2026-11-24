import { Response } from '@playwright/test';
import {
  BitsightDataConnector,
  DataConnector,
  DataConnectorType,
  SecureFileDataConnector,
} from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DateFieldControlTasks } from '../common/controls/dateFieldControl.js';
import { DualPaneSelector } from '../common/controls/dualPaneSelector.js';
import { KendoGridTasks } from '../common/controls/kendoGrid.js';
import { MappingGridTasks } from '../common/controls/mappingGrid.js';
import { StatusSwitchTasks } from '../common/controls/statusSwitch.js';
import { CreateDialogTargets, DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { AdminNavTargets } from '../common/navs/adminNav.targets.js';
import {
  CreateDataConnectorDialogTargets,
  DataConnectorsPageTargets,
  EditBitsightConnectorPageTargets,
  EditDataConnectorPageTargets,
  EditSecureFileConnectorPageTargets,
} from './dataConnectors.targets.js';

type SchedulingConfig = {
  startingOnDate: Date;
  endingOnDate?: Date;
  frequency: string;
  notificationGroups: string[];
  notificationUsers: string[];
  messageCenterSettings: string;
};

async function selectOption(actor: WebActor, selectorTarget: Target, option: string): Promise<void> {
  await actor.browse().click(selectorTarget);
  await actor.browse().click(EditDataConnectorPageTargets.optionByName(option));
}

async function fillCreateDialogAndSave(actor: WebActor, name: string, type: DataConnectorType): Promise<void> {
  await actor.browse().click(CreateDataConnectorDialogTargets.connectorTypeSelector);
  await actor.browse().click(CreateDataConnectorDialogTargets.optionByName(type));
  await actor.browse().fill(CreateDialogTargets.nameInput, name);
  const navPromise = actor.browse().waitForUrl(EditDataConnectorPageTargets.pathRegex);
  await actor.browse().click(CreateDialogTargets.saveButton);
  await navPromise;
}

async function fillCopyDialogAndSave(
  actor: WebActor,
  type: DataConnectorType,
  toCopyName: string,
  copyName: string
): Promise<void> {
  await actor.browse().click(CreateDataConnectorDialogTargets.connectorTypeSelector);
  await actor.browse().click(CreateDataConnectorDialogTargets.optionByName(type));
  await actor.browse().click(CreateDialogTargets.copyFromRadioButton);
  await actor.browse().click(CreateDialogTargets.copyFromDropdown);
  await actor.browse().click(CreateDialogTargets.optionToCopy(toCopyName));
  await actor.browse().fill(CreateDialogTargets.nameInput, copyName);
  const navPromise = actor.browse().waitForUrl(EditDataConnectorPageTargets.pathRegex);
  await actor.browse().click(CreateDialogTargets.saveButton);
  await navPromise;
}

async function fillBaseConnectionTab(actor: WebActor, dataConnector: DataConnector): Promise<void> {
  await actor.browse().fill(EditDataConnectorPageTargets.connectionTab.nameInput, dataConnector.name);
  await actor.browse().fill(EditDataConnectorPageTargets.connectionTab.descriptionEditor, dataConnector.description);
  await actor.attemptsTo(
    StatusSwitchTasks.setAriaSwitch({
      switchTarget: EditDataConnectorPageTargets.connectionTab.statusSwitch,
      toggleTarget: EditDataConnectorPageTargets.connectionTab.statusToggle,
      enabled: dataConnector.status,
    })
  );
}

async function fillSchedulingFields(actor: WebActor, config: SchedulingConfig): Promise<void> {
  await actor.attemptsTo(
    DateFieldControlTasks.enterDate(EditDataConnectorPageTargets.schedulingTab.startingOnDate, config.startingOnDate)
  );

  if (config.endingOnDate) {
    await actor.attemptsTo(
      DateFieldControlTasks.enterDate(EditDataConnectorPageTargets.schedulingTab.endingOnDate, config.endingOnDate)
    );
  }

  await selectOption(actor, EditDataConnectorPageTargets.schedulingTab.frequencySelector, config.frequency);

  if (config.notificationGroups.length > 0) {
    await actor.attemptsTo(
      DualPaneSelector.selectOptions(
        EditDataConnectorPageTargets.schedulingTab.notificationGroupsSelector,
        config.notificationGroups
      )
    );
  }

  if (config.notificationUsers.length > 0) {
    await actor.attemptsTo(
      DualPaneSelector.selectOptions(
        EditDataConnectorPageTargets.schedulingTab.notificationUsersSelector,
        config.notificationUsers
      )
    );
  }
}

export const DataConnectorTasks = {
  goto:
    (): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const getConnectorsResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => r.url().includes(DataConnectorsPageTargets.getConnectorsPath) && r.status() === 200
        );
      await actor.browse().goto(DataConnectorsPageTargets.route);
      await getConnectorsResponse;
    },

  gotoEdit:
    (id: number): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().goto(EditDataConnectorPageTargets.route(id));
    },

  scrollAllIntoView: (): Task<WebActor> =>
    KendoGridTasks.scrollAllIntoView({
      grid: DataConnectorsPageTargets.grid,
      getListPagePath: DataConnectorsPageTargets.getConnectorsPath,
    }),

  create:
    (name: string, type: DataConnectorType): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(DataConnectorsPageTargets.createDataConnectorButton);
      await fillCreateDialogAndSave(actor, name, type);
    },

  createCopy:
    (type: DataConnectorType, toCopyName: string, copyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().click(DataConnectorsPageTargets.createDataConnectorButton);
      await fillCopyDialogAndSave(actor, type, toCopyName, copyName);
    },

  createViaHeader:
    (name: string, type: DataConnectorType): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('Data Connector'));
      await fillCreateDialogAndSave(actor, name, type);
    },

  createCopyViaHeader:
    (type: DataConnectorType, toCopyName: string, copyName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().hover(AdminNavTargets.adminCreateButton);
      await actor.browse().check(AdminNavTargets.adminCreateMenu).isVisible();
      await actor.browse().click(AdminNavTargets.menuOption('Data Connector'));
      await fillCopyDialogAndSave(actor, type, toCopyName, copyName);
    },

  delete:
    (name: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(DataConnectorTasks.scrollAllIntoView());

      const row = DataConnectorsPageTargets.rowByName(name);
      const isVisible = await actor.browse().isVisible(row);

      if (!isVisible) {
        return;
      }

      await actor.browse().hover(row);
      await actor.browse().click(DataConnectorsPageTargets.deleteButtonInRow(name));
      await actor.browse().check(DeleteDialogTargets.deleteButton).isVisible();

      const deleteResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => DataConnectorsPageTargets.deletePathRegex.test(r.url()) && r.status() === 200
        );
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await deleteResponse;

      await actor.browse().waitForDetached(DeleteDialogTargets.dialog, DeleteDialogTargets.overlay);
      await actor.browse().check(row).isHidden();
    },

  deleteConnectors:
    (names: string[]): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const uniqueNames = [...new Set(names)];

      if (uniqueNames.length === 0) {
        return;
      }

      await actor.attemptsTo(DataConnectorTasks.goto());

      for (const name of uniqueNames) {
        await actor.attemptsTo(DataConnectorTasks.delete(name));
      }
    },

  configureBitsight:
    (dataConnector: BitsightDataConnector): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      // Connection Tab
      await actor.browse().click(EditBitsightConnectorPageTargets.connectionTabButton);
      await fillBaseConnectionTab(actor, dataConnector);
      await actor.browse().fill(EditBitsightConnectorPageTargets.connectionTab.apiKeyInput, dataConnector.apiKey);

      // App Mapping Tab
      await actor.browse().click(EditBitsightConnectorPageTargets.appMappingTabButton);
      await actor.attemptsTo(
        MappingGridTasks.performMapping(
          EditBitsightConnectorPageTargets.appMappingTab.mappingGridContainer,
          dataConnector.getAllAppMappings()
        )
      );

      // Data Mapping Tab
      await actor.browse().click(EditBitsightConnectorPageTargets.dataMappingTabButton);
      const { alertsMapping, portfolioMapping, ratingDetailsMapping } = dataConnector.appMappings;
      const appMappings = [alertsMapping, portfolioMapping, ratingDetailsMapping];

      for (const appMapping of appMappings) {
        for (const fieldMapping of Object.values(appMapping)) {
          await actor
            .browse()
            .click(EditBitsightConnectorPageTargets.dataMappingTab.expandButtonByAppName(fieldMapping.appName));

          const { recordHandling, sourceMatchField, appMatchField, messagingRule, ...fieldMappings } =
            fieldMapping.mappings;

          await actor.attemptsTo(
            MappingGridTasks.performMapping(
              EditBitsightConnectorPageTargets.dataMappingTab.mappingGridContainer,
              Object.values(fieldMappings)
            )
          );

          await selectOption(
            actor,
            EditBitsightConnectorPageTargets.dataMappingTab.recordHandlingSelector,
            recordHandling
          );

          if (recordHandling !== 'Add new content for each record in the file') {
            await selectOption(
              actor,
              EditBitsightConnectorPageTargets.dataMappingTab.sourceMatchFieldSelector,
              sourceMatchField
            );
            await selectOption(
              actor,
              EditBitsightConnectorPageTargets.dataMappingTab.appMatchFieldSelector,
              appMatchField
            );
          }

          await selectOption(actor, EditBitsightConnectorPageTargets.dataMappingTab.messagingSelector, messagingRule);
        }
      }

      // Scheduling Tab
      await actor.browse().click(EditBitsightConnectorPageTargets.schedulingTabButton);
      await fillSchedulingFields(actor, {
        startingOnDate: dataConnector.startingOnDate,
        endingOnDate: dataConnector.endingOnDate,
        frequency: dataConnector.frequency,
        notificationGroups: dataConnector.notificationGroups,
        notificationUsers: dataConnector.notificationUsers,
        messageCenterSettings: dataConnector.messagingCenterSettings,
      });
      await selectOption(
        actor,
        EditDataConnectorPageTargets.schedulingTab.messageCenterSettingsSelector,
        dataConnector.messagingCenterSettings
      );

      // Save
      const saveResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => EditBitsightConnectorPageTargets.savePathRegex.test(r.url()) && r.status() === 200
        );
      await actor.browse().click(EditDataConnectorPageTargets.saveChangesLink);
      await saveResponse;
    },

  configureSecureFile:
    (dataConnector: SecureFileDataConnector): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      // Connection Tab
      await actor.browse().click(EditSecureFileConnectorPageTargets.connectionTabButton);
      await fillBaseConnectionTab(actor, dataConnector);
      await selectOption(actor, EditSecureFileConnectorPageTargets.connectionTab.appSurveySelector, dataConnector.app);

      await actor.browse().fill(EditSecureFileConnectorPageTargets.connectionTab.hostNameInput, dataConnector.hostname);
      await actor
        .browse()
        .fill(EditSecureFileConnectorPageTargets.connectionTab.portNumberInput, dataConnector.port.toString());
      await actor
        .browse()
        .fill(EditSecureFileConnectorPageTargets.connectionTab.fileLocationInput, dataConnector.fileLocation);
      await actor.browse().fill(EditSecureFileConnectorPageTargets.connectionTab.fileNameInput, dataConnector.fileName);
      await selectOption(
        actor,
        EditSecureFileConnectorPageTargets.connectionTab.fileTypeSelector,
        dataConnector.fileType
      );

      await actor
        .browse()
        .setChecked(EditSecureFileConnectorPageTargets.connectionTab.headerRowCheckbox, dataConnector.hasHeaderRow);
      await actor
        .browse()
        .setChecked(
          EditSecureFileConnectorPageTargets.connectionTab.trimLeadingSpacesCheckbox,
          dataConnector.trimLeadingSpaces
        );
      await actor
        .browse()
        .setChecked(
          EditSecureFileConnectorPageTargets.connectionTab.trimTrailingSpacesCheckbox,
          dataConnector.trimTrailingSpaces
        );

      await selectOption(
        actor,
        EditSecureFileConnectorPageTargets.connectionTab.authenticationTypeSelector,
        dataConnector.authType.type
      );

      if (dataConnector.authType.username) {
        await actor
          .browse()
          .fill(EditSecureFileConnectorPageTargets.connectionTab.usernameInput, dataConnector.authType.username);
      }

      if (dataConnector.authType.password) {
        await actor
          .browse()
          .fill(EditSecureFileConnectorPageTargets.connectionTab.passwordInput, dataConnector.authType.password);
      }

      if (dataConnector.authType.type === 'SSH Key') {
        await actor
          .browse()
          .fill(EditSecureFileConnectorPageTargets.connectionTab.privateKeyInput, dataConnector.authType.privateKey);
      }

      const getDataResponse = actor
        .browse()
        .waitForResponse((r: Response) => r.url().includes(EditSecureFileConnectorPageTargets.getDataPath));
      await actor.browse().click(EditSecureFileConnectorPageTargets.connectionTab.connectAndRefreshLink);
      const response = await getDataResponse;
      const data = (await response.json()) as { success?: boolean };

      if (!response.ok() || data.success === false) {
        await actor.browse().click(EditSecureFileConnectorPageTargets.connectionTab.connectionFailedDialogCloseButton);
        throw new Error('Failed to connect and refresh data source fields');
      }

      await actor.browse().click(EditSecureFileConnectorPageTargets.connectionTab.authSuccessDialogCloseButton);

      // Data Mapping Tab
      await actor.browse().click(EditSecureFileConnectorPageTargets.dataMappingTabButton);
      await actor.attemptsTo(
        MappingGridTasks.performMapping(
          EditSecureFileConnectorPageTargets.dataMappingTab.mappingGridContainer,
          dataConnector.fieldMapping
        )
      );

      // Integration Settings Tab
      await actor.browse().click(EditSecureFileConnectorPageTargets.integrationSettingsTabButton);
      await selectOption(
        actor,
        EditSecureFileConnectorPageTargets.integrationSettingsTab.recordHandlingSelector,
        dataConnector.recordHandling.type
      );

      if (dataConnector.recordHandling.type !== 'Add new content for each record in the file') {
        await selectOption(
          actor,
          EditSecureFileConnectorPageTargets.integrationSettingsTab.sourceMatchFieldSelector,
          dataConnector.recordHandling.sourceMatchField
        );
        await selectOption(
          actor,
          EditSecureFileConnectorPageTargets.integrationSettingsTab.appMatchFieldSelector,
          dataConnector.recordHandling.appMatchField
        );
      }

      if (dataConnector.recordHandling.type === 'Update content that matches and add new content') {
        await selectOption(
          actor,
          EditSecureFileConnectorPageTargets.integrationSettingsTab.workflowSelector,
          dataConnector.recordHandling.workflow
        );
      }

      await selectOption(
        actor,
        EditSecureFileConnectorPageTargets.integrationSettingsTab.messagingSelector,
        dataConnector.messaging
      );
      await actor.attemptsTo(
        DualPaneSelector.selectOptions(
          EditSecureFileConnectorPageTargets.integrationSettingsTab.fieldsToDefaultSelector,
          dataConnector.fieldsToDefault
        )
      );

      // Scheduling Tab
      await actor.browse().click(EditSecureFileConnectorPageTargets.schedulingTabButton);
      await fillSchedulingFields(actor, {
        startingOnDate: dataConnector.startingOnDate,
        endingOnDate: dataConnector.endingOnDate,
        frequency: dataConnector.frequency,
        notificationGroups: dataConnector.notificationGroups,
        notificationUsers: dataConnector.notificationUsers,
        messageCenterSettings: dataConnector.messagingCenterSettings,
      });

      if (dataConnector.childConnectors.length > 0) {
        await actor.browse().checkControl(EditSecureFileConnectorPageTargets.schedulingTab.queueParentCheckbox);
        await actor.attemptsTo(
          DualPaneSelector.selectOptions(
            EditSecureFileConnectorPageTargets.schedulingTab.queueChildrenSelector,
            dataConnector.childConnectors
          )
        );
      }

      await selectOption(
        actor,
        EditDataConnectorPageTargets.schedulingTab.messageCenterSettingsSelector,
        dataConnector.messagingCenterSettings
      );

      // Save
      const saveResponse = actor
        .browse()
        .waitForResponse(
          (r: Response) => r.url().includes(EditSecureFileConnectorPageTargets.savePath) && r.status() === 200
        );
      await actor.browse().click(EditDataConnectorPageTargets.saveChangesLink);
      await saveResponse;
    },
};
