import { Locator, Page } from '@playwright/test';
import { DualPaneSelector } from '../controls/dualPaneSelector';

export type FieldsAndObjectsReportExportFormat = 'Excel' | 'PDF' | 'Microsoft Word';

export type FieldsAndObjectsReportExportableField =
  | 'Name'
  | 'Description'
  | 'Type'
  | 'List Values'
  | 'Status'
  | 'Field Security'
  | 'Field ID'
  | 'Last Saved'
  | 'Help';

export type ExportFieldsAndObjectsReportOptions = {
  format: FieldsAndObjectsReportExportFormat;
  fields: FieldsAndObjectsReportExportableField[];
  includeUsage?: boolean;
  includeListValueGUIDs?: boolean;
  messageCenterAlertsOnly?: boolean;
};

export class ExportFieldsAndObjectsReportModal {
  private readonly modal: Locator;
  private readonly exportFormatSelector: Locator;
  private readonly reportFieldsDualPaneSelector: DualPaneSelector;
  private readonly includeUsageCheckbox: Locator;
  private readonly includeListValueGUIDsCheckbox: Locator;
  private readonly messageCenterAlertsOnlyCheckbox: Locator;
  private readonly exportButton: Locator;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: 'Export Fields & Objects' });
    this.exportFormatSelector = this.modal.locator('.label:has-text("Format") + .data').getByRole('listbox');
    this.reportFieldsDualPaneSelector = new DualPaneSelector(
      this.modal.locator('.label:has-text("Fields") + .data .onx-selector')
    );
    this.includeUsageCheckbox = this.modal.getByRole('checkbox', { name: 'Include usage data (Word and PDF only)' });
    this.includeListValueGUIDsCheckbox = this.modal.getByRole('checkbox', {
      name: 'Include list value GUIDs for API development',
    });
    this.messageCenterAlertsOnlyCheckbox = this.modal.getByRole('checkbox', {
      name: 'Message Center Alerts Only',
    });
    this.exportButton = this.modal.getByRole('button', { name: 'Export' });
  }

  private async selectExportFormat(format: string) {
    await this.exportFormatSelector.click();
    await this.modal.page().getByRole('option', { name: format }).click();
  }

  async exportReport({
    format,
    fields,
    includeUsage = false,
    includeListValueGUIDs = false,
    messageCenterAlertsOnly = false,
  }: ExportFieldsAndObjectsReportOptions) {
    await this.selectExportFormat(format);
    await this.reportFieldsDualPaneSelector.removalAllOptions();
    await this.reportFieldsDualPaneSelector.selectOptions(fields);

    if (format !== 'Excel') {
      await this.includeUsageCheckbox.setChecked(includeUsage);
    }

    if (fields.includes('List Values')) {
      await this.includeListValueGUIDsCheckbox.setChecked(includeListValueGUIDs);
    }

    await this.messageCenterAlertsOnlyCheckbox.setChecked(messageCenterAlertsOnly);
    await this.exportButton.click();
  }
}
