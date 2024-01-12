import { Page } from '@playwright/test';
import { EditAppAdminSettingsModal } from '../modals/editAppAdminSettingsModal';
import { EditAppDisplaySettingsModal } from '../modals/editAppDisplaySettingsModal';
import { EditAppGeneralSettingsModal } from '../modals/editAppGeneralSettingsModal';
import { EditAppNotesSettingsModal } from '../modals/editAppNotesSettingsModal';
import { EditGeocodingSettingsModal } from '../modals/editGeocodingSettingsModal';
import { BaseAppOrSurveyGeneralTab } from './baseAppOrSurveyGeneralTab';

export class AppGeneralTab extends BaseAppOrSurveyGeneralTab {
  readonly editGeneralSettingsModal: EditAppGeneralSettingsModal;
  readonly editDisplaySettingsModal: EditAppDisplaySettingsModal;
  readonly editAdminSettingsModal: EditAppAdminSettingsModal;
  readonly editNotesSettingsModal: EditAppNotesSettingsModal;
  readonly editGeocodingSettingsModal: EditGeocodingSettingsModal;

  constructor(page: Page) {
    super(page);
    this.editGeneralSettingsModal = new EditAppGeneralSettingsModal(page);
    this.editDisplaySettingsModal = new EditAppDisplaySettingsModal(page);
    this.editAdminSettingsModal = new EditAppAdminSettingsModal(page);
    this.editNotesSettingsModal = new EditAppNotesSettingsModal(page);
    this.editGeocodingSettingsModal = new EditGeocodingSettingsModal(page);
  }
}
