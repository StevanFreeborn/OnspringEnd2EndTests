import { Locator, Page } from '@playwright/test';
import { SurveyDesignerModal } from '../modals/surveyDesignerModal';

export class SurveyDesignTab {
  readonly designSurveyLink: Locator;
  readonly surveyDesignerModal: SurveyDesignerModal;

  constructor(page: Page) {
    this.designSurveyLink = page.getByRole('link', { name: 'Design Survey' });
    this.surveyDesignerModal = new SurveyDesignerModal(page);
  }
}
