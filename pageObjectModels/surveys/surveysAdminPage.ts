import { Locator, Page } from '@playwright/test';
import { CreateSurveyDialog } from '../../componentObjectModels/dialogs/createSurveyDialog';
import { DeleteSurveyDialog } from '../../componentObjectModels/dialogs/deleteSurveyDialog';
import { CreateSurveyModal } from '../../componentObjectModels/modals/createSurveyModal';
import { BaseAdminPage } from '../baseAdminPage';
import { TEST_SURVEY_NAME } from './../../factories/fakeDataFactory';

export class SurveysAdminPage extends BaseAdminPage {
  readonly path: string;
  private readonly deleteSurveyPathRegex: RegExp;
  private readonly readSurveyListPathRegex: RegExp;
  readonly createSurveyButton: Locator;
  readonly surveyGrid: Locator;
  readonly createSurveyDialog: CreateSurveyDialog;
  readonly createSurveyModal: CreateSurveyModal;
  readonly deleteSurveyDialog: DeleteSurveyDialog;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Survey';
    this.deleteSurveyPathRegex = /\/Admin\/Survey\/\d+\/Delete/;
    this.readSurveyListPathRegex = /\/Admin\/Survey\/SurveyListRead/;
    this.createSurveyButton = page.locator('.create-button');
    this.surveyGrid = page.locator('#grid');
    this.createSurveyDialog = new CreateSurveyDialog(page);
    this.createSurveyModal = new CreateSurveyModal(page);
    this.deleteSurveyDialog = new DeleteSurveyDialog(page);
  }

  async goto() {
    await this.page.goto(this.path, { waitUntil: 'networkidle' });
  }

  async createSurvey(surveyName: string) {
    await this.createSurveyButton.click();

    await this.createSurveyDialog.continueButton.waitFor();
    await this.createSurveyDialog.continueButton.click();

    await this.page.waitForLoadState('networkidle');
    await this.createSurveyModal.nameInput.waitFor();

    await this.createSurveyModal.nameInput.fill(surveyName);
    await this.createSurveyModal.saveButton.click();
  }

  async deleteAllTestSurveys() {
    await this.goto();

    const surveyRow = this.surveyGrid.getByRole('row', { name: new RegExp(TEST_SURVEY_NAME, 'i') }).first();
    let isVisible = await surveyRow.isVisible();

    while (isVisible) {
      await surveyRow.hover();
      await surveyRow.getByTitle('Delete Survey').click();
      await this.deleteSurveyDialog.confirmationInput.pressSequentially('OK', {
        delay: 100,
      });

      const deleteResponse = this.page.waitForResponse(this.deleteSurveyPathRegex);
      const refreshListResponse = this.page.waitForResponse(this.readSurveyListPathRegex);

      await this.deleteSurveyDialog.deleteButton.click();

      await deleteResponse;
      await refreshListResponse;

      isVisible = await surveyRow.isVisible();
    }
  }

  async deleteSurveys(surveysToDelete: string[]) {
    await this.goto();

    for (const surveyName of surveysToDelete) {
      const surveyRow = this.surveyGrid.getByRole('row', { name: surveyName }).first();
      const rowElement = await surveyRow.elementHandle();

      if (rowElement === null) {
        continue;
      }

      await surveyRow.hover();
      await surveyRow.getByTitle('Delete Survey').click();
      await this.deleteSurveyDialog.confirmationInput.pressSequentially('OK', {
        delay: 100,
      });
      await this.deleteSurveyDialog.deleteButton.click();
      await this.deleteSurveyDialog.waitForDialogToBeDismissed();
      await rowElement.waitForElementState('hidden');
    }
  }
}
