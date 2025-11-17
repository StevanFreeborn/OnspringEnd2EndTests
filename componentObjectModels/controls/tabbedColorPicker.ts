import { Locator } from '../../fixtures';

export class TabbedColorPicker {
  private readonly control: Locator;

  constructor(control: Locator) {
    this.control = control;
  }

  async selectColor(color: string) {
    await this.control.click();
  }
}
