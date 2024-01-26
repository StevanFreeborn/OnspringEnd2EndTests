import { Locator, Page } from '@playwright/test';
import { SurveyDesignerModal } from '../modals/surveyDesignerModal';

export class SurveyDesignTab {
  private readonly page: Page;
  readonly designSurveyLink: Locator;
  readonly surveyDesignerModal: SurveyDesignerModal;

  constructor(page: Page) {
    this.page = page;
    this.designSurveyLink = page.getByRole('link', { name: 'Design Survey' });
    this.surveyDesignerModal = new SurveyDesignerModal(page);
  }

  async openSurveyDesigner() {
    await this.designSurveyLink.click();
    await this.page.waitForLoadState('networkidle');

    if (await this.surveyDesignerModal.autoSaveDialog.isVisible()) {
      await this.surveyDesignerModal.autoSaveDialog.dismiss();
    }
  }
}
