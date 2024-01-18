import { Page } from '@playwright/test';
import { EditBaseGeneralSettingsModal } from './editBaseGeneralSettingsModal';

export class EditSurveyGeneralSettingsModal extends EditBaseGeneralSettingsModal {
  constructor(page: Page) {
    super(page);
  }
}
