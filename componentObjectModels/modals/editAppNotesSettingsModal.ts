import { Page } from '@playwright/test';
import { EditBaseNotesSettingsModal } from './editBaseNotesSettingsModal';

export class EditAppNotesSettingsModal extends EditBaseNotesSettingsModal {
  constructor(page: Page) {
    super(page);
  }
}
