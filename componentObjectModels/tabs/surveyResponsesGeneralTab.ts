import { Page } from '@playwright/test';
import { EditSurveyResponsesGeneralSettingsModal } from '../modals/editSurveyResponsesGeneralSettingsModal';
import { BaseGeneralTab } from './baseGeneralTab';

export class SurveyResponsesGeneralTab extends BaseGeneralTab {
  readonly editGeneralSettingsModal: EditSurveyResponsesGeneralSettingsModal;

  constructor(page: Page) {
    super(page);
    this.editGeneralSettingsModal = new EditSurveyResponsesGeneralSettingsModal(page);
  }
}
