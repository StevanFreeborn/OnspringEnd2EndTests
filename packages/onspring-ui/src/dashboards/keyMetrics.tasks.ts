import { Response } from '@playwright/test';
import {
  BarGaugeKeyMetric,
  BulbGaugeKeyMetric,
  DialGaugeKeyMetric,
  DonutGaugeKeyMetric,
  KeyMetric,
  TEST_KEY_METRIC_NAME,
} from '@stevanfreeborn/onspring-models';
import { Task } from '@stevanfreeborn/screenplay';
import { Target, WebActor } from '@stevanfreeborn/screenplay-playwright';
import { DualPaneSelector } from '../common/controls/dualPaneSelector.js';
import { ReferenceFieldGrid } from '../common/controls/referenceFieldGrid.js';
import { TabbedColorPickerTasks } from '../common/controls/tabbedColorPicker.js';
import { CreateDialogTargets, DeleteDialogTargets } from '../common/dialogs/dialogs.targets.js';
import { DashboardDesignerTargets, DashboardPageTargets } from './dashboards.targets.js';
import { DashboardTasks } from './dashboards.tasks.js';
import { KeyMetricTargets } from './keyMetrics.targets.js';

async function selectModalOption(actor: WebActor, selectorTarget: Target, optionName: string): Promise<void> {
  await actor.browse().click(selectorTarget);
  await actor.browse().click(KeyMetricTargets.modal.pageOptionByName(optionName));
}

async function selectRecord(actor: WebActor, recordName: string): Promise<void> {
  const selectRecord = KeyMetricTargets.selectRecordModal;
  await actor.browse().click(KeyMetricTargets.modal.recordSelector);
  await actor.browse().waitForState(selectRecord.dialog, 'visible');
  await actor.browse().waitForState(selectRecord.referenceGrid, 'visible');
  await actor.attemptsTo(
    ReferenceFieldGrid.selectRecord({
      gridTarget: selectRecord.referenceGrid,
      searchTerm: recordName,
      controlType: 'radio',
      searchResultsContainer: selectRecord.searchResultsContainer,
      searchPathRegex: selectRecord.searchPathRegex,
      filterPlaceholder: 'Search',
    })
  );
  await actor.browse().click(selectRecord.okButton);
  await actor.browse().waitForState(selectRecord.dialog, 'hidden');
}

async function addValueRanges(actor: WebActor, ranges: { rangeStop: number; label?: string }[]): Promise<void> {
  const modal = KeyMetricTargets.modal;

  for (const range of ranges) {
    await actor.browse().click(modal.valueRangesAddButton);
    await actor.browse().waitForState(modal.valueRangesLastRowRangeStopFirstInput, 'visible');
    await actor.browse().click(modal.valueRangesLastRowRangeStopFirstInput);
    await actor.browse().waitForState(modal.valueRangesLastRowRangeStopSecondInput, 'visible');
    await actor.browse().clear(modal.valueRangesLastRowRangeStopSecondInput);
    await actor.browse().fill(modal.valueRangesLastRowRangeStopSecondInput, range.rangeStop.toString());
  }
}

async function fillAndSaveKeyMetricModal(actor: WebActor, keyMetric: KeyMetric): Promise<void> {
  const modal = KeyMetricTargets.modal;
  await actor.browse().waitForState(modal.dialog, 'visible');

  await actor.browse().click(modal.generalTabButton);
  await actor.browse().fill(modal.objectNameInput, keyMetric.objectName);

  if (keyMetric.displayName) {
    await actor.browse().uncheckControl(modal.displayNameCheckbox);
    await actor.browse().fill(modal.displayNameInput, keyMetric.displayName);
  } else {
    await actor.browse().checkControl(modal.displayNameCheckbox);
  }

  await actor.browse().fill(modal.descriptionEditor, keyMetric.description);

  await actor.browse().click(modal.keyMetricTabButton);
  await selectModalOption(actor, modal.typeSelector, keyMetric.type);

  if (keyMetric instanceof DialGaugeKeyMetric) {
    await selectModalOption(actor, modal.needleDisplaySelector, keyMetric.needleDisplay);
  }

  if (keyMetric instanceof DonutGaugeKeyMetric || keyMetric instanceof BulbGaugeKeyMetric) {
    await selectModalOption(actor, modal.centerDisplaySelector, keyMetric.centerDisplay);
  }

  if (keyMetric instanceof BarGaugeKeyMetric) {
    await selectModalOption(actor, modal.pointerDisplaySelector, keyMetric.pointerDisplay);
  }

  await selectModalOption(actor, modal.appOrSurveySelector, keyMetric.appOrSurvey);
  await selectModalOption(actor, modal.fieldSourceSelector, keyMetric.fieldSource.type);

  if (keyMetric.fieldSource.type === 'App/Survey') {
    await selectModalOption(actor, modal.aggregateSelector, keyMetric.fieldSource.aggregate.fn);
  }

  if (keyMetric.fieldSource.type === 'Content Record') {
    await selectRecord(actor, keyMetric.fieldSource.record);
    await selectModalOption(actor, modal.recordFieldSelector, keyMetric.fieldSource.field);
  }

  if (keyMetric.fieldSource.type === 'Report') {
    await selectModalOption(actor, modal.reportSelector, keyMetric.fieldSource.report);
    await selectModalOption(actor, modal.aggregateSelector, keyMetric.fieldSource.aggregate.fn);
  }

  if (keyMetric instanceof DialGaugeKeyMetric) {
    await selectModalOption(
      actor,
      modal.calculatedPercentageDisplaySelector,
      keyMetric.calculatedPercentageDisplay.toString()
    );
    await addValueRanges(actor, keyMetric.valueRanges);
    await actor.browse().click(modal.totalSourceTypePicker);
    await actor.browse().click(modal.totalSourceTypeButton(keyMetric.totalSource.type));

    if (keyMetric.totalSource.type === 'Static') {
      await actor.browse().fill(modal.totalValueInput, keyMetric.totalSource.totalValue.toString());
    } else {
      throw new Error('Dynamic total source is not supported yet.');
    }
  }

  if (keyMetric instanceof DonutGaugeKeyMetric) {
    await selectModalOption(
      actor,
      modal.calculatedPercentageDisplaySelector,
      keyMetric.calculatedPercentageDisplay.toString()
    );
    await selectModalOption(actor, modal.colorDisplaySelector, keyMetric.colorDisplay.type);

    if (keyMetric.colorDisplay.type === 'Conditional Color based on Range') {
      await addValueRanges(actor, keyMetric.colorDisplay.ranges);
    }

    if (keyMetric.colorDisplay.type === 'Selected Color') {
      await actor.browse().fill(modal.labelInput, keyMetric.colorDisplay.label);
      await actor.attemptsTo(
        TabbedColorPickerTasks.selectColor(modal.selectedColorPicker, keyMetric.colorDisplay.color)
      );
    }

    await actor.browse().click(modal.totalSourceTypePicker);
    await actor.browse().click(modal.totalSourceTypeButton(keyMetric.totalSource.type));

    if (keyMetric.totalSource.type === 'Static') {
      await actor.browse().fill(modal.totalValueInput, keyMetric.totalSource.totalValue.toString());
    } else {
      throw new Error('Dynamic total source is not supported yet.');
    }
  }

  if (keyMetric instanceof BarGaugeKeyMetric) {
    await selectModalOption(
      actor,
      modal.calculatedPercentageDisplaySelector,
      keyMetric.calculatedPercentageDisplay.toString()
    );
    await addValueRanges(actor, keyMetric.valueRanges);
    await actor.browse().click(modal.totalSourceTypePicker);
    await actor.browse().click(modal.totalSourceTypeButton(keyMetric.totalSource.type));

    if (keyMetric.totalSource.type === 'Static') {
      await actor.browse().fill(modal.totalValueInput, keyMetric.totalSource.totalValue.toString());
    } else {
      throw new Error('Dynamic total source is not supported yet.');
    }
  }

  if (keyMetric instanceof BulbGaugeKeyMetric) {
    await selectModalOption(actor, modal.colorDisplaySelector, keyMetric.colorDisplay.type);

    if (keyMetric.colorDisplay.type === 'Conditional Color based on Range') {
      await addValueRanges(actor, keyMetric.colorDisplay.ranges);
    }

    if (keyMetric.colorDisplay.type === 'Selected Color') {
      await actor.browse().fill(modal.labelInput, keyMetric.colorDisplay.label);
      await actor.attemptsTo(
        TabbedColorPickerTasks.selectColor(modal.selectedColorPicker, keyMetric.colorDisplay.color)
      );
    }
  }

  await actor.browse().click(modal.securityTabButton);
  await selectModalOption(actor, modal.viewSelector, keyMetric.security.view);

  if (keyMetric.security.view === 'Private by Role') {
    await actor.attemptsTo(DualPaneSelector.selectOptions(modal.rolesSelector, keyMetric.security.roles));
  }

  const saveResponse = actor
    .browse()
    .waitForResponse((r: Response) => modal.savePathRegex.test(r.url()) && r.status() === 200);
  await actor.browse().click(modal.saveButton);
  await saveResponse;
  await actor.browse().waitForState(modal.dialog, 'hidden');
}

export const KeyMetricTasks = {
  addKeyMetric:
    (keyMetric: KeyMetric): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      await actor.attemptsTo(DashboardTasks.selectResourceTab('Key Metrics'));
      await actor.browse().click(KeyMetricTargets.addKeyMetricButton);
      await actor.browse().waitForState(KeyMetricTargets.addKeyMetricMenu, 'visible');
      await actor.browse().click(KeyMetricTargets.addKeyMetricMenuOption(keyMetric.type));
      await actor.browse().waitForState(CreateDialogTargets.continueButton, 'visible');
      await actor.browse().click(CreateDialogTargets.continueButton);
      await fillAndSaveKeyMetricModal(actor, keyMetric);
    },

  updateKeyMetric:
    (existingObjectName: string, updatedKeyMetric: KeyMetric): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const itemTarget = DashboardDesignerTargets.resources.itemInBank('keymetric', existingObjectName);
      await actor.attemptsTo(
        DashboardTasks.selectResourceTab('Key Metrics'),
        DashboardTasks.locateItemInResourceBank(
          'keymetric',
          existingObjectName,
          itemTarget,
          DashboardDesignerTargets.resources.getMoreKeyMetricsPathRegex
        )
      );
      await actor.browse().hover(itemTarget);
      await actor.browse().click(KeyMetricTargets.editKeyMetricButtonInBank(existingObjectName));
      await fillAndSaveKeyMetricModal(actor, updatedKeyMetric);
    },

  deleteKeyMetric:
    (objectName: string): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const itemTarget = DashboardDesignerTargets.resources.itemInBank('keymetric', objectName);
      await actor.attemptsTo(
        DashboardTasks.selectResourceTab('Key Metrics'),
        DashboardTasks.locateItemInResourceBank(
          'keymetric',
          objectName,
          itemTarget,
          DashboardDesignerTargets.resources.getMoreKeyMetricsPathRegex
        )
      );

      if (!(await actor.browse().isVisible(itemTarget))) {
        return;
      }

      await actor.browse().hover(itemTarget);
      await actor.browse().click(KeyMetricTargets.deleteKeyMetricButtonInBank(objectName));
      await actor.browse().waitForState(DeleteDialogTargets.dialog, 'visible');
      await actor.browse().click(DeleteDialogTargets.deleteButton);
      await actor.browse().waitForState(DeleteDialogTargets.dialog, 'hidden');
      await actor.browse().waitForState(itemTarget, 'hidden');
    },

  deleteAllTestKeyMetrics: (): Task<WebActor> => {
    const pattern = new RegExp(TEST_KEY_METRIC_NAME, 'i');
    return DashboardTasks.deleteAllTestBankItems({
      tabName: 'Key Metrics',
      bankName: 'keymetric',
      itemNamePattern: pattern,
      loadMorePathRegex: DashboardDesignerTargets.resources.getMoreKeyMetricsPathRegex,
      deletePathRegex: KeyMetricTargets.deletePathRegex,
      deleteButtonInBank: KeyMetricTargets.deleteLastKeyMetricButtonInBank(pattern),
    });
  },

  normalizeTitleForScreenshot:
    (keyMetricName: string, placeholderName: string = 'Key Metric'): Task<WebActor> =>
    async (actor: WebActor): Promise<void> => {
      const titleTarget = DashboardPageTargets.dashboardItemTitle(keyMetricName);
      await actor.browse().check(titleTarget).hasText(new RegExp(keyMetricName));
      await actor.browse().setTextContent(titleTarget, placeholderName);
    },
};
