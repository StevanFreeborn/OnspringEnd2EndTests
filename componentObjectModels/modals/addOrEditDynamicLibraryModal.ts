import { Page } from '@playwright/test';
import { DynamicLibraryContentSelectionSettingsTab } from '../tabs/dynamicLibraryContentSelectionSettingsTab';
import { AddOrEditLibraryModal } from './addOrEditLibraryModal';

export class AddOrEditDynamicLibraryModal extends AddOrEditLibraryModal {
  contentSelectionTab = new DynamicLibraryContentSelectionSettingsTab(this.modal);

  constructor(page: Page) {
    super(page);
  }
}
