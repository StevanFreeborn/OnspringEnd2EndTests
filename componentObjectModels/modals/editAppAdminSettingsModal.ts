import { Page } from '@playwright/test';
import { EditBaseAdminSettingsModal } from './editBaseAdminSettingsModal';

export class EditAppAdminSettingsModal extends EditBaseAdminSettingsModal {
  constructor(page: Page) {
    super(page);
  }
}
