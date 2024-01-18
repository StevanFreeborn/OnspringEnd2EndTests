import { Page } from '@playwright/test';
import { EditBaseDisplaySettingsModal } from './editBaseDisplaySettingsModal';

export class EditSurveyDisplaySettingsModal extends EditBaseDisplaySettingsModal {
  constructor(page: Page) {
    super(page);
  }
}
