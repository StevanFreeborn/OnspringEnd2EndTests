import { Locator, Page } from '@playwright/test';
import { BasePage } from '../basePage';

export class ReportPage extends BasePage {
  readonly pathRegex: RegExp;
  readonly breadcrumb: Locator;
  private readonly reportContents: Locator;
  readonly dataGridContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Report\/\d+\/Display/;
    this.breadcrumb = page.locator('.bcrumb-container');
    this.reportContents = page.locator('#report-contents');
    this.dataGridContainer = this.reportContents.locator('#grid');
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
