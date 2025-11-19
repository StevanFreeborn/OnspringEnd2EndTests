import { FrameLocator, Locator } from '../../fixtures';

export class TabbedColorPicker {
  private readonly frame?: FrameLocator;
  private readonly control: Locator;

  constructor(control: Locator, frame?: FrameLocator) {
    this.control = control;
    this.frame = frame;
  }

  async selectColor(color: string) {
    const page = this.control.page();
    const popupOwner = this.frame ?? page;
    const colorPickerPopup = popupOwner.locator('.tabbed-color-popup:visible');
    const customTab = colorPickerPopup.getByRole('tab', { name: 'Custom' });
    const colorInput = colorPickerPopup.locator('.k-color-value');

    await this.control.click();
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(1000);
    await customTab.click();
    await colorInput.clear();
    await colorInput.pressSequentially(color, { delay: 150 });
    await colorPickerPopup.locator('.popup-close').click();
  }
}
