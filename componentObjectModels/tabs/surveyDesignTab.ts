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
    const autoSaveDialog = this.surveyDesignerModal.autoSaveDialog;
    await this.page.addLocatorHandler(
      autoSaveDialog.dialog,
      async () => {
        await autoSaveDialog.dismiss();
      },
      { times: 1 }
    );

    await this.designSurveyLink.click();
    await this.page.waitForLoadState('networkidle');
  }
}
