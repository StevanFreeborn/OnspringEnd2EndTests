import { Locator, Page } from '@playwright/test';
import { EditAppDisplaySettingsModalComponent } from '../componentObjectModels/editAppDisplaySettingsModalComponent';
import { EditAppGeneralSettingsModalComponent } from '../componentObjectModels/editAppGeneralSettingsModalComponent';
import { BaseAdminPage } from './baseAdminPage';

export class AppAdminPage extends BaseAdminPage {
  readonly page: Page;
  readonly path: string;
  readonly pathRegex: RegExp;
  readonly appName: Locator;
  readonly appStatus: Locator;
  readonly appDescription: Locator;
  readonly appContentVersionStatus: Locator;
  readonly concurrentEditAlertStatus: Locator;
  readonly editGeneralSettingsLink: Locator;
  readonly editAppGeneralSettingsModal: EditAppGeneralSettingsModalComponent;
  readonly displayLink: Locator;
  readonly integrationLink: Locator;
  readonly editDisplaySettingsLink: Locator;
  readonly editAppDisplaySettingsModal: EditAppDisplaySettingsModalComponent;
  readonly closeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.path = '/Admin/App/';
    this.pathRegex = new RegExp(
      `${process.env.INSTANCE_URL}${this.path}[0-9]+`
    );
    this.editGeneralSettingsLink = page
      .getByRole('heading', { name: 'Edit General Settings' })
      .getByRole('link');
    this.appName = page.locator('td:nth-match(td:has-text("Name") + td, 1)');
    this.appStatus = page.locator(
      'td:nth-match(td:has-text("Status") + td, 1)'
    );
    this.appDescription = page.locator(
      'td:nth-match(td:has-text("Description") + td, 1)'
    );
    this.appContentVersionStatus = page.locator(
      'td:nth-match(td:has-text("Content Versioning") + td, 1)'
    );
    this.concurrentEditAlertStatus = page.locator(
      'td:nth-match(td:has-text("Concurrent Edit Alert") + td, 1)'
    );
    this.editAppGeneralSettingsModal = new EditAppGeneralSettingsModalComponent(
      page
    );
    this.displayLink = page.locator(
      'td:nth-match(td:has-text("Display Link Field") + td, 1)'
    );
    this.integrationLink = page.locator(
      'td:nth-match(td:has-text("Integration Link Field") + td, 1)'
    );
    this.editDisplaySettingsLink = page
      .getByRole('heading', { name: 'Edit Display Settings' })
      .getByRole('link');
    this.editAppDisplaySettingsModal = new EditAppDisplaySettingsModalComponent(
      page
    );
    this.closeButton = page.locator('a:has-text("Close")');
  }

  async goto(appId: number) {
    const path = `${this.path}/${appId}`;
    await this.page.goto(path, { waitUntil: 'load' });
  }
}
