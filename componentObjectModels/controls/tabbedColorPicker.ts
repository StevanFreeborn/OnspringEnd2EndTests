import { FrameLocator, Locator } from '../../fixtures';

export class TabbedColorPicker {
  private readonly frame?: FrameLocator;
  private readonly control: Locator;

  constructor(control: Locator, frame?: FrameLocator) {
    this.control = control;
    this.frame = frame;
  }

  async selectColor(color: string) {
    const popupOwner = this.frame ?? this.control.page();
    const colorPickerPopup = popupOwner.locator('.tabbed-color-popup:visible');
    const customTab = colorPickerPopup.getByRole('tab', { name: 'Custom' });
    const colorInput = colorPickerPopup.locator('.k-color-value');

    // TODO: Make this work
    await this.control.click();
    await customTab.click();
    await colorInput.clear();
    await colorInput.pressSequentially(color, { delay: 150 });
    await colorPickerPopup.locator('.popup-close').click();
  }
}
