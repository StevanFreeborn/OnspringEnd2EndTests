import { Locator, Page } from '@playwright/test';
import { ResendEmailDialog } from '../../componentObjectModels/dialogs/resendEmailDialog';
import { EmailMessageDetailModal } from '../../componentObjectModels/modals/emailMessageDetailModal';
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

const GRID_COLUMNS = [
  'Email Type',
  'To Name',
  'To Address',
  'From Address',
  'Subject',
  'Time Created',
  'Time Sent',
  'Resend',
] as const;

type GridColumn = (typeof GRID_COLUMNS)[number];
type SortableGridColumn = Exclude<GridColumn, 'Resend'>;
type SortDirection = 'ascending' | 'descending';

export class EmailHistoryPage extends BaseAdminPage {
  private readonly path: string;
  private readonly getHistoryPath: string;
  private readonly emailTypeSelector: Locator;
  private readonly appSelector: Locator;
  private readonly emailsGridHeader: Locator;
  private readonly exportReportButton: Locator;
  private readonly exportReportDialog: Locator;
  readonly emailsGridBody: Locator;
  readonly messageDetailModal: EmailMessageDetailModal;
  readonly resendEmailDialog: ResendEmailDialog;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Reporting/Messaging/History';
    this.getHistoryPath = '/Admin/Reporting/Messaging/GetHistoryPage';
    this.emailTypeSelector = page.getByRole('listbox', { name: 'Email Type' });
    this.appSelector = page.getByRole('listbox', { name: 'App/Survey' });
    this.emailsGridHeader = page.locator('#grid .k-grid-header');
    this.exportReportButton = page.getByRole('link', { name: 'Export Report' });
    this.exportReportDialog = page.getByRole('dialog', { name: 'Export Report' });
    this.emailsGridBody = page.locator('#grid .k-grid-content');
    this.messageDetailModal = new EmailMessageDetailModal(page);
    this.resendEmailDialog = new ResendEmailDialog(page);
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

  async clearGridSorting() {
    const numOfSortableHeaders = await this.emailsGridHeader.locator('[data-role="columnsorter"]').count();

    for (let i = 0; i < numOfSortableHeaders; i++) {
      const currentHeader = this.emailsGridHeader.locator('[data-role="columnsorter"]').nth(i);
      let isSorted = await currentHeader.getAttribute('aria-sort');

      while (isSorted) {
        const sortResponse = this.page.waitForResponse(this.getHistoryPath);
        await currentHeader.getByRole('link').click();
        await sortResponse;

        isSorted = await currentHeader.getAttribute('aria-sort');
      }
    }
  }

  async sortGridBy(column: SortableGridColumn, direction: SortDirection = 'ascending') {
    const columnHeader = this.emailsGridHeader.getByRole('columnheader', { name: column });
    let currentSortDirection = await columnHeader.getAttribute('aria-sort');

    while (currentSortDirection !== direction) {
      const sortResponse = this.page.waitForResponse(this.getHistoryPath);
      await columnHeader.click();
      await sortResponse;

      currentSortDirection = await columnHeader.getAttribute('aria-sort');
    }
  }

  async exportReport() {
    await this.exportReportButton.click();
    await this.exportReportDialog.waitFor();
    await this.exportReportDialog.getByRole('button', { name: 'Export' }).click();
  }
}
