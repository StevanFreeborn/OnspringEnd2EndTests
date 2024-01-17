import { Locator, Page } from '@playwright/test';
import { CreateSurveyDialog } from '../../componentObjectModels/dialogs/createSurveyDialog';
import { DeleteSurveyDialog } from '../../componentObjectModels/dialogs/deleteSurveyDialog';
import { CreateSurveyModal } from '../../componentObjectModels/modals/createSurveyModal';
import { BaseAdminPage } from '../baseAdminPage';

export class SurveysAdminPage extends BaseAdminPage {
  readonly path: string;
  readonly deleteSurveyPathRegex: RegExp;
  readonly surveyReadListPathRegex: RegExp;
  readonly createSurveyButton: Locator;
  readonly surveyGrid: Locator;
  readonly createSurveyDialog: CreateSurveyDialog;
  readonly createSurveyModal: CreateSurveyModal;
  readonly deleteSurveyDialog: DeleteSurveyDialog;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Survey';
    this.deleteSurveyPathRegex = /\/Admin\/Survey\/\d+\/Delete/;
    this.surveyReadListPathRegex = /\/Admin\/Survey\/SurveyListRead/;
    this.createSurveyButton = page.locator('.create-button');
    this.surveyGrid = page.locator('#grid');
    this.createSurveyDialog = new CreateSurveyDialog(page);
    this.createSurveyModal = new CreateSurveyModal(page);
    this.deleteSurveyDialog = new DeleteSurveyDialog(page);
  }

  async goto() {
    // TODO: This is a workaround because of an exception that can
    // occur when loading the list of surveys. It is a transient
    // state that occurs when there is a large number of concurrent
    // requests within a short period of time to both create new surveys
    // and read the list of surveys.
    // reference: https://corp.onspring.com/Content/8/4162
    const readSurveysResponsePromise = this.page.waitForResponse(this.surveyReadListPathRegex);
    await this.page.goto(this.path);
    const res = await readSurveysResponsePromise;

    let surveysLoaded = res.ok();

    while (surveysLoaded === false) {
      const refreshSurveysResponsePromise = this.page.waitForResponse(this.surveyReadListPathRegex);
      await this.page.reload();
      const res = await refreshSurveysResponsePromise;
      surveysLoaded = res.ok();
    }
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

  async deleteSurveys(surveysToDelete: string[]) {
    await this.goto();

    for (const surveyName of surveysToDelete) {
      const surveyRow = this.surveyGrid.getByRole('row', { name: surveyName }).first();
      const rowElement = await surveyRow.elementHandle();

      if (rowElement === null) {
        continue;
      }

      await surveyRow.hover();

      const deleteSurveyResponsePromise = this.page.waitForResponse(this.deleteSurveyPathRegex);
      const readSurveysResponsePromise = this.page.waitForResponse(this.surveyReadListPathRegex);
      await surveyRow.getByTitle('Delete Survey').click();
      await this.deleteSurveyDialog.confirmationInput.pressSequentially('OK', {
        delay: 100,
      });
      await this.deleteSurveyDialog.deleteButton.click();

      // TODO: This is a workaround because of an exception that can
      // occur when loading the list of surveys. It is a transient
      // state that occurs when there is a large number of concurrent
      // requests within a short period of time to both create new surveys
      // and read the list of surveys.
      // reference: https://corp.onspring.com/Content/8/4162
      await deleteSurveyResponsePromise;
      const res = await readSurveysResponsePromise;
      let surveysRefreshed = res.ok();

      while (surveysRefreshed === false) {
        const refreshSurveysResponsePromise = this.page.waitForResponse(this.surveyReadListPathRegex);
        await this.page.reload();
        const res = await refreshSurveysResponsePromise;
        surveysRefreshed = res.ok();
      }
    }
  }
}
