import { FrameLocator, Locator } from '@playwright/test';
import { BaseDesignerTab } from './baseDesignerTab';

export abstract class BaseDashboardDesignerTab extends BaseDesignerTab {
  private readonly appsSurveysFilterSelector: Locator;

  constructor(frame: FrameLocator) {
    super(frame);
    this.appsSurveysFilterSelector = this.frame.getByRole('listbox');
  }

  protected async filterByAppOrSurvey(appOrSurvey: string) {
    await this.appsSurveysFilterSelector.click();
    await this.frame.getByRole('option', { name: appOrSurvey }).click();
  }
}
