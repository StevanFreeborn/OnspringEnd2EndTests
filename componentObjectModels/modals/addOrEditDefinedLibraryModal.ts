import { Locator, Page } from '@playwright/test';
import { DefinedLibraryContentDefinition } from '../../models/createMultipleRecordsOutcome';
import { DefinedLibraryContentCopySettingsTab } from '../tabs/definedLibraryContentCopySettingsTab';
import { DefinedLibraryContentSelectionSettingsTab } from '../tabs/definedLibraryContentSelectionSettingsTab';

export class AddOrEditDefinedLibraryModal {
  private readonly modal: Locator;
  private readonly contentSelectionSettingsTabButton: Locator;
  private readonly contentCopySettingsTabButton: Locator;
  private readonly contentSelectionTab: DefinedLibraryContentSelectionSettingsTab;
  private readonly contentCopySettingsTab: DefinedLibraryContentCopySettingsTab;
  readonly okButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.modal = page.getByRole('dialog', { name: /app definition/i });
    this.contentSelectionSettingsTabButton = this.modal.getByRole('tab', { name: 'Content Selection Settings' });
    this.contentCopySettingsTabButton = this.modal.getByRole('tab', { name: 'Content Copy Settings' });
    this.contentSelectionTab = new DefinedLibraryContentSelectionSettingsTab(this.modal);
    this.contentCopySettingsTab = new DefinedLibraryContentCopySettingsTab(this.modal);
    this.okButton = this.modal.getByRole('button', { name: 'OK' });
    this.cancelButton = this.modal.getByRole('button', { name: 'Cancel' });
  }

  async fillOutForm(definition: DefinedLibraryContentDefinition) {
    await this.contentSelectionSettingsTabButton.click();
    await this.contentSelectionTab.fillOutForm(definition);

    await this.contentCopySettingsTabButton.click();
    await this.contentCopySettingsTab.fillOutForm(definition);
  }
}
