import { Locator, Page } from '@playwright/test';
import { DeleteRecordDialog } from '../../componentObjectModels/dialogs/deleteRecordDialog';
import { ContentRecordActionMenu } from '../../componentObjectModels/menus/contentRecordActionMenu';
import { GenerateDynamicDocumentModal } from '../../componentObjectModels/modals/generateDynamicDocumentModal';
import { PrintContentRecordModal } from '../../componentObjectModels/modals/printContentRecordModal';
import { BaseFormPage } from '../baseFormPage';

export class BaseContentPage extends BaseFormPage {
  protected readonly contentContainer: Locator;
  readonly pinRecordButton: Locator;
  readonly actionMenuButton: Locator;
  readonly actionMenu: ContentRecordActionMenu;
  readonly deleteRecordDialog: DeleteRecordDialog;
  readonly printRecordModal: PrintContentRecordModal;
  readonly generateDocumentModal: GenerateDynamicDocumentModal;

  protected constructor(page: Page) {
    super(page);
    this.contentContainer = this.page.locator('div.contentContainer').first();
    this.pinRecordButton = page.getByTitle('Pin Record', { exact: true });
    this.actionMenuButton = page.locator('#action-menu-button');
    this.actionMenu = new ContentRecordActionMenu(page.locator('#action-menu'));
    this.deleteRecordDialog = new DeleteRecordDialog(page);
    this.printRecordModal = new PrintContentRecordModal(page);
    this.generateDocumentModal = new GenerateDynamicDocumentModal(page);
  }
}
