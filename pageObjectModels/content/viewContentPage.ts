import { Page } from '@playwright/test';
import { ViewRecordForm } from '../../componentObjectModels/forms/viewRecordForm';
import { BASE_URL } from '../../playwright.config';
import { BaseContentPage } from './baseContentPage';

export class ViewContentPage extends BaseContentPage {
  readonly pathRegex: RegExp;
  readonly form: ViewRecordForm;

  constructor(page: Page) {
    super(page);
    this.pathRegex = new RegExp(`${BASE_URL}/Content/[0-9]+/[0-9]+/View`);
    this.form = new ViewRecordForm(this.contentContainer);
  }

  async goto(appId: number, recordId: number) {
    await this.page.goto(`/Content/${appId}/${recordId}/View`);
  }
}
