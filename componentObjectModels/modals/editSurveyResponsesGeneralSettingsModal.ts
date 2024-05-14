import { Page } from '@playwright/test';
import { EditBaseGeneralSettingsModal } from './editBaseGeneralSettingsModal';

export class EditSurveyResponsesGeneralSettingsModal extends EditBaseGeneralSettingsModal {
  constructor(page: Page) {
    super(page);
  }
}
