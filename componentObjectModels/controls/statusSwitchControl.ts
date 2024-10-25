import { Locator } from '@playwright/test';

export class StatusSwitch {
  private readonly switch: Locator;
  private readonly handle: Locator;

  constructor(control: Locator) {
    this.switch = control.getByRole('switch');
    this.handle = control.locator('span').nth(3);
  }

  /**
   * Toggles the status of the switch.
   * @param status The status to toggle to. True for on, false for off.
   * @returns Promise<void>
   */
  async toggle(status: boolean) {
    const currentStatus = await this.switch.getAttribute('aria-checked');

    if (currentStatus === status.toString()) {
      return;
    }

    await this.handle.click();
  }
}
