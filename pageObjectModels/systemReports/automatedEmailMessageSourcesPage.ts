import { Locator, Page } from "@playwright/test";
import { BaseAdminPage } from "../baseAdminPage";

type EmailType =
  | "Data Connector"
  | "Email Body"
  | "Record Retention"
  | "Scheduled Report"
  | "Unlaunched Survey"
  | "Workflow Finish"
  | "Workflow Step";

type AutomatedEmailMessageSourceFilter = {
  emailType?: EmailType;
  appOrSurvey?: string | "All Apps & Surveys";
  group?: string | "All Groups";
  user?: string | "All Users";
};

export class AutomatedEmailMessageSourcesPage extends BaseAdminPage {
  private readonly path: string;
  private readonly getAuditHistoryPath: string;
  private readonly emailTypeSelector: Locator;
  private readonly appOrSurveySelector: Locator;
  private readonly groupSelector: Locator;
  private readonly userSelector: Locator;
  private readonly sourcesGridBody: Locator;
  
  constructor(page: Page) {
    super(page);
    this.path = '/Admin/Reporting/Messaging/AutomatedSources';
    this.getAuditHistoryPath = '/Admin/Reporting/Messaging/GetAutomatedSourcesPage';
    this.emailTypeSelector = this.page.locator('.label:has-text("Email Type") + .data').getByRole('listbox');
    this.appOrSurveySelector = this.page.locator('.label:has-text("App/Survey") + .data').getByRole('listbox');
    this.groupSelector = this.page.locator('.label:has-text("Group") + .data').getByRole('listbox');
    this.userSelector = this.page.locator('.label:has-text("User") + .data').getByRole('listbox');
    this.sourcesGridBody = this.page.locator('#grid .k-grid-content');  
  }

  async goto() {
    const getAuditHistoryResponse = this.page.waitForResponse(this.getAuditHistoryPath);
    await this.page.goto(this.path);
    await getAuditHistoryResponse;
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
    emailType = "Email Body",
    appOrSurvey = "All Apps & Surveys",
    group = "All Groups",
    user = "All Users",
  }: AutomatedEmailMessageSourceFilter) {
    const existingEmailTypeFilter = await this.emailTypeSelector.innerText();

    if (existingEmailTypeFilter.trim() !== emailType) {
      const emailTypeFilterResponse = this.page.waitForResponse(this.getAuditHistoryPath);
      await this.selectEmailType(emailType);
      await emailTypeFilterResponse;
    }

    const existingAppOrSurveyFilter = await this.appOrSurveySelector.innerText();

    if (existingAppOrSurveyFilter.trim() !== appOrSurvey) {
      const appOrSurveyFilterResponse = this.page.waitForResponse(this.getAuditHistoryPath);
      await this.selectAppOrSurvey(appOrSurvey);
      await appOrSurveyFilterResponse;
    }
    
    const existingGroupFilter = await this.groupSelector.innerText();

    if (existingGroupFilter.trim() !== group) {
      const groupFilterResponse = this.page.waitForResponse(this.getAuditHistoryPath);
      await this.selectGroup(group);
      await groupFilterResponse;
    }

    const existingUserFilter = await this.userSelector.innerText();

    if (existingUserFilter.trim() !== user) {
      const userFilterResponse = this.page.waitForResponse(this.getAuditHistoryPath);
      await this.selectUser(user);
      await userFilterResponse;
    }
  }

  async getRows() {
    return this.sourcesGridBody.locator('tr').all();
  }
}
