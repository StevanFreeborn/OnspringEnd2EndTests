import { Page } from '@playwright/test';
import { DefinedLibraryContentSelectionSettingsTab } from '../tabs/definedLibraryContentSelectionSettingsTab';
import { AddOrEditLibraryModal } from './addOrEditLibraryModal';

export class AddOrEditDefinedLibraryModal extends AddOrEditLibraryModal {
  contentSelectionTab = new DefinedLibraryContentSelectionSettingsTab(this.modal);

  constructor(page: Page) {
    super(page);
  }
}
