import { Page } from '@playwright/test';
import { DualPaneSelector } from './../controls/dualPaneSelector';

export abstract class MessageRecipientsTab {
  private readonly page: Page;
  readonly basedOnFieldValuesSelector: DualPaneSelector;
  readonly specificGroupsSelector: DualPaneSelector;
  readonly specificUsersSelector: DualPaneSelector;

  protected getSelectorLocator(label: string) {
    return this.page.locator(`.label:has-text("${label}") + .data .onx-selector`);
  }

  constructor(page: Page) {
    this.page = page;
    this.basedOnFieldValuesSelector = new DualPaneSelector(this.getSelectorLocator('Based on Values in these Fields'));
    this.specificGroupsSelector = new DualPaneSelector(this.getSelectorLocator('Specific Groups'));
    this.specificUsersSelector = new DualPaneSelector(this.getSelectorLocator('Specific Users'));
  }
}
