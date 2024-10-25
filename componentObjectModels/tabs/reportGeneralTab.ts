import { FrameLocator, Locator } from '@playwright/test';
import { ReportSchedulingStatus, SavedReport } from '../../models/report';
import { DateFieldControl } from '../controls/dateFieldControl';
import { DualPaneSelector } from '../controls/dualPaneSelector';
import { EmailAddressControl } from '../controls/emailAddressControl';

export class ReportGeneralTab {
  private readonly frame: FrameLocator;
  private readonly nameInput: Locator;
  private readonly descriptionEditor: Locator;
  private readonly scheduleStatusToggle: Locator;
  private readonly scheduleStatusSwitch: Locator;
  private readonly sendFrequencySelector: Locator;
  private readonly startingOnDateControl: DateFieldControl;
  private readonly endingOnDateControl: DateFieldControl;
  private readonly sendAsSelector: Locator;
  private readonly typeSelector: Locator;
  private readonly dataSelector: Locator;
  private readonly doNotSendIfEmptyCheckbox: Locator;
  private readonly dataFormatSelector: Locator;
  private readonly numberDateFormatSelector: Locator;
  private readonly includeAllLevelsCheckbox: Locator;
  private readonly specificGroupsDualPaneSelector: DualPaneSelector;
  private readonly specificUsersDualPaneSelector: DualPaneSelector;
  private readonly fromNameInput: Locator;
  private readonly fromAddressControl: EmailAddressControl;
  private readonly subjectInput: Locator;
  private readonly bodyEditor: Locator;
  private readonly additionalRecipientsCheckbox: Locator;

  constructor(frame: FrameLocator) {
    this.frame = frame;
    this.nameInput = this.frame.getByLabel('Report Name');
    this.descriptionEditor = this.frame
      .locator('.label:has-text("Description") + .data')
      .locator('.content-area.mce-content-body');

    this.scheduleStatusSwitch = this.frame.locator('.label:has-text("Schedule") + .data').getByRole('switch');
    this.scheduleStatusToggle = this.scheduleStatusSwitch.locator('span').nth(3);
    this.sendFrequencySelector = this.frame.locator('.label:has-text("Send") + .data').last().getByRole('listbox');
    this.startingOnDateControl = new DateFieldControl(this.frame.locator('.label:has-text("Starting On") + .data'));
    this.endingOnDateControl = new DateFieldControl(this.frame.locator('.label:has-text("Ending On") + .data'));
    this.sendAsSelector = this.frame.locator('.label:has-text("Send As") + .data').getByRole('listbox');
    this.typeSelector = this.frame.locator('.label:has-text("Type") + .data').getByRole('listbox');
    this.dataSelector = this.frame.locator('.label:has-text("Data") + .data').first().getByRole('listbox');
    this.doNotSendIfEmptyCheckbox = this.frame.getByRole('checkbox', { name: 'Do not send if the report is empty' });
    this.dataFormatSelector = this.frame.locator('.label:has-text("Data Format") + .data').getByRole('listbox');
    this.numberDateFormatSelector = this.frame
      .locator('.label:has-text("Number/Date Format") + .data')
      .getByRole('listbox');

    this.includeAllLevelsCheckbox = this.frame.getByLabel('Include All Levels');

    this.specificGroupsDualPaneSelector = new DualPaneSelector(
      this.frame.locator('.label:has-text("Specific Groups") + .data')
    );

    this.specificUsersDualPaneSelector = new DualPaneSelector(
      this.frame.locator('.label:has-text("Specific Users") + .data')
    );

    this.fromNameInput = this.frame.getByLabel('From Name');
    this.fromAddressControl = new EmailAddressControl(this.frame.locator('.from-email-container'));
    this.subjectInput = this.frame.getByLabel('Subject');
    this.bodyEditor = this.frame
      .locator('.label:has-text("Message") + .data')
      .locator('.content-area.mce-content-body');

    this.additionalRecipientsCheckbox = this.frame.getByLabel('Additional Recipients');
  }

  private async updateScheduleStatus(status: ReportSchedulingStatus) {
    const currentStatus = await this.scheduleStatusSwitch.getAttribute('aria-checked');

    if ((status === 'Enabled' && currentStatus === 'false') || (status === 'Disabled' && currentStatus === 'true')) {
      await this.scheduleStatusToggle.click();
    }
  }

  private async selectSendFrequency(frequency: string) {
    await this.sendFrequencySelector.click();
    await this.frame.getByRole('option', { name: frequency }).click();
  }

  private async selectSendAs(sendAs: string) {
    await this.sendAsSelector.click();
    await this.frame.getByRole('option', { name: sendAs }).click();
  }

  private async selectType(type: string) {
    await this.typeSelector.click();
    await this.frame.getByRole('option', { name: type }).click();
  }

  private async selectData(data: string) {
    await this.dataSelector.click();
    await this.frame.getByRole('option', { name: data }).click();
  }

  private async selectDataFormat(format: string) {
    await this.dataFormatSelector.click();
    await this.frame.getByRole('option', { name: format }).click();
  }

  private async selectNumberDateFormat(format: string) {
    await this.numberDateFormatSelector.click();
    await this.frame.getByRole('option', { name: format }).click();
  }

  async fillOutForm(report: SavedReport) {
    await this.nameInput.fill(report.name);
    await this.descriptionEditor.fill(report.description);
    await this.updateScheduleStatus(report.scheduling);

    if (report.scheduling === 'Enabled' && report.schedule !== undefined) {
      await this.selectSendFrequency(report.schedule.sendFrequency);
      await this.startingOnDateControl.enterDate(report.schedule.startingOn);

      if (report.schedule.endingOn !== undefined) {
        await this.endingOnDateControl.enterDate(report.schedule.endingOn);
      }

      await this.selectSendAs(report.schedule.sendAs);
      await this.selectType(report.schedule.type);
      await this.selectData(report.schedule.data);
      await this.doNotSendIfEmptyCheckbox.setChecked(report.schedule.doNotSendIfEmpty);

      await this.selectDataFormat(report.schedule.dataFormat);
      await this.selectNumberDateFormat(report.schedule.numberDateFormat);
      await this.includeAllLevelsCheckbox.setChecked(report.schedule.includeAllLevels);

      if (report.security !== 'Private to me') {
        await this.specificGroupsDualPaneSelector.selectOptions(report.schedule.specificGroups);
        await this.specificUsersDualPaneSelector.selectOptions(report.schedule.specificUsers);
      }

      await this.fromNameInput.fill(report.schedule.fromName);
      await this.fromAddressControl.enterAddress(report.schedule.fromAddress);
      await this.subjectInput.fill(report.schedule.subject);
      await this.bodyEditor.fill(report.schedule.body);
      await this.additionalRecipientsCheckbox.setChecked(report.schedule.appendAdditionalRecipients);
    }
  }
}
