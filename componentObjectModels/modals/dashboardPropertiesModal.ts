import { FrameLocator, Locator } from '@playwright/test';
import { Dashboard } from '../../models/dashboard';
import { WaitForOptions } from '../../utils';
import { DualPaneSelector } from '../controls/dualPaneSelector';
import { StatusSwitch } from '../controls/statusSwitchControl';

export class DashboardPropertiesModal {
  private readonly frame: FrameLocator;
  private readonly modal: Locator;
  private readonly nameInput: Locator;
  private readonly displayTitleSwitch: StatusSwitch;
  private readonly titleInput: Locator;
  private readonly titleTextColorPicker: Locator;
  private readonly titleTextFormatRadioButtons: Locator;
  private readonly titleTextAlignmentRadioButtons: Locator;
  private readonly titleBackgroundColorPicker: Locator;
  private readonly dashboardLink: Locator;
  private readonly statusSwitch: StatusSwitch;
  private readonly containersSelector: DualPaneSelector;
  readonly applyButton: Locator;
  readonly cancelButton: Locator;

  constructor(frame: FrameLocator) {
    this.frame = frame;
    this.modal = this.frame.locator('#editDashboardPropertiesPopover');
    this.nameInput = this.modal.getByLabel('Name');
    this.displayTitleSwitch = new StatusSwitch(this.modal.locator('.label:has-text("Display Title") + .data'));
    this.titleInput = this.modal.getByLabel('Title', { exact: true });

    this.titleTextColorPicker = this.modal.locator(
      '.label:has-text("Title Text Color") + .data .k-colorpicker .k-picker-wrap'
    );

    this.titleTextFormatRadioButtons = this.modal.locator('.label:has-text("Title Text Format") + .data');
    this.titleTextAlignmentRadioButtons = this.modal.locator('.label:has-text("Title Alignment") + .data');

    this.titleBackgroundColorPicker = this.modal.locator(
      '.label:has-text("Title Background Color") + .data .k-colorpicker .k-picker-wrap'
    );

    this.dashboardLink = this.modal.locator('.label:has-text("Dashboard Link") + .text');
    this.statusSwitch = new StatusSwitch(this.modal.locator('.label:has-text("Status") + .data'));

    this.containersSelector = new DualPaneSelector(
      this.modal.locator('.label:has-text("Container(s)") + .data'),
      this.frame
    );

    this.applyButton = this.modal.getByRole('link', { name: 'Apply' });
    this.cancelButton = this.modal.getByRole('link', { name: 'Cancel' });
  }

  private async pickColor(colorPicker: Locator, color: string) {
    await colorPicker.click();

    // eslint-disable-next-line playwright/no-wait-for-timeout
    await colorPicker.page().waitForTimeout(1000);

    const colorPickerModal = this.frame.locator('div:visible[data-role="colorpicker"]');
    const colorInput = colorPickerModal.getByPlaceholder('no color');

    await colorInput.clear();
    await colorInput.pressSequentially(color, { delay: 150 });

    await colorPicker.click();
  }

  private async pickTitleTextColor(color: string) {
    await this.pickColor(this.titleTextColorPicker, color);
  }

  private async pickTitleBackgroundColor(color: string) {
    await this.pickColor(this.titleBackgroundColorPicker, color);
  }

  async waitFor(options?: WaitForOptions) {
    await this.modal.waitFor(options);
  }

  async fillOutForm(dashboard: Dashboard) {
    await this.nameInput.fill(dashboard.name);
    await this.displayTitleSwitch.toggle(dashboard.displayTitle);

    if (dashboard.displayTitle) {
      await this.titleInput.fill(dashboard.title.title);
      await this.pickTitleTextColor(dashboard.title.titleTextColor);
      await this.titleTextFormatRadioButtons.getByRole('radio', { name: dashboard.title.titleTextFormat }).click();
      await this.titleTextAlignmentRadioButtons
        .getByRole('radio', { name: dashboard.title.titleTextAlignment })
        .click();
      await this.pickTitleBackgroundColor(dashboard.title.titleBackgroundColor);
    }

    await this.statusSwitch.toggle(dashboard.status);
    await this.containersSelector.selectOptions(dashboard.containers);
  }

  async getDashboardLink() {
    const text = await this.dashboardLink.innerText();
    return text.trim();
  }
}
