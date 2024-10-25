import { Locator, Page } from '@playwright/test';
import { StatusSwitch } from '../controls/statusSwitchControl';

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
  readonly concurrentEditAlertStatusSwitch: StatusSwitch;
  readonly concurrentEditAlertPermissions: Locator;
  readonly concurrentEditInternalUsersViewInternalUsersCheckbox: Locator;
  readonly concurrentEditInternalUsersViewExternalUsersCheckbox: Locator;
  readonly concurrentEditExternalUsersViewInternalUsersCheckbox: Locator;
  readonly concurrentEditExternalUsersViewExternalUsersCheckbox: Locator;
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
    this.contentVersionStatusToggle = this.contentVersionStatusSwitch.locator('span').nth(3);
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

    this.concurrentEditAlertStatusSwitch = new StatusSwitch(
      page.locator('.label:has-text("Concurrent Edit Alert") + .data')
    );
    this.concurrentEditAlertPermissions = page.locator('#concurrentEditPermissions');
    this.concurrentEditInternalUsersViewInternalUsersCheckbox = page.locator(
      '#ShowInternalUsersForInternalConcurrentEditingView'
    );
    this.concurrentEditInternalUsersViewExternalUsersCheckbox = page.locator(
      '#ShowExternalUsersForInternalConcurrentEditingView'
    );
    this.concurrentEditExternalUsersViewInternalUsersCheckbox = page.locator(
      '#ShowInternalUsersForExternalConcurrentEditingView'
    );
    this.concurrentEditExternalUsersViewExternalUsersCheckbox = page.locator(
      '#ShowExternalUsersForExternalConcurrentEditingView'
    );
  }
}
