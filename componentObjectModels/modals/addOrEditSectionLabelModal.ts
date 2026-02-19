import { Locator, Page } from '../../fixtures';
import { LayoutItemSecurityTab } from '../tabs/layoutItemSecurityTab';
import { LayoutItemUsageTab } from '../tabs/layoutItemUsageTab';
import { SectionLabelGeneralTab } from '../tabs/sectionLabelGeneralTab';
import { SectionLabelSecurityTab } from '../tabs/sectionLabelSecurityTab';
import { AddOrEditLayoutItemModal } from './addOrEditLayoutItemModal';

export class AddOrEditSectionLabelModal extends AddOrEditLayoutItemModal {
  private readonly frame: Locator;
  readonly generalSettingsTabButton: Locator;
  readonly securityTabButton: Locator;
  readonly usageTabButton: Locator;
  readonly securityTab: LayoutItemSecurityTab;
  readonly usageTab: LayoutItemUsageTab;
  readonly generalTab: SectionLabelGeneralTab;
  private readonly addOrEditPathRegex: RegExp =
    /\/Admin\/App\/\d+\/LayoutObject\/(AddLabelObject|\d+\/EditLabelObject)/;

  constructor(page: Page) {
    super(page);
    this.frame = page.locator('.ajax-form-dialog').first();
    this.generalSettingsTabButton = this.frame.getByRole('tab', { name: 'General Settings' });
    this.securityTabButton = this.frame.getByRole('tab', { name: 'Security' });
    this.usageTabButton = this.frame.getByRole('tab', { name: 'Usage' });
    this.generalTab = new SectionLabelGeneralTab(this.frame);
    this.securityTab = new SectionLabelSecurityTab(this.frame);
    this.usageTab = new LayoutItemUsageTab();
  }

  async save() {
    const addOrEditTextBlockResponse = this.saveButton.page().waitForResponse(this.addOrEditPathRegex);

    await this.saveButton.click();
    await addOrEditTextBlockResponse;
  }
}
