import { Locator } from '@playwright/test';

export class ContentRecordActionMenu {
  private readonly menu: Locator;
  readonly copyRecordLink: Locator;
  readonly printRecordLink: Locator;
  readonly generateDocumentLink: Locator;
  readonly viewVersionHistoryLink: Locator;
  readonly deleteRecordLink: Locator;
  readonly editLayoutLink: Locator;

  constructor(menu: Locator) {
    this.menu = menu;
    this.copyRecordLink = this.menu.getByText('Copy Record');
    this.printRecordLink = this.menu.getByText('Print Record');
    this.generateDocumentLink = this.menu.getByText('Generate Document');
    this.viewVersionHistoryLink = this.menu.getByText('View Version History');
    this.deleteRecordLink = this.menu.getByText('Delete Record');
    this.editLayoutLink = this.menu.getByText('Edit Layout');
  }
}
