import { Locator, Page } from '@playwright/test';
import { DataConnector } from '../../models/dataConnector';
import { MappingGrid } from '../controls/mappingGrid';

export abstract class MultiAppDataMappingTab {
  private readonly page: Page;
  private readonly mappingContainer: Locator;
  private readonly fieldMappingContainer: Locator;
  private readonly dataRulesContainer: Locator;
  private readonly recordHandlingSelector: Locator;
  private readonly sourceMatchFieldSelector: Locator;
  private readonly appMatchFieldSelector: Locator;
  private readonly messagingSelector;
  private readonly refAndListConfigContainer: Locator;
  protected readonly mappingGrid: MappingGrid;
  protected readonly referenceConfigGrid: Locator;
  protected readonly listConfigGrid: Locator;

  private getDataRoleSettingControl(settingName: string) {
    return this.dataRulesContainer.locator(`.label:has-text("${settingName}") + .data`).getByRole('listbox');
  }

  constructor(page: Page) {
    this.page = page;
    this.mappingContainer = this.page.locator('#field-mapping-container');
    this.fieldMappingContainer = this.page.locator('#field-mapping-designer');
    this.dataRulesContainer = this.page.locator('section', {
      has: this.page.getByRole('heading', { name: /data rules/i }),
    });

    this.recordHandlingSelector = this.getDataRoleSettingControl('Record Handling');
    this.sourceMatchFieldSelector = this.getDataRoleSettingControl('Source Match Field');
    this.appMatchFieldSelector = this.getDataRoleSettingControl('App Match Field');
    this.messagingSelector = this.getDataRoleSettingControl('Messaging');

    this.refAndListConfigContainer = this.page.locator('section', {
      has: this.page.getByRole('heading', { name: /reference and list value configuration/i }),
    });

    this.mappingGrid = new MappingGrid(this.fieldMappingContainer.locator('.layoutDesigner'));
    this.referenceConfigGrid = this.refAndListConfigContainer
      .locator('.label:has-text("Reference Configuration") + .data')
      .locator('table');

    this.listConfigGrid = this.refAndListConfigContainer
      .locator('.label:has-text("List Configuration") + .data')
      .locator('table');
  }

  private getAppSummaryContainer(appName: string) {
    return this.mappingContainer.locator('.app-summary', {
      has: this.page.locator(`.app-name:has-text("${appName}")`),
    });
  }

  private async selectOption(selector: Locator, option: string) {
    await selector.click();
    await this.page.getByRole('option', { name: option }).click();
  }

  protected getExpandButton(appName: string) {
    const appSummaryContainer = this.getAppSummaryContainer(appName);
    return appSummaryContainer.getByRole('button', { name: /expand/i });
  }

  protected async selectRecordHandlingOption(option: string) {
    await this.selectOption(this.recordHandlingSelector, option);
  }

  protected async selectSourceMatchFieldOption(option: string) {
    await this.selectOption(this.sourceMatchFieldSelector, option);
  }

  protected async selectAppMatchFieldOption(option: string) {
    await this.selectOption(this.appMatchFieldSelector, option);
  }

  protected async selectMessagingOption(option: string) {
    await this.selectOption(this.messagingSelector, option);
  }

  abstract fillOutForm(dataConnector: DataConnector): Promise<void>;
}
