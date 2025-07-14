import { Locator, Page } from '../../fixtures';
import { SecureFileDataConnector } from '../../models/secureFileDataConnector';
import { DataConnectorConnectionTab } from './dataConnectorConnectionTab';

export class SecureFileConnectionTab extends DataConnectorConnectionTab {
  private readonly getDataPath: string;
  private readonly appSurveySelector: Locator;
  private readonly hostNameInput: Locator;
  private readonly portNumberInput: Locator;
  private readonly fileLocationInput: Locator;
  private readonly fileNameInput: Locator;
  private readonly fileTypeSelector: Locator;
  private readonly headerRowCheckbox: Locator;
  private readonly trimLeadingSpacesCheckbox: Locator;
  private readonly trimTrailingSpacesCheckbox: Locator;
  private readonly authenticationTypeSelector: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly privateKeyInput: Locator;
  private readonly connectAndRefreshLink: Locator;

  constructor(page: Page) {
    super(page);
    this.getDataPath = '/Admin/Integration/DataConnector/GetDataAsync';
    this.appSurveySelector = this.page.locator('.label:has-text("App/Survey") + .data').getByRole('listbox');
    this.hostNameInput = this.page.locator('.label:has-text("Host Name") + .data').getByRole('textbox');
    this.portNumberInput = this.page.locator('.label:has-text("Port Number") + .data input:visible');
    this.fileLocationInput = this.page.locator('.label:has-text("File Location") + .data').getByRole('textbox');
    this.fileNameInput = this.page.locator('.label:has-text("File Name") + .data').getByRole('textbox');
    this.fileTypeSelector = this.page.locator('.label:has-text("File Type") + .data').getByRole('listbox');
    this.headerRowCheckbox = this.page.getByRole('checkbox', { name: 'File contains a header row' });
    this.trimLeadingSpacesCheckbox = this.page.getByRole('checkbox', { name: 'Trim leading spaces from all fields' });
    this.trimTrailingSpacesCheckbox = this.page.getByRole('checkbox', { name: 'Trim trailing spaces from all fields' });
    this.authenticationTypeSelector = this.page
      .locator('.label:has-text("Authentication Type") + .data')
      .getByRole('listbox');
    this.usernameInput = this.page.locator('.label:has-text("Username") + .data').getByRole('textbox');
    this.passwordInput = this.page.locator('.label:has-text("Password") + .data').getByRole('textbox');
    this.privateKeyInput = this.page.locator('.label:has-text("Private Key") + .data').getByRole('textbox');
    this.connectAndRefreshLink = this.page.getByRole('link', { name: 'Connect and refresh Data Source fields' });
  }

  private async selectAppSurvey(appSurvey: string) {
    await this.appSurveySelector.click();
    await this.page.getByRole('option', { name: appSurvey }).click();
  }

  private async selectFileType(fileType: string) {
    await this.fileTypeSelector.click();
    await this.page.getByRole('option', { name: fileType }).click();
  }

  private async selectAuthenticationType(authType: string) {
    await this.authenticationTypeSelector.click();
    await this.page.getByRole('option', { name: authType }).click();
  }

  async fillOutForm(dataConnector: SecureFileDataConnector) {
    await super.fillOutForm(dataConnector);
    await this.selectAppSurvey(dataConnector.app);

    await this.hostNameInput.fill(dataConnector.hostname);
    await this.portNumberInput.fill(dataConnector.port.toString());
    await this.fileLocationInput.fill(dataConnector.fileLocation);
    await this.fileNameInput.fill(dataConnector.fileName);
    await this.selectFileType(dataConnector.fileType);
    await this.headerRowCheckbox.setChecked(dataConnector.hasHeaderRow);
    await this.trimLeadingSpacesCheckbox.setChecked(dataConnector.trimLeadingSpaces);
    await this.trimTrailingSpacesCheckbox.setChecked(dataConnector.trimTrailingSpaces);

    await this.selectAuthenticationType(dataConnector.authType.type);

    if (dataConnector.authType.username) {
      await this.usernameInput.fill(dataConnector.authType.username);
    }

    if (dataConnector.authType.password) {
      await this.passwordInput.fill(dataConnector.authType.password);
    }

    if (dataConnector.authType.type === 'SSH Key') {
      await this.privateKeyInput.fill(dataConnector.authType.privateKey);
    }

    const getDataResponse = this.page.waitForResponse(this.getDataPath);
    await this.connectAndRefreshLink.click();
    const response = await getDataResponse;
    const data = await response.json();

    if (response.ok() === false || data.success === false) {
      await this.page.getByRole('dialog', { name: 'Connection Failed' }).getByRole('button', { name: 'Close' }).click();
      throw new Error('Failed to connect and refresh data source fields');
    }

    await this.page
      .getByRole('dialog', { name: 'Authentication Successful' })
      .getByRole('button', { name: 'Close' })
      .click();
  }
}
