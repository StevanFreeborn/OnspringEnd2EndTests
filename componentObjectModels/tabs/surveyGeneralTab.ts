import { Page } from '@playwright/test';
import { EditSurveyGeneralSettingsModal } from '../modals/editSurveyGeneralSettingsModal';
import { BaseAppOrSurveyGeneralTab } from './baseAppOrSurveyGeneralTab';

export class SurveyGeneralTab extends BaseAppOrSurveyGeneralTab {
  readonly editSurveyGeneralSettingsModal: EditSurveyGeneralSettingsModal;

  constructor(page: Page) {
    super(page);
    this.editSurveyGeneralSettingsModal = new EditSurveyGeneralSettingsModal(page);
  }
}
