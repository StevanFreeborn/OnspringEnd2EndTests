import { Page } from '@playwright/test';
import { BasePage } from '../basePage';

export class ReportPage extends BasePage {
  readonly pathRegex: RegExp;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Report\/\d+\/Display/;
  }

  async goto(reportId: number) {
    await this.page.goto(`/Report/${reportId}/Display`, { waitUntil: 'networkidle' });
  }

  async getReportIdFromUrl() {
    if (this.page.url().match(this.pathRegex) === null) {
      throw new Error('The current page is not a report display page.');
    }

    const url = this.page.url();
    const urlParts = url.split('/');
    const reportId = urlParts[urlParts.length - 2];
    return parseInt(reportId);
  }
}
