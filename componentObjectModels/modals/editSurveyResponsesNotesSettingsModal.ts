import { Page } from '@playwright/test';
import { EditBaseNotesSettingsModal } from './editBaseNotesSettingsModal';

export class EditSurveyResponsesNotesSettingsModal extends EditBaseNotesSettingsModal {
  constructor(page: Page) {
    super(page);
  }
}
