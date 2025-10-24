import { Locator, Page } from '../../fixtures';
import { DialGaugeKeyMetric, KeyMetric } from '../../models/keyMetric';
import { DualPaneSelector } from '../controls/dualPaneSelector';
import { SelectARecordModal } from './selectARecordModal';

export class AddOrEditKeyMetricModal {
  private readonly page: Page;
  private readonly savePathRegex: RegExp;
  private readonly modal: Locator;
  private readonly generalTabButton: Locator;
  private readonly objectNameInput: Locator;
  private readonly displayNameCheckbox: Locator;
  private readonly displayNameInput: Locator;
  private readonly descriptionEditor: Locator;

  private readonly keyMetricTabButton: Locator;
  private readonly typeSelector: Locator;
  private readonly appOrSurveySelector: Locator;
  private readonly fieldSourceSelector: Locator;
  private readonly aggregateSelector: Locator;
  private readonly recordSelector: Locator;
  private readonly selectRecordModal: SelectARecordModal;
  private readonly recordFieldSelector: Locator;
  private readonly reportSelector: Locator;
  private readonly needleDisplaySelector: Locator;
  private readonly calculatedPercentageDisplaySelector: Locator;
  private readonly valueRangesGrid: Locator;
  private readonly totalDataTypeTabButtonPicker: Locator;
  private readonly totalDataTotalValueInput: Locator;

  private readonly securityTabButton: Locator;
  private readonly viewSelector: Locator;
  private readonly rolesDualPaneSelector: DualPaneSelector;
  private readonly saveButton;

  constructor(page: Page) {
    this.page = page;
    this.savePathRegex =
      /(\/Admin\/Dashboard\/DashboardObject\/\d+\/EditKeyMetricObject)|(\/Admin\/Dashboard\/DashboardObject\/AddKeyMetricObject)/;
    this.modal = this.page.getByRole('dialog', { name: 'Key Metric' });
    this.generalTabButton = this.modal.getByRole('tab', { name: 'General' });
    this.objectNameInput = this.modal.locator('.label:has-text("Object Name") + .data').getByRole('textbox');
    this.displayNameCheckbox = this.modal.locator('.label:has-text("Display Name") + .data').getByRole('checkbox');
    this.displayNameInput = this.modal.locator('#displayNameRow').getByRole('textbox');
    this.descriptionEditor = this.modal.locator('.content-area.mce-content-body');

    this.keyMetricTabButton = this.modal.getByRole('tab', { name: 'Key Metric' });
    this.typeSelector = this.modal.locator('.label:has-text("Type") + td .data').getByRole('listbox');
    this.appOrSurveySelector = this.modal.locator('.label:has-text("App/Survey") + td .data').getByRole('listbox');
    this.fieldSourceSelector = this.modal.locator('.label:has-text("Field Source") + td .data').getByRole('listbox');
    this.aggregateSelector = this.modal.locator('.label:has-text("Aggregate") + td .data').getByRole('listbox').first();
    this.recordSelector = this.modal.locator('[data-related-record-field]').locator('.onx-selector').first();
    this.selectRecordModal = new SelectARecordModal(this.page);
    this.recordFieldSelector = this.modal.locator('[data-content-record-field]').getByRole('listbox');
    this.reportSelector = this.modal.locator('[data-report-field]').getByRole('listbox');
    this.needleDisplaySelector = this.modal
      .locator('.label:has-text("Needle Display") + td .data')
      .getByRole('listbox');
    this.calculatedPercentageDisplaySelector = this.modal
      .locator('.label:has-text("Calculated Percentage Display") + td .data')
      .getByRole('listbox');
    this.valueRangesGrid = this.modal.locator('.label:has-text("Value Ranges") + .data .color-stops');
    this.totalDataTypeTabButtonPicker = this.modal.locator('.label:has-text("Total Source Type") + .data');
    this.totalDataTotalValueInput = this.modal.locator('.label:has-text("Total Value") + .data input:visible');

    this.securityTabButton = this.modal.getByRole('tab', { name: 'Security' });
    this.viewSelector = this.modal.locator('.label:has-text("View") + .data').getByRole('listbox');
    this.rolesDualPaneSelector = new DualPaneSelector(this.modal.locator('.label:has-text("Roles") + .data'));
    this.saveButton = this.modal.getByRole('button', { name: 'Save' });
  }

  private async selectType(type: string) {
    await this.typeSelector.click();
    await this.page.getByRole('option', { name: type }).click();
  }

  private async selectAppOrSurvey(appOrSurvey: string) {
    await this.appOrSurveySelector.click();
    await this.page.getByRole('option', { name: appOrSurvey }).click();
  }

  private async selectFieldSource(fieldSource: string) {
    await this.fieldSourceSelector.click();
    await this.page.getByRole('option', { name: fieldSource }).click();
  }

  private async selectAggregate(aggregate: string) {
    await this.aggregateSelector.click();
    await this.page.getByRole('option', { name: aggregate }).click();
  }

  private async selectView(view: string) {
    await this.viewSelector.click();
    await this.page.getByRole('option', { name: view }).click();
  }

  private async selectRecord(record: string) {
    await this.recordSelector.click();
    await this.selectRecordModal.selectRecord(record);
  }

  private async selectRecordField(field: string) {
    await this.recordFieldSelector.click();
    await this.page.getByRole('option', { name: field }).click();
  }

  private async selectReport(report: string) {
    await this.reportSelector.click();
    await this.page.getByRole('option', { name: report }).click();
  }

  private async selectNeedleDisplay(needleDisplay: string) {
    await this.needleDisplaySelector.click();
    await this.page.getByRole('option', { name: needleDisplay }).click();
  }

  private async selectCalculatedPercentageDisplay(calculatedPercentageDisplay: number) {
    await this.calculatedPercentageDisplaySelector.click();
    await this.page.getByRole('option', { name: calculatedPercentageDisplay.toString() }).click();
  }

  private async selectTotalSourceType(totalDataType: string) {
    await this.totalDataTypeTabButtonPicker.click();
    await this.page.getByRole('button', { name: totalDataType }).click();
  }

  async fillOutForm(keyMetric: KeyMetric) {
    await this.generalTabButton.click();
    await this.objectNameInput.fill(keyMetric.objectName);

    if (keyMetric.displayName) {
      await this.displayNameCheckbox.uncheck();
      await this.displayNameInput.fill(keyMetric.displayName);
    } else {
      await this.displayNameCheckbox.check();
    }

    await this.descriptionEditor.fill(keyMetric.description);

    await this.keyMetricTabButton.click();
    await this.selectType(keyMetric.type);

    if (keyMetric instanceof DialGaugeKeyMetric) {
      await this.selectNeedleDisplay(keyMetric.needleDisplay);
    }

    await this.selectAppOrSurvey(keyMetric.appOrSurvey);
    await this.selectFieldSource(keyMetric.fieldSource.type);

    if (keyMetric.fieldSource.type === 'App/Survey') {
      await this.selectAggregate(keyMetric.fieldSource.aggregate.fn);
    }

    if (keyMetric.fieldSource.type === 'Content Record') {
      await this.selectRecord(keyMetric.fieldSource.record);
      await this.selectRecordField(keyMetric.fieldSource.field);
    }

    if (keyMetric.fieldSource.type === 'Report') {
      await this.selectReport(keyMetric.fieldSource.report);
      await this.selectAggregate(keyMetric.fieldSource.aggregate.fn);
    }

    if (keyMetric instanceof DialGaugeKeyMetric) {
      await this.selectCalculatedPercentageDisplay(keyMetric.calculatedPercentageDisplay);

      for (const range of keyMetric.valueRanges) {
        const addButton = this.valueRangesGrid.getByRole('button', { name: 'Add Value' });
        const lastRow = this.valueRangesGrid.locator('tbody tr').last();
        const rangeStopInput = lastRow.locator('[data-field="rangeStop"] input:visible');

        await addButton.click();
        await rangeStopInput.fill(range.rangeStop.toString());
      }

      await this.selectTotalSourceType(keyMetric.totalSource.type);

      if (keyMetric.totalSource.type === 'Static') {
        await this.totalDataTotalValueInput.fill(keyMetric.totalSource.totalValue.toString());
      }

      if (keyMetric.totalSource.type === 'Dynamic') {
        throw new Error('Not supported yet');
      }
    }

    await this.securityTabButton.click();
    await this.selectView(keyMetric.security.view);

    if (keyMetric.security.view === 'Private by Role') {
      await this.rolesDualPaneSelector.selectOptions(keyMetric.security.roles);
    }
  }

  async save() {
    const saveResponse = this.page.waitForResponse(this.savePathRegex);
    await this.saveButton.click();
    await saveResponse;
  }
}
