import { Locator, Page } from '@playwright/test';
import { BaseAdminPage } from '../baseAdminPage';

type EmailType =
  | 'Data Connector'
  | 'Email Body'
  | 'Record Retention'
  | 'Scheduled Report'
  | 'Unlaunched Survey'
  | 'Workflow Finish'
  | 'Workflow Step';

type AutomatedEmailMessageSourceFilter = {
  emailType?: EmailType;
  appOrSurvey?: string | 'All Apps & Surveys';
  group?: string | 'All Groups';
  user?: string | 'All Users';
};

type SortableGridColumn = 'App/Survey Name' | 'Item Name';
type SortDirection = 'ascending' | 'descending';

export class AutomatedEmailMessageSourcesPage extends BaseAdminPage {
  private readonly path: string;
  private readonly getAutomatedSourcesPath: string;
  private readonly emailTypeSelector: Locator;
  private readonly appOrSurveySelector: Locator;
  private readonly groupSelector: Locator;
  private readonly userSelector: Locator;
  private readonly sourcesGridHeader: Locator;
  private readonly sourcesGridBody: Locator;

  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Reporting/Messaging/AutomatedSources';
    this.getAutomatedSourcesPath = '/Admin/Reporting/Messaging/GetAutomatedSourcesPage';
    this.emailTypeSelector = this.page.locator('.label:has-text("Email Type") + .data').getByRole('listbox');
    this.appOrSurveySelector = this.page.locator('.label:has-text("App/Survey") + .data').getByRole('listbox');
    this.groupSelector = this.page.locator('.label:has-text("Group") + .data').getByRole('listbox');
    this.userSelector = this.page.locator('.label:has-text("User") + .data').getByRole('listbox');
    this.sourcesGridHeader = this.page.locator('#grid .k-grid-header');
    this.sourcesGridBody = this.page.locator('#grid .k-grid-content');
  }

  async goto() {
    const getAutomatedSourcesResponse = this.page.waitForResponse(this.getAutomatedSourcesPath);
    await this.page.goto(this.path);
    await getAutomatedSourcesResponse;
  }

  private async selectEmailType(emailType: string) {
    await this.emailTypeSelector.click();
    await this.page.getByRole('option', { name: emailType }).click();
  }

  private async selectAppOrSurvey(appOrSurvey: string) {
    await this.appOrSurveySelector.click();
    await this.page.getByRole('option', { name: appOrSurvey }).click();
  }

  private async selectGroup(group: string) {
    await this.groupSelector.click();
    await this.page.getByRole('option', { name: group }).click();
  }

  private async selectUser(user: string) {
    await this.userSelector.click();
    await this.page.getByRole('option', { name: user }).click();
  }

  async applyFilter({
    emailType = 'Email Body',
    appOrSurvey = 'All Apps & Surveys',
    group = 'All Groups',
    user = 'All Users',
  }: AutomatedEmailMessageSourceFilter) {
    // Wait for the grid filters to be applied before applying new filters
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(1000);

    const existingEmailTypeFilter = await this.emailTypeSelector.innerText();

    if (existingEmailTypeFilter.trim() !== emailType) {
      const emailTypeFilterResponse = this.page.waitForResponse(this.getAutomatedSourcesPath);
      await this.selectEmailType(emailType);
      await emailTypeFilterResponse;
    }

    const existingAppOrSurveyFilter = await this.appOrSurveySelector.innerText();

    if (existingAppOrSurveyFilter.trim() !== appOrSurvey) {
      const appOrSurveyFilterResponse = this.page.waitForResponse(this.getAutomatedSourcesPath);
      await this.selectAppOrSurvey(appOrSurvey);
      await appOrSurveyFilterResponse;
    }

    const existingGroupFilter = await this.groupSelector.innerText();

    if (existingGroupFilter.trim() !== group) {
      const groupFilterResponse = this.page.waitForResponse(this.getAutomatedSourcesPath);
      await this.selectGroup(group);
      await groupFilterResponse;
    }

    const existingUserFilter = await this.userSelector.innerText();

    if (existingUserFilter.trim() !== user) {
      const userFilterResponse = this.page.waitForResponse(this.getAutomatedSourcesPath);
      await this.selectUser(user);
      await userFilterResponse;
    }
  }

  async sortGridBy(column: SortableGridColumn, direction: SortDirection = 'ascending') {
    const columnHeader = this.sourcesGridHeader.getByRole('columnheader', { name: column });
    let currentSortDirection = await columnHeader.getAttribute('aria-sort');

    while (currentSortDirection !== direction) {
      const sortResponse = this.page.waitForResponse(this.getAutomatedSourcesPath);
      await columnHeader.click();
      await sortResponse;

      currentSortDirection = await columnHeader.getAttribute('aria-sort');
    }
  }

  async getRows() {
    return this.sourcesGridBody.locator('tr').all();
  }
}
