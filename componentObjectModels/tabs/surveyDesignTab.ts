import { Locator, Page } from '@playwright/test';
import { SurveyDesignerModal } from '../modals/surveyDesignerModal';

export class SurveyDesignTab {
  private readonly page: Page;
  private readonly autoSaveAlertPathRegex: RegExp;
  readonly designSurveyLink: Locator;
  readonly surveyDesignerModal: SurveyDesignerModal;

  constructor(page: Page) {
    this.page = page;
    this.autoSaveAlertPathRegex = /\/Admin\/Survey\/\d+\/DesignerAlert/;
    this.designSurveyLink = page.getByRole('link', { name: 'Design Survey' });
    this.surveyDesignerModal = new SurveyDesignerModal(page);
  }

  async openSurveyDesigner() {
    this.page.once('response', async response => {
      if (response.url().match(this.autoSaveAlertPathRegex)) {
        await this.surveyDesignerModal.autoSaveDialog.dismiss();
      }
    });

    await this.designSurveyLink.click();
    await this.page.waitForLoadState('networkidle');
  }
}
