import { Locator, Page } from '@playwright/test';
import { CreateListDialog } from '../../componentObjectModels/dialogs/createListDialog';
import { BaseAdminPage } from '../baseAdminPage';

export class SharedListAdminPage extends BaseAdminPage {
  readonly pathRegex: RegExp;
  private readonly createListButton: Locator;
  readonly listsGrid: Locator;
  private readonly createListDialog: CreateListDialog;

  constructor(page: Page) {
    super(page);
    this.pathRegex = /\/Admin\/SharedList/;
    this.createListButton = page.getByRole('button', { name: 'Create List' });
    this.listsGrid = page.locator('#grid');
    this.createListDialog = new CreateListDialog(page);
  }

  async goto() {
    await this.page.goto('/Admin/SharedList');
  }

  async createList(listName: string) {
    await this.createListButton.click();

    await this.createListDialog.nameInput.waitFor();
    await this.createListDialog.nameInput.fill(listName);
    await this.createListDialog.saveButton.click();
  }
}
