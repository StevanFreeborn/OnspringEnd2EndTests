import { Page } from '@playwright/test';
import { EditBaseGeneralSettingsModal } from './editBaseGeneralSettingsModal';

export class EditAppGeneralSettingsModal extends EditBaseGeneralSettingsModal {
  constructor(page: Page) {
    super(page);
  }
}
