import { Page } from '@playwright/test';
import { EditSurveyResponsesDisplaySettingsModal } from '../modals/editSurveyResponsesDisplaySettingsModal';
import { EditSurveyResponsesGeneralSettingsModal } from '../modals/editSurveyResponsesGeneralSettingsModal';
import { EditSurveyResponsesNotesSettingsModal } from '../modals/editSurveyResponsesNotesSettingsModal';
import { BaseGeneralTab } from './baseGeneralTab';

export class SurveyResponsesGeneralTab extends BaseGeneralTab {
  readonly editGeneralSettingsModal: EditSurveyResponsesGeneralSettingsModal;
  readonly editDisplaySettingsModal: EditSurveyResponsesDisplaySettingsModal;
  readonly editNotesSettingsModal: EditSurveyResponsesNotesSettingsModal;

  constructor(page: Page) {
    super(page);
    this.editGeneralSettingsModal = new EditSurveyResponsesGeneralSettingsModal(page);
    this.editDisplaySettingsModal = new EditSurveyResponsesDisplaySettingsModal(page);
    this.editNotesSettingsModal = new EditSurveyResponsesNotesSettingsModal(page);
  }
}
