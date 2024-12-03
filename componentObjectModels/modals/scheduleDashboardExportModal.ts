import { Locator, Page } from '@playwright/test';
import { DashboardSchedule } from '../../models/dashboard';
import { WaitForOptions } from '../../utils';
import { DateFieldControl } from '../controls/dateFieldControl';
import { DualPaneSelector } from '../controls/dualPaneSelector';
import { EmailAddressControl } from '../controls/emailAddressControl';
import { StatusSwitch } from '../controls/statusSwitchControl';

export class ScheduleDashboardExportModal {
  private readonly modal: Locator;
  private readonly scheduleToggle: StatusSwitch;
  private readonly frequencySelector: Locator;
  private readonly startingOnDate: DateFieldControl;
  private readonly endingOnDate: DateFieldControl;
  private readonly defaultFilteringCheckbox: Locator;
  private readonly contentSelector: Locator;
  private readonly paperSizeSelector: Locator;
  private readonly marginsInput: Locator;
  private readonly includeFooterCheckbox: Locator;
  private readonly orientationSelector: Locator;
  private readonly scaleInput: Locator;
  private readonly specificUsersDualPaneSelector: DualPaneSelector;
  private readonly specificGroupsDualPaneAddButton: DualPaneSelector;
  private readonly fromNameInput: Locator;
  private readonly fromAddressControl: EmailAddressControl;
  private readonly subjectInput: Locator;
  private readonly bodyEditor: Locator;
  private readonly saveButton: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: 'Configure Scheduled Exports' });
    this.scheduleToggle = new StatusSwitch(this.modal.locator('.label:has-text("Schedule") + .data'));
    this.frequencySelector = this.modal.locator('.label:has-text("Send") + .data').getByRole('listbox');
    this.startingOnDate = new DateFieldControl(
      this.modal.locator('.label:has-text("Starting On") + .data .k-datetimepicker')
    );
    this.endingOnDate = new DateFieldControl(
      this.modal.locator('.label:has-text("Ending On") + .data .k-datetimepicker')
    );
    this.defaultFilteringCheckbox = this.modal
      .locator('.label:has-text("Default Filtering") + .data')
      .getByRole('checkbox');
    this.contentSelector = this.modal.locator('.label:has-text("Content") + .data').getByRole('listbox');
    this.paperSizeSelector = this.modal.locator('.label:has-text("Paper Size") + .data').getByRole('listbox');
    this.marginsInput = this.modal.locator('.label:has-text("Margins") + .data input');
    this.includeFooterCheckbox = this.modal.locator('.label:has-text("Include Footer") + .data').getByRole('checkbox');
    this.orientationSelector = this.modal.locator('.label:has-text("Orientation") + .data').getByRole('listbox');
    this.scaleInput = this.modal.locator('.label:has-text("Scale") + .data input');
    this.specificUsersDualPaneSelector = new DualPaneSelector(
      this.modal.locator('.label:has-text("Specific Users") + .data .onx-selector')
    );
    this.specificGroupsDualPaneAddButton = new DualPaneSelector(
      this.modal.locator('.label:has-text("Specific Groups") + .data .onx-selector')
    );
    this.fromNameInput = this.modal.getByLabel('From Name');
    this.fromAddressControl = new EmailAddressControl(this.modal.locator('.from-email-container'));
    this.subjectInput = this.modal.getByLabel('Subject');
    this.bodyEditor = this.modal.locator('.content-area.mce-content-body:visible');
    this.saveButton = this.modal.getByRole('button', { name: 'Save' });
    this.cancelButton = this.modal.getByRole('button', { name: 'Cancel' });
  }

  async waitFor(options?: WaitForOptions) {
    await this.modal.waitFor(options);
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async fillOutForm(schedule: DashboardSchedule) {
    await this.scheduleToggle.toggle(true);
    await this.selectFrequency(schedule.sendFrequency);
    await this.startingOnDate.enterDate(schedule.startingOn);

    if (schedule.endingOn) {
      await this.endingOnDate.enterDate(schedule.endingOn);
    }

    await this.defaultFilteringCheckbox.setChecked(schedule.defaultFiltering);

    await this.selectContent(schedule.exportDashboardOptions.content);
    await this.selectPaperSize(schedule.exportDashboardOptions.paperSize);
    await this.marginsInput.fill(schedule.exportDashboardOptions.margins.toString());
    await this.includeFooterCheckbox.setChecked(schedule.exportDashboardOptions.includeFooter);
    await this.selectOrientation(schedule.exportDashboardOptions.orientation);
    await this.scaleInput.fill(schedule.exportDashboardOptions.scalePercentage.toString());

    await this.specificUsersDualPaneSelector.selectOptions(schedule.specificUsers);
    await this.specificGroupsDualPaneAddButton.selectOptions(schedule.specificGroups);

    await this.fromNameInput.fill(schedule.fromName);
    await this.fromAddressControl.enterAddress(schedule.fromAddress);
    await this.subjectInput.fill(schedule.subject);
    await this.bodyEditor.fill(schedule.body);
  }

  private async selectFrequency(frequency: string) {
    await this.frequencySelector.click();
    await this.frequencySelector.page().getByRole('option', { name: frequency }).click();
  }

  private async selectContent(content: string) {
    await this.contentSelector.click();
    await this.contentSelector.page().getByRole('option', { name: content }).click();
  }

  private async selectPaperSize(paperSize: string) {
    await this.paperSizeSelector.click();
    await this.paperSizeSelector.page().getByRole('option', { name: paperSize }).click();
  }

  private async selectOrientation(orientation: string) {
    await this.orientationSelector.click();
    await this.orientationSelector.page().getByRole('option', { name: orientation }).click();
  }
}
