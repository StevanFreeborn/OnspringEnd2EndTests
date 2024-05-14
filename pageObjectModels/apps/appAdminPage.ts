import { Page } from '@playwright/test';
import { AppDocumentsTab } from '../../componentObjectModels/tabs/appDocumentsTab';
import { AppGeneralTab } from '../../componentObjectModels/tabs/appGeneralTab';
import { AppLayoutTab } from '../../componentObjectModels/tabs/appLayoutTab';
import { AppMessagingTab } from '../../componentObjectModels/tabs/appMessagingTab';
import { AppTriggerTab } from '../../componentObjectModels/tabs/appTriggersTab';
import { BASE_URL } from '../../playwright.config';
import { BaseAppOrSurveyAdminPage } from '../baseAppOrSurveyAdminPage';

export class AppAdminPage extends BaseAppOrSurveyAdminPage {
  readonly path: string;
  readonly pathRegex: RegExp;

  readonly generalTab: AppGeneralTab;
  readonly layoutTab: AppLayoutTab;
  readonly triggersTab: AppTriggerTab;
  readonly messagingTab: AppMessagingTab;
  readonly documentsTab: AppDocumentsTab;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/App/';
    this.pathRegex = new RegExp(`${BASE_URL}${this.path}[0-9]+`);

    this.generalTab = new AppGeneralTab(page);
    this.layoutTab = new AppLayoutTab(page);
    this.triggersTab = new AppTriggerTab(page);
    this.messagingTab = new AppMessagingTab(page);
    this.documentsTab = new AppDocumentsTab(page);
  }

  async goto(appId: number) {
    const path = `${this.path}${appId}`;
    await this.page.goto(path);
  }

  getIdFromUrl() {
    if (this.page.url().includes(this.path) === false) {
      throw new Error('The current page is not an app admin page.');
    }

    const url = this.page.url();
    const urlParts = url.split('/');
    const appId = urlParts[urlParts.length - 1];
    return parseInt(appId);
  }
}
