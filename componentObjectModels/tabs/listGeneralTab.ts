import { Locator, Page } from '@playwright/test';
import { SharedList } from '../../models/sharedList';

export class ListGeneralTab {
  readonly nameInput: Locator;
  readonly descriptionEditor: Locator;
  readonly statusSwitch: Locator;
  readonly statusToggle: Locator;

  constructor(page: Page) {
    this.nameInput = page.getByLabel('Name');
    this.descriptionEditor = page.locator('.content-area.mce-content-body');
    this.statusSwitch = page.getByRole('switch', { name: 'Status' });
    this.statusToggle = this.statusSwitch.locator('span').nth(3);
  }

  private async needToUpdateSwitch(list: SharedList) {
    const switchState = await this.statusSwitch.getAttribute('aria-checked');
    return (list.status === true && switchState === 'false') || (list.status === false && switchState === 'true');
  }

  async fillOutForm(list: SharedList) {
    await this.nameInput.fill(list.name);
    await this.descriptionEditor.fill(list.description);

    if (await this.needToUpdateSwitch(list)) {
      await this.statusToggle.click();
    }
  }
}
