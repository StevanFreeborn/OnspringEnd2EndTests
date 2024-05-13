import { Locator, Page } from '@playwright/test';
import { DocumentDisplayRulesTab } from '../../componentObjectModels/tabs/documentDisplayRulesTab';
import { DocumentInformationTab } from '../../componentObjectModels/tabs/documentInformationTab';
import { DocumentOutputTab } from '../../componentObjectModels/tabs/documentOutputTab';
import { DocumentSecurityTab } from '../../componentObjectModels/tabs/documentSecurityTab';
import { DynamicDocument } from '../../models/dynamicDocument';
import { BaseAdminPage } from '../baseAdminPage';

export class EditDocumentPage extends BaseAdminPage {
  readonly pathRegex: RegExp;

  readonly saveButton: Locator;

  readonly informationTabButton: Locator;
  readonly displayRulesTabButton: Locator;
  readonly securityTabButton: Locator;
  readonly outputTabButton: Locator;

  readonly informationTab: DocumentInformationTab;
  readonly displayRulesTab: DocumentDisplayRulesTab;
  readonly securityTab: DocumentSecurityTab;
  readonly outputTab: DocumentOutputTab;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/Document\/\d+\/Edit/;

    this.saveButton = page.getByRole('link', { name: 'Save Changes' });

    this.informationTabButton = page.getByRole('tab', { name: 'Document Information' });
    this.displayRulesTabButton = page.getByRole('tab', { name: 'Display Rules' });
    this.securityTabButton = page.getByRole('tab', { name: 'Security' });
    this.outputTabButton = page.getByRole('tab', { name: 'Output' });

    this.informationTab = new DocumentInformationTab(page);
    this.displayRulesTab = new DocumentDisplayRulesTab(page);
    this.securityTab = new DocumentSecurityTab(page);
    this.outputTab = new DocumentOutputTab(page);
  }

  async fillOutForm(document: DynamicDocument) {
    await this.informationTabButton.click();
    await this.informationTab.fillOutTab(document);

    await this.displayRulesTabButton.click();
    await this.displayRulesTab.fillOutTab(document);

    await this.securityTabButton.click();
    await this.securityTab.fillOutTab(document);

    await this.outputTabButton.click();
    await this.outputTab.fillOutTab(document);
  }

  async save() {
    const saveResponse = this.page.waitForResponse(
      res => res.url().match(this.pathRegex) !== null && res.request().method() === 'POST'
    );

    await this.saveButton.click();
    await saveResponse;
  }
}
