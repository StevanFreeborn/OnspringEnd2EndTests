import {
  CreateMultipleRecordsOutcome,
  CreateOneRecordOnSaveOutcome,
  CreateOneRecordOutcome,
  CustomBatchContentDefinition,
  DefinedLibraryContentDefinition,
  DynamicLibraryContentDefinition,
  FilterListValueOutcome,
  GenerateDocumentOutcome,
  ObjectVisibilityOutcome,
  Outcome,
  PrintContentRecordOutcome,
  RequiredFieldsOutcome,
  RestApiOutcome,
  SetDateOutcome,
  SetDateToCurrentDateRule,
  SetListValueOutcome,
  SetReferenceOutcome,
  SetSingleListValueRule,
  SetSpecificSingleReferenceConfig,
  StopCalculationOutcome,
} from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DualPaneSelector } from '../common/controls/dualPaneSelector.js';
import { RuleControlTasks } from '../common/controls/ruleControl.js';
import { StatusSwitchTasks } from '../common/controls/statusSwitch.js';
import { TreeviewSelectorTasks } from '../common/controls/treeviewSelector.js';
import { OutcomeModalTargets } from './outcomes.targets.js';

async function selectDropdownOption(actor: WebActor, selectTarget: Target, optionName: string): Promise<void> {
  await actor.browse().click(selectTarget);
  await actor.browse().click(OutcomeModalTargets.optionByName(optionName));
}

async function fillOutcomeBaseFields(actor: WebActor, outcome: Outcome): Promise<void> {
  await actor.browse().fill(OutcomeModalTargets.generalTab.descriptionEditor, outcome.description);
  await actor.attemptsTo(
    StatusSwitchTasks.setAriaSwitch({
      switchTarget: OutcomeModalTargets.generalTab.statusSwitch,
      toggleTarget: OutcomeModalTargets.generalTab.statusToggle,
      enabled: outcome.status,
    })
  );
}

async function fillOutcomeGeneralTab(actor: WebActor, outcome: Outcome): Promise<void> {
  await actor.browse().click(OutcomeModalTargets.generalTabButton);
  await fillOutcomeBaseFields(actor, outcome);
}

async function fillObjectVisibilityOutcome(actor: WebActor, outcome: ObjectVisibilityOutcome): Promise<void> {
  const { objectVisibility } = OutcomeModalTargets;

  await fillOutcomeGeneralTab(actor, outcome);
  await actor.browse().click(objectVisibility.displayTabButton);
  await actor.browse().click(objectVisibility.layoutSelect);
  await actor.browse().click(objectVisibility.layoutOption(outcome.layoutName));

  for (const section of outcome.sections) {
    const tabTarget = objectVisibility.layoutTab(section.tabName);
    const tabClasses = await actor.browse().getAttribute(tabTarget, 'class');

    if (tabClasses === null) {
      throw new Error(`Could not find classes for tab: ${section.tabName}`);
    }

    if (tabClasses.includes('collapsed')) {
      await actor.browse().click(tabTarget);
    }

    await actor.browse().click(objectVisibility.sectionVisibilityButton(section.tabName, section.name));
    await actor
      .browse()
      .waitForState(objectVisibility.sectionDisplayModeMenu(section.tabName, section.name), 'visible');
    await actor
      .browse()
      .click(objectVisibility.sectionDisplayModeOption(section.tabName, section.name, section.visibility));
  }
}

async function fillStopCalculationOutcome(actor: WebActor, outcome: StopCalculationOutcome): Promise<void> {
  await fillOutcomeBaseFields(actor, outcome);
  await actor.attemptsTo(
    DualPaneSelector.selectOptions(OutcomeModalTargets.stopCalculation.fieldsSelector, outcome.fieldsToStop)
  );
}

async function fillSetDateOutcome(actor: WebActor, outcome: SetDateOutcome): Promise<void> {
  const { setDate } = OutcomeModalTargets;
  await fillOutcomeBaseFields(actor, outcome);

  for (const rule of outcome.setDateRules) {
    await selectDropdownOption(actor, setDate.fieldSelect, rule.fieldName);

    if (rule instanceof SetDateToCurrentDateRule) {
      await selectDropdownOption(actor, setDate.typeSelect, 'Current Date');
      await actor.browse().click(setDate.addRuleButton);
      continue;
    }

    throw new Error(`Unsupported set date rule type: ${rule.constructor.name}`);
  }
}

async function fillSetListValueOutcome(actor: WebActor, outcome: SetListValueOutcome): Promise<void> {
  const { setListValue } = OutcomeModalTargets;
  await fillOutcomeBaseFields(actor, outcome);

  for (const rule of outcome.setListValueRules) {
    await selectDropdownOption(actor, setListValue.fieldSelect, rule.fieldName);

    if (rule instanceof SetSingleListValueRule) {
      await selectDropdownOption(actor, setListValue.singleValueSelect, rule.value);
      continue;
    }

    throw new Error(`Unsupported set list value rule type: ${rule.constructor.name}`);
  }
}

async function fillSetReferenceOutcome(actor: WebActor, outcome: SetReferenceOutcome): Promise<void> {
  const { setReference } = OutcomeModalTargets;
  const { setReferenceConfig } = outcome;
  await fillOutcomeBaseFields(actor, outcome);

  if (!(setReferenceConfig instanceof SetSpecificSingleReferenceConfig)) {
    throw new Error(`Unsupported set reference config type: ${setReferenceConfig.constructor.name}`);
  }

  await selectDropdownOption(actor, setReference.fieldSelect, setReferenceConfig.fieldName);
  await selectDropdownOption(actor, setReference.methodSelect, setReferenceConfig.method);
  await selectDropdownOption(actor, setReference.valueSelect, setReferenceConfig.value);
}

async function fillRequiredFieldsOutcome(actor: WebActor, outcome: RequiredFieldsOutcome): Promise<void> {
  await fillOutcomeBaseFields(actor, outcome);
  await actor.attemptsTo(
    DualPaneSelector.selectOptions(OutcomeModalTargets.requiredFields.fieldsSelector, outcome.requiredFields)
  );
}

async function fillFilterListValueOutcome(actor: WebActor, outcome: FilterListValueOutcome): Promise<void> {
  const { filterListValue } = OutcomeModalTargets;
  await fillOutcomeBaseFields(actor, outcome);

  for (const rule of outcome.filterListValueRules) {
    await selectDropdownOption(actor, filterListValue.fieldSelect, rule.fieldName);
    await actor.attemptsTo(DualPaneSelector.selectOptions(filterListValue.valuesSelector, rule.valuesToInclude));
    await actor.browse().click(filterListValue.addRuleButton);
  }
}

async function fillPrintContentRecordOutcome(actor: WebActor, outcome: PrintContentRecordOutcome): Promise<void> {
  const { printContentRecord } = OutcomeModalTargets;
  await fillOutcomeBaseFields(actor, outcome);

  await selectDropdownOption(actor, printContentRecord.layoutSelect, outcome.layout);
  await selectDropdownOption(actor, printContentRecord.orientationSelect, outcome.orientation);
  await selectDropdownOption(actor, printContentRecord.contentVisibilitySelect, outcome.contentVisibility);
  await selectDropdownOption(actor, printContentRecord.attachmentFieldSelect, outcome.attachmentField);
}

async function fillCreateOneRecordOutcome(actor: WebActor, outcome: CreateOneRecordOutcome): Promise<void> {
  const { createOneRecord } = OutcomeModalTargets;
  await fillOutcomeGeneralTab(actor, outcome);

  if (!(outcome instanceof CreateOneRecordOnSaveOutcome)) {
    throw new Error(`Unsupported create one record outcome type: ${outcome.constructor.name}`);
  }

  await actor.browse().click(createOneRecord.creationSettingsTabButton);
  await selectDropdownOption(actor, createOneRecord.appSelect, outcome.targetApp);
  await selectDropdownOption(actor, createOneRecord.frequencySelect, outcome.frequency);
  await selectDropdownOption(actor, createOneRecord.layoutSelect, outcome.layout);
}

async function addCustomBatchDefinition(actor: WebActor, definition: CustomBatchContentDefinition): Promise<void> {
  const { customBatchModal } = OutcomeModalTargets.createMultipleRecords;

  await actor.browse().waitForState(customBatchModal.modal, 'visible');
  await actor.browse().click(customBatchModal.generalSettingsTabButton);
  await actor.browse().fill(customBatchModal.batchRecordNameInput, definition.batchRecordName);
  await actor.browse().fill(customBatchModal.descriptionEditor, definition.description);

  await actor.browse().click(customBatchModal.contentSettingsTabButton);
  await selectDropdownOption(actor, customBatchModal.appSelect, definition.targetApp);
  await selectDropdownOption(actor, customBatchModal.layoutSelect, definition.layout);

  await actor.browse().click(customBatchModal.okButton);
  await actor.browse().waitForState(customBatchModal.modal, 'hidden');
}

async function addLibraryDefinition(
  actor: WebActor,
  definition: DefinedLibraryContentDefinition | DynamicLibraryContentDefinition
): Promise<void> {
  const { addAppDefinitionDialog, libraryModal } = OutcomeModalTargets.createMultipleRecords;

  await actor.browse().waitForState(addAppDefinitionDialog.dialog, 'visible');
  await selectDropdownOption(actor, addAppDefinitionDialog.sourceAppSelect, definition.sourceApp);
  await actor.browse().click(addAppDefinitionDialog.okButton);

  await actor.browse().waitForState(libraryModal.contentSelectionSettingsTabButton, 'visible');
  await actor.browse().click(libraryModal.contentSelectionSettingsTabButton);
  await actor.attemptsTo(
    RuleControlTasks.applyLogic({
      controlTarget: libraryModal.dataFilterRuleControl,
      logic: definition.dataFilterLogic,
    })
  );

  if (definition.dynamicFilter) {
    await actor.browse().checkControl(libraryModal.dynamicFilterCheckbox);
    await actor.attemptsTo(
      DualPaneSelector.selectOptions(libraryModal.dynamicFilterFieldsSelector, definition.dynamicFilterFields)
    );
  }

  if (definition instanceof DefinedLibraryContentDefinition) {
    const generateRecordsResponse = actor.browse().waitForResponse(libraryModal.generateDefinedRecordsPathRegex);
    const getDefinedRecordsResponse = actor.browse().waitForResponse(libraryModal.getDefinedRecordPagePathRegex);
    await actor.browse().click(libraryModal.generateRecordsButton);
    await Promise.all([generateRecordsResponse, getDefinedRecordsResponse]);
  }

  await actor.browse().click(libraryModal.contentCopySettingsTabButton);
  await selectDropdownOption(actor, libraryModal.targetAppSelect, definition.targetApp);
  await selectDropdownOption(actor, libraryModal.layoutSelect, definition.layout);

  await actor.browse().click(libraryModal.okButton);
  await actor.browse().waitForState(libraryModal.modal, 'hidden');
}

async function fillCreateMultipleRecordsOutcome(actor: WebActor, outcome: CreateMultipleRecordsOutcome): Promise<void> {
  const { createMultipleRecords } = OutcomeModalTargets;

  await fillOutcomeGeneralTab(actor, outcome);
  await actor.browse().click(createMultipleRecords.creationSettingsTabButton);
  await selectDropdownOption(actor, createMultipleRecords.frequencySelect, outcome.frequency);
  await selectDropdownOption(actor, createMultipleRecords.batchTypeSelect, outcome.batchType);

  for (const definition of outcome.definitions) {
    await actor.browse().click(createMultipleRecords.addDefinitionLink);

    if (definition instanceof CustomBatchContentDefinition) {
      await addCustomBatchDefinition(actor, definition);
      continue;
    }

    if (
      definition instanceof DefinedLibraryContentDefinition ||
      definition instanceof DynamicLibraryContentDefinition
    ) {
      await addLibraryDefinition(actor, definition);
      continue;
    }

    throw new Error(`Unsupported content definition type: ${definition.constructor.name}`);
  }
}

async function fillGenerateDocumentOutcome(actor: WebActor, outcome: GenerateDocumentOutcome): Promise<void> {
  const { generateDocument } = OutcomeModalTargets;

  await fillOutcomeGeneralTab(actor, outcome);
  await actor.browse().click(generateDocument.creationSettingsTabButton);
  await selectDropdownOption(actor, generateDocument.documentTypeSelect, outcome.documentType);

  if (outcome.documentType !== 'Generate Document') {
    throw new Error(`Unsupported document type: ${outcome.documentType}`);
  }

  await selectDropdownOption(actor, generateDocument.documentSelect, outcome.document);
  await selectDropdownOption(actor, generateDocument.fileTypeSelect, outcome.fileType);
  await selectDropdownOption(actor, generateDocument.attachmentFieldSelect, outcome.attachmentField);
}

async function fillRestApiOutcome(actor: WebActor, outcome: RestApiOutcome): Promise<void> {
  const { restApi } = OutcomeModalTargets;

  await fillOutcomeBaseFields(actor, outcome);

  await actor.browse().click(restApi.restApiSettingsTabButton);
  await selectDropdownOption(actor, restApi.httpMethodSelect, outcome.method);
  await actor.browse().fill(restApi.restUrlInput, outcome.restURL);
  await selectDropdownOption(actor, restApi.authorizationTypeSelect, outcome.authorization);

  await actor.browse().click(restApi.notificationsTabButton);
  await actor.attemptsTo(
    DualPaneSelector.selectOptions(restApi.notificationGroupsSelector, outcome.notificationGroups),
    DualPaneSelector.selectOptions(restApi.notificationUsersSelector, outcome.notificationUsers)
  );

  await actor.browse().click(restApi.requestTabButton);

  for (const [sourceField, onspringField] of Object.entries(outcome.dataMappings)) {
    await actor.browse().click(restApi.addFieldButton);
    await actor.browse().waitForState(restApi.lastMappingRow, 'visible');
    await actor.browse().focus(restApi.lastMappingSourceInput);
    await actor.browse().type(restApi.lastMappingSourceInput, sourceField, { clear: false, delay: 0 });
    await actor.attemptsTo(TreeviewSelectorTasks.selectOption(restApi.lastMappingOnspringFieldSelector, onspringField));
  }
}

export const OutcomeTasks = {
  configureOutcome:
    (outcome: Outcome): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.browse().waitForState(OutcomeModalTargets.modal, 'visible');

      if (outcome instanceof ObjectVisibilityOutcome) {
        await fillObjectVisibilityOutcome(actor, outcome);
      } else if (outcome instanceof StopCalculationOutcome) {
        await fillStopCalculationOutcome(actor, outcome);
      } else if (outcome instanceof SetDateOutcome) {
        await fillSetDateOutcome(actor, outcome);
      } else if (outcome instanceof SetListValueOutcome) {
        await fillSetListValueOutcome(actor, outcome);
      } else if (outcome instanceof SetReferenceOutcome) {
        await fillSetReferenceOutcome(actor, outcome);
      } else if (outcome instanceof RequiredFieldsOutcome) {
        await fillRequiredFieldsOutcome(actor, outcome);
      } else if (outcome instanceof FilterListValueOutcome) {
        await fillFilterListValueOutcome(actor, outcome);
      } else if (outcome instanceof PrintContentRecordOutcome) {
        await fillPrintContentRecordOutcome(actor, outcome);
      } else if (outcome instanceof CreateOneRecordOutcome) {
        await fillCreateOneRecordOutcome(actor, outcome);
      } else if (outcome instanceof CreateMultipleRecordsOutcome) {
        await fillCreateMultipleRecordsOutcome(actor, outcome);
      } else if (outcome instanceof GenerateDocumentOutcome) {
        await fillGenerateDocumentOutcome(actor, outcome);
      } else if (outcome instanceof RestApiOutcome) {
        await fillRestApiOutcome(actor, outcome);
      } else {
        throw new Error(`Unsupported outcome type: ${outcome.type}`);
      }

      await actor.browse().click(OutcomeModalTargets.okButton);
      await actor.browse().waitForState(OutcomeModalTargets.modal, 'hidden');
    },
};
