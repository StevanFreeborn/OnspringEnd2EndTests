import { Locator, Page } from '@playwright/test';
import { BaseAdminPage } from '../baseAdminPage';

type EmailType =
  | 'Admin Report Export'
  | 'Billed For App'
  | 'Billed For User'
  | 'Community Access'
  | 'Dashboard Export'
  | 'Data Connector'
  | 'Document Generation'
  | 'Import'
  | 'Messaging'
  | 'Package Import'
  | 'Password Reset'
  | 'Password Setup'
  | 'Pending Email Task'
  | 'Pending Text Message Task'
  | 'Record Retention'
  | 'Report Export'
  | 'SMS Registration Approved'
  | 'SMS Registration Rejected'
  | 'SMS Registration Submitted'
  | 'Survey Campaign'
  | 'Survey Delegated Pages Complete'
  | 'Survey Delegate'
  | 'Survey Password Reset'
  | 'SMS Limit Approaching'
  | 'SMS Limit Exceeded'
  | 'SMS Sign Up'
  | 'Unlaunched Survey'
  | 'Workflow'
  | 'Workflow Finish';

export class EmailHistoryPage extends BaseAdminPage {
  private readonly path: string;
  private readonly getHistoryPath: string;
  private readonly emailTypeSelector: Locator;
  private readonly appSelector: Locator;
  readonly emailsGrid: Locator;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Reporting/Messaging/History';
    this.getHistoryPath = '/Admin/Reporting/Messaging/GetHistoryPage';
    this.emailTypeSelector = page.getByRole('listbox', { name: 'Email Type' });
    this.appSelector = page.getByRole('listbox', { name: 'App/Survey' });
    this.emailsGrid = page.locator('#grid .k-grid-content');
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async selectTypeFilter(emailType: EmailType) {
    await this.emailTypeSelector.click();

    const getHistoryResponse = this.page.waitForResponse(this.getHistoryPath);
    await this.page.getByRole('option', { name: emailType }).click();
    await getHistoryResponse;
  }

  async selectAppFilter(appName: string) {
    await this.appSelector.click();

    const getHistoryResponse = this.page.waitForResponse(this.getHistoryPath);
    await this.page.getByRole('option', { name: appName }).click();
    await getHistoryResponse;
  }
}
