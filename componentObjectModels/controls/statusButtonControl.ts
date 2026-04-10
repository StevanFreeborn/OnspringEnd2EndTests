import { Locator } from '../../fixtures';

export class StatusButtonControl {
  private readonly switch: Locator;

  constructor(control: Locator) {
    this.switch = control.locator('.button-status-container');
  }

  selectStatus(status: 'Enabled' | 'Disabled' | 'Invalid') {
    return this.switch.getByRole('button', { name: status }).click();
  }
}
