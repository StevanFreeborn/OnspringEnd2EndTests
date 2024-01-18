import { Page } from '@playwright/test';
import { EditBaseAdminSettingsModal } from './editBaseAdminSettingsModal';

export class EditSurveyAdminSettingsModal extends EditBaseAdminSettingsModal {
  constructor(page: Page) {
    super(page);
  }
}
