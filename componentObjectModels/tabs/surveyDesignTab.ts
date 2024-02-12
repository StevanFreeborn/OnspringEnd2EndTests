import { Locator, Page, Response } from '@playwright/test';
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
    const handleDesignerAlert = async (response: Response) => {
      if (response.url().match(this.autoSaveAlertPathRegex)) {
        await this.surveyDesignerModal.autoSaveDialog.dismiss();
      }
    };

    this.page.on('response', handleDesignerAlert);

    await this.designSurveyLink.click();
    await this.page.waitForLoadState('networkidle');

    this.page.off('response', handleDesignerAlert);
  }
}
