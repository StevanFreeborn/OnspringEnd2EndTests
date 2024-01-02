import { Page } from '@playwright/test';
import { EditAppAdminSettingsModal } from '../modals/editAppAdminSettingsModal';
import { EditAppDisplaySettingsModal } from '../modals/editAppDisplaySettingsModal';
import { EditAppGeneralSettingsModal } from '../modals/editAppGeneralSettingsModal';
import { EditAppNotesSettingsModal } from '../modals/editAppNotesSettingsModal';
import { EditGeocodingSettingsModal } from '../modals/editGeocodingSettingsModal';
import { BaseAppOrSurveyGeneralTab } from './baseAppOrSurveyGeneralTab';

export class AppGeneralTab extends BaseAppOrSurveyGeneralTab {
  readonly editAppGeneralSettingsModal: EditAppGeneralSettingsModal;
  readonly editAppDisplaySettingsModal: EditAppDisplaySettingsModal;
  readonly editAppAdminSettingsModal: EditAppAdminSettingsModal;
  readonly editAppNotesSettingsModal: EditAppNotesSettingsModal;
  readonly editGeocodingSettingsModal: EditGeocodingSettingsModal;

  constructor(page: Page) {
    super(page);
    this.editAppGeneralSettingsModal = new EditAppGeneralSettingsModal(page);
    this.editAppDisplaySettingsModal = new EditAppDisplaySettingsModal(page);
    this.editAppAdminSettingsModal = new EditAppAdminSettingsModal(page);
    this.editAppNotesSettingsModal = new EditAppNotesSettingsModal(page);
    this.editGeocodingSettingsModal = new EditGeocodingSettingsModal(page);
  }
}
