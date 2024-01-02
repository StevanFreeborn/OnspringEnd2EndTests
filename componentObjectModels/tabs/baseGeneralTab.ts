import { Locator, Page } from '@playwright/test';

export abstract class BaseGeneralTab {
  protected createSettingSelector(settingName: string) {
    return `td:nth-match(td:has-text("${settingName}") + td, 1)`;
  }

  readonly name: Locator;
  readonly status: Locator;
  readonly description: Locator;
  readonly contentVersionStatus: Locator;
  readonly concurrentEditAlertStatus: Locator;
  readonly displayLink: Locator;
  readonly integrationLink: Locator;
  readonly displayFields: Locator;
  readonly sort: Locator;
  readonly notes: Locator;

  readonly editGeneralSettingsLink: Locator;
  readonly editDisplaySettingsLink: Locator;
  readonly editNotesSettingLink: Locator;

  constructor(page: Page) {
    this.name = page.locator(this.createSettingSelector('Name'));
    this.status = page.locator(this.createSettingSelector('Status'));
    this.description = page.locator(this.createSettingSelector('Description'));
    this.contentVersionStatus = page.locator(this.createSettingSelector('Content Versioning'));
    this.concurrentEditAlertStatus = page.locator(this.createSettingSelector('Concurrent Edit Alert'));
    this.displayLink = page.locator(this.createSettingSelector('Display Link Field'));
    this.integrationLink = page.locator(this.createSettingSelector('Integration Link Field'));
    this.displayFields = page.locator(this.createSettingSelector('Display Fields'));
    this.sort = page.locator(this.createSettingSelector('Sort'));
    this.notes = page.locator(this.createSettingSelector('Notes'));

    this.editGeneralSettingsLink = page.getByRole('heading', { name: 'Edit General Settings' }).getByRole('link');
    this.editDisplaySettingsLink = page.getByRole('heading', { name: 'Edit Display Settings' }).getByRole('link');
    this.editNotesSettingLink = page.getByRole('heading', { name: 'Edit Notes' }).getByRole('link');
  }
}
