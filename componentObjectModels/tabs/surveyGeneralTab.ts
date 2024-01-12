import { Page } from '@playwright/test';
import { EditSurveyDisplaySettingsModal } from '../modals/editSurveyDisplaySettingsModal';
import { EditSurveyGeneralSettingsModal } from '../modals/editSurveyGeneralSettingsModal';
import { BaseAppOrSurveyGeneralTab } from './baseAppOrSurveyGeneralTab';

export class SurveyGeneralTab extends BaseAppOrSurveyGeneralTab {
  readonly editSurveyGeneralSettingsModal: EditSurveyGeneralSettingsModal;
  readonly editSurveyDisplaySettingsModal: EditSurveyDisplaySettingsModal;

  constructor(page: Page) {
    super(page);
    this.editSurveyGeneralSettingsModal = new EditSurveyGeneralSettingsModal(page);
    this.editSurveyDisplaySettingsModal = new EditSurveyDisplaySettingsModal(page);
  }
}
