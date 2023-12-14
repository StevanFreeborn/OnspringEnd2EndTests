import { Locator, Page } from '@playwright/test';
import { FormattedTextBlockGeneralTab } from '../tabs/formattedTextBlockGeneralTab';
import { FormattedTextBlockSecurityTab } from '../tabs/formattedTextBlockSecurityTab';
import { LayoutItemSecurityTab } from '../tabs/layoutItemSecurityTab';
import { LayoutItemUsageTab } from '../tabs/layoutItemUsageTab';
import { AddOrEditLayoutItemModal } from './addOrEditLayoutItemModal';

export class AddOrEditFormattedBlockModal extends AddOrEditLayoutItemModal {
  private readonly frame: Locator;
  readonly generalSettingsTabButton: Locator;
  readonly securityTabButton: Locator;
  readonly usageTabButton: Locator;
  readonly securityTab: LayoutItemSecurityTab;
  readonly usageTab: LayoutItemUsageTab;
  readonly generalTab: FormattedTextBlockGeneralTab;
  private readonly addOrEditPathRegex: RegExp = /\/Admin\/App\/\d+\/LayoutObject\/(AddTextObject|\d+\/EditTextObject)/;

  constructor(page: Page) {
    super(page);
    this.frame = page.locator('.ajax-form-dialog').first();
    this.generalSettingsTabButton = this.frame.getByRole('tab', { name: 'General Settings' });
    this.securityTabButton = this.frame.getByRole('tab', { name: 'Security' });
    this.usageTabButton = this.frame.getByRole('tab', { name: 'Usage' });
    this.generalTab = new FormattedTextBlockGeneralTab(this.frame);
    this.securityTab = new FormattedTextBlockSecurityTab(this.frame);
    this.usageTab = new LayoutItemUsageTab();
  }

  async save() {
    const addOrEditTextBlockResponse = this.saveButton.page().waitForResponse(this.addOrEditPathRegex);

    await this.saveButton.click();
    await addOrEditTextBlockResponse;
  }
}
