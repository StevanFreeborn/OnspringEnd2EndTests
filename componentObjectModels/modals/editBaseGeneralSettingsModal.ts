import { Locator, Page } from '@playwright/test';

export abstract class EditBaseGeneralSettingsModal {
  readonly nameInput: Locator;
  readonly descriptionEditor: Locator;
  readonly statusToggle: Locator;
  readonly statusSwitch: Locator;
  readonly contentVersionStatusSwitch: Locator;
  readonly contentVersionStatusToggle: Locator;
  readonly contentVersionTypes: Locator;
  readonly directUserSavesCheckbox: Locator;
  readonly indirectUserSavesCheckbox: Locator;
  readonly apiSavesCheckbox: Locator;
  readonly systemSavesCheckbox: Locator;
  readonly concurrentEditAlertCheckbox: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  protected constructor(page: Page) {
    this.nameInput = page.getByLabel('Name');
    this.descriptionEditor = page.locator('.content-area.mce-content-body');
    this.statusSwitch = page.getByRole('switch', { name: 'Status' });
    this.statusToggle = this.statusSwitch.locator('span').nth(3);
    this.contentVersionStatusSwitch = page.getByRole('switch', {
      name: 'Content Versioning',
    });
    this.contentVersionStatusToggle = page.getByRole('switch', { name: 'Content Versioning' }).locator('span').nth(3);
    this.contentVersionTypes = page.locator('#versioning-types');
    this.directUserSavesCheckbox = page.getByLabel('Direct User Saves', {
      exact: true,
    });
    this.indirectUserSavesCheckbox = page.getByLabel('Indirect User Saves', {
      exact: true,
    });
    this.apiSavesCheckbox = page.getByLabel('API Saves', { exact: true });
    this.systemSavesCheckbox = page.getByLabel('System Saves', { exact: true });
    this.saveButton = page.getByRole('button', {
      name: 'Save',
    });
    this.cancelButton = page.getByRole('button', {
      name: 'Cancel',
    });
    this.concurrentEditAlertCheckbox = page.getByLabel('Concurrent Edit Alert');
  }
}
