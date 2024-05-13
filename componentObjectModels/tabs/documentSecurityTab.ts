import { Locator, Page } from '@playwright/test';
import { DynamicDocument } from '../../models/dynamicDocument';
import { DualPaneSelector } from '../controls/dualPaneSelector';

export class DocumentSecurityTab {
  private readonly page: Page;
  private readonly fieldSecurityOverridesDualPaneSelector: DualPaneSelector;
  private readonly contentSecurityOverrideCheckbox: Locator;
  private readonly roleAccessSelector: Locator;
  private readonly rolesDualPaneSelector: DualPaneSelector;

  constructor(page: Page) {
    this.page = page;
    this.fieldSecurityOverridesDualPaneSelector = new DualPaneSelector(
      page.locator('.label:has-text("Field Security Overrides") + .data .onx-selector')
    );

    this.contentSecurityOverrideCheckbox = page
      .locator('.label:has-text("Content Security Overrides") + .text')
      .getByRole('checkbox');
    this.roleAccessSelector = page.locator('.label:has-text("Role Access") + .data').getByRole('listbox');
    this.rolesDualPaneSelector = new DualPaneSelector(page.locator('.label:has-text("Roles") + .data .onx-selector'));
  }

  async fillOutTab(document: DynamicDocument) {
    if (document.fieldsToOverride.length > 0) {
      await this.fieldSecurityOverridesDualPaneSelector.selectOptions(document.fieldsToOverride);
    }

    await this.contentSecurityOverrideCheckbox.setChecked(document.overrideContentSecurity);

    await this.roleAccessSelector.click();
    await this.page.getByRole('option', { name: document.roleAccess }).click();

    if (document.roleAccess === 'Restrict access to specific roles') {
      await this.rolesDualPaneSelector.selectOptions(document.roles);
    }
  }
}
