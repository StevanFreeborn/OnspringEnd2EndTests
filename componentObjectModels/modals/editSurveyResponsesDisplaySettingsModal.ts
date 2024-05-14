import { Page } from '@playwright/test';
import { EditBaseDisplaySettingsModal } from './editBaseDisplaySettingsModal';

export class EditSurveyResponsesDisplaySettingsModal extends EditBaseDisplaySettingsModal {
  constructor(page: Page) {
    super(page);
  }
}
