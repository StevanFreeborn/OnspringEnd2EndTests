import { Page } from '@playwright/test';
import { EditSurveyDisplaySettingsModal } from '../modals/editSurveyDisplaySettingsModal';
import { EditSurveyGeneralSettingsModal } from '../modals/editSurveyGeneralSettingsModal';
import { BaseAppOrSurveyGeneralTab } from './baseAppOrSurveyGeneralTab';

export class SurveyGeneralTab extends BaseAppOrSurveyGeneralTab {
  readonly editGeneralSettingsModal: EditSurveyGeneralSettingsModal;
  readonly editDisplaySettingsModal: EditSurveyDisplaySettingsModal;

  constructor(page: Page) {
    super(page);
    this.editGeneralSettingsModal = new EditSurveyGeneralSettingsModal(page);
    this.editDisplaySettingsModal = new EditSurveyDisplaySettingsModal(page);
  }
}
