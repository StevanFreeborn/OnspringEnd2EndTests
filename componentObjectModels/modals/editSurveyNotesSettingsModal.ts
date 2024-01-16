import { Page } from '@playwright/test';
import { EditBaseNotesSettingsModal } from './editBaseNotesSettingsModal';

export class EditSurveyNotesSettingsModal extends EditBaseNotesSettingsModal {
  constructor(page: Page) {
    super(page);
  }
}
