import { FrameLocator, Locator, Page } from '@playwright/test';
import { LayoutItemPermission } from '../../models/layoutItem';
import { LayoutItemSecurityTab } from './layoutItemSecurityTab';

export class FormattedTextBlockSecurityTab extends LayoutItemSecurityTab {
  private readonly page: Page;
  private readonly frame: FrameLocator;
  readonly viewSelect: Locator;
  readonly roleSelector: Locator;
  readonly selectorCloseButton: Locator;

  constructor(frame: Locator) {
    super();
    this.page = frame.page();
    this.frame = frame;
    this.viewSelect = this.frame.getByRole('listbox', { name: 'Administration Permissions' });
    this.roleSelector = this.frame.locator('.onx-selector').first();
    this.selectorCloseButton = this.page.locator('.selector-control:not(.invisible)').getByTitle('Close').first();
  }

  private getUnselectedSelectorOption(roleName: string) {
    return this.page.locator(`.selector-control .unselected-pane li:has-text("${roleName}")`);
  }

  async setPermissions(permissions: LayoutItemPermission[]): Promise<void> {
    if (permissions.length) {
      await this.viewSelect.click();
      await this.page.getByRole('option', { name: 'Private by Role' }).click();

      await this.roleSelector.click();

      for (const permission of permissions) {
        if (permission.read) {
          await this.getUnselectedSelectorOption(permission.roleName).click();
        }
      }

      await this.selectorCloseButton.click();
    } else {
      await this.viewSelect.click();
      await this.page.getByRole('option', { name: 'Public' }).click();
    }
  }
}
