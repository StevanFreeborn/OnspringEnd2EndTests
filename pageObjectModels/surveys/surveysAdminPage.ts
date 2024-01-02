import { Locator, Page } from '@playwright/test';
import { CreateSurveyDialog } from '../../componentObjectModels/dialogs/createSurveyDialog';
import { DeleteSurveyDialog } from '../../componentObjectModels/dialogs/deleteSurveyDialog';
import { CreateSurveyModal } from '../../componentObjectModels/modals/createSurveyModal';
import { BaseAdminPage } from '../baseAdminPage';

export class SurveysAdminPage extends BaseAdminPage {
  readonly path: string;
  readonly createSurveyButton: Locator;
  readonly surveyGrid: Locator;
  readonly createSurveyDialog: CreateSurveyDialog;
  readonly createSurveyModal: CreateSurveyModal;
  readonly deleteSurveyDialog: DeleteSurveyDialog;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Survey';
    this.createSurveyButton = page.locator('.create-button');
    this.surveyGrid = page.locator('#grid');
    this.createSurveyDialog = new CreateSurveyDialog(page);
    this.createSurveyModal = new CreateSurveyModal(page);
    this.deleteSurveyDialog = new DeleteSurveyDialog(page);
  }
}
