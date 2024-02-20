import { Locator, Page } from '@playwright/test';
import { ContentRecordActionMenu } from '../../componentObjectModels/menus/contentRecordActionMenu';
import { BASE_URL } from '../../playwright.config';
import { EditableContentPage } from './editableContentPage';

export class EditContentPage extends EditableContentPage {
  readonly pathRegex: RegExp;
  readonly actionMenuButton: Locator;
  readonly actionMenu: ContentRecordActionMenu;
  readonly viewRecordButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pathRegex = new RegExp(`${BASE_URL}/Content/[0-9]+/[0-9]+/Edit`);
    this.actionMenuButton = this.page.locator('#action-menu-button');
    this.actionMenu = new ContentRecordActionMenu(this.page.locator('#action-menu'));
    this.viewRecordButton = this.page.getByRole('link', { name: 'View Record' });
  }

  async goto(appId: number, recordId: number) {
    await this.page.goto(`/Content/${appId}/${recordId}/Edit`);
  }

  getRecordIdFromUrl() {
    if (this.page.url().match(this.pathRegex) === null) {
      throw new Error('The current page is not a content edit page.');
    }

    const url = this.page.url();
    const urlParts = url.split('/');
    const recordId = urlParts[urlParts.length - 2];
    return parseInt(recordId);
  }

  async save() {
    const saveResponse = this.page.waitForResponse(
      response => response.url().match(this.pathRegex) !== null && response.request().method() === 'POST'
    );

    await this.saveRecordButton.click();
    await saveResponse;
  }
}
