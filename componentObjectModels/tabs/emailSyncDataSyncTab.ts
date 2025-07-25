import { Locator, Page } from '../../fixtures';
import { EmailSync } from '../../models/emailSync';
import { StatusSwitch } from '../controls/statusSwitchControl';

export class EmailSyncDataSyncTab {
  private readonly appOrSurveySelector: Locator;
  private readonly emailKeyInput: Locator;
  private readonly statusSwitch: StatusSwitch;
  private readonly nameInput: Locator;

  constructor(page: Page) {
    this.nameInput = page.locator('.label:has-text("Name") + .data').getByRole('textbox');
    this.appOrSurveySelector = page.locator('.label:has-text("App/Survey") + .data').getByRole('listbox');
    this.emailKeyInput = page.locator('.label:has-text("Email Key") + .data').getByRole('textbox');
    this.statusSwitch = new StatusSwitch(page.locator('.label:has-text("Status") + .data'));
  }

  private async selectAppOrSurvey(appOrSurvey: string) {
    await this.appOrSurveySelector.click();
    await this.appOrSurveySelector.page().getByRole('option', { name: appOrSurvey }).click();
  }

  name() {
    return this.nameInput;
  }

  emailKey() {
    return this.emailKeyInput;
  }

  async fillOutForm(emailSync: EmailSync) {
    await this.nameInput.fill(emailSync.name);
    await this.selectAppOrSurvey(emailSync.appOrSurvey);
    await this.emailKeyInput.pressSequentially(emailSync.emailKey, { delay: 150 });
    await this.statusSwitch.toggle(emailSync.status);
  }
}
